import { errorHandler } from "../helper/errorHandler";
import { stripeClient } from "../helper/stripeClient";
import db from "../lib/db";

import Stripe from "stripe";

const { STRIPE_SECRET_WEBHOOK, FRONTEND_URL, ENVIRONMENT } = process.env;

if (!STRIPE_SECRET_WEBHOOK) {
  throw errorHandler(500, "No Stripe webhook");
}

if (!FRONTEND_URL) {
  throw errorHandler(500, "No frontend url");
}

const getMySubscription = async ({ userId }: { userId: string }) => {
  return (
    await db.query(
      "SELECT plan_id, subscription_id FROM subscriptions WHERE user_id=$1",
      [userId],
    )
  ).rows[0];
};

const getAllSubscriptions = async () => {
  return (
    await db.query(
      "SELECT id, name, price, limits FROM subscriptionsPlan ORDER BY price ASC",
    )
  ).rows;
};

const getSubscription = async (id: string) => {
  return (
    await db.query("SELECT limits FROM subscriptionsPlan WHERE id=$1", [id])
  ).rows[0];
};

const subscribe = async ({
  userId,
  subscriptionId,
}: {
  userId: string;
  subscriptionId: string;
}) => {
  try {
    const user = (
      await db.query(
        `SELECT stripe_client_id, full_name, email FROM users WHERE role=$1 AND id=$2`,
        ["employer", userId],
      )
    ).rows[0];

    let customer;

    if (user.stripe_client_id === null) {
      customer = (
        await stripeClient.customers.create({
          name: user.full_name,
          email: user.email,
        })
      ).id;
    } else {
      customer = user.stripe_client_id;
    }

    const price = (
      await db.query(
        "SELECT stripe_price_id FROM subscriptionsPlan WHERE id=$1",
        [subscriptionId],
      )
    ).rows[0];

    if (!price) {
      throw errorHandler(500, "No subscription");
    }

    const session = await stripeClient.checkout.sessions.create({
      payment_method_types: ["card", "paypal", "klarna"],
      mode: "subscription",
      line_items: [
        {
          price: price.stripe_price_id,
          quantity: 1,
        },
      ],
      success_url:
        ENVIRONMENT === "production"
          ? FRONTEND_URL
          : "http://localhost:5173/employer/dashboard/subscriptions",
      cancel_url:
        ENVIRONMENT === "production"
          ? FRONTEND_URL
          : "http://localhost:5173/employer/dashboard/subscriptions",
      customer: customer,
      subscription_data: {
        metadata: {
          userId,
          subscriptionId,
          customer,
        },
      },
    });

    return { url: session.url };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const subscribeHook = async (data: Buffer, signature: string) => {
  try {
    const event = stripeClient.webhooks.constructEvent(
      data,
      signature,
      STRIPE_SECRET_WEBHOOK,
    );

    switch (event.type) {
      case "customer.subscription.created":
        const userId = event.data.object.metadata?.userId;
        const subscription = event.data.object.metadata?.subscriptionId;
        const customerId = event.data.object.metadata?.customer;
        const subscriptionId = event.data.object.id;

        await db.query(
          "UPDATE users SET stripe_client_id = $1 WHERE id = $2;",
          [customerId, userId],
        );

        await db.query(
          "INSERT INTO subscriptions (user_id, plan_id, stripe_customer_id, subscription_id) VALUES ($1, $2, $3, $4);",
          [userId, subscription, customerId, subscriptionId],
        );

        break;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const cancelSubscribe = async (id: string) => {
  try {
    await stripeClient.subscriptions.cancel(id);

    await stripeClient.subscriptions.retrieve(id);

    return (
      await db.query("DELETE FROM subscriptions WHERE subscription_id = $1 ", [
        id,
      ])
    ).rows[0];
  } catch (error) {
    throw error;
  }
};

const getInvoices = async ({ userId }: { userId: string }) => {
  const user = (
    await db.query(
      "SELECT u.stripe_client_id, s.subscription_id FROM users u LEFT JOIN subscriptions s ON s.user_id = u.id WHERE u.id = $1",
      [userId],
    )
  ).rows[0];

  if (!user) {
    return errorHandler(400, "User is not found!");
  }

  // console.log(user);

  if (!user.subscription_id) return null;

  if (user.subscription_id.trim() === "") return null;

  const stripeInvoicesResponse = await stripeClient.invoices.list({
    limit: 5,
    customer: user.stripe_client_id,
    subscription: user.subscription_id,
  });

  const subscription = await stripeClient.subscriptions.retrieve(
    user.subscription_id,
    { expand: ["default_payment_method"] },
  );

  const paymentMethod =
    subscription.default_payment_method as Stripe.PaymentMethod | null;

  const cardDetails =
    paymentMethod?.type === "card"
      ? {
          brand: paymentMethod.card?.brand,
          last4: paymentMethod.card?.last4,
          expiry: `${paymentMethod.card?.exp_month}/${paymentMethod.card?.exp_year}`,
          name: paymentMethod.billing_details.name,
        }
      : null;

  const upcomingInvoice = await stripeClient.invoices.createPreview({
    customer: user.stripe_client_id,
    subscription: user.subscription_id,
  });

  const nextInvoiceTimestamp =
    upcomingInvoice.next_payment_attempt || upcomingInvoice.period_end;
  const nextInvoiceDate = nextInvoiceTimestamp
    ? new Date((nextInvoiceTimestamp as number) * 1000).toLocaleDateString(
        "en-US",
        {
          year: "numeric",
          month: "short",
          day: "numeric",
        },
      )
    : null;

  const nestedInvoicesData = await Promise.all(
    stripeInvoicesResponse.data.map(async (inv) => {
      return await Promise.all(
        inv.lines.data.map(async (data) => {
          if (!data.pricing?.price_details?.product) {
            throw errorHandler(400, "No product");
          }

          const { name } = await stripeClient.products.retrieve(
            data.pricing?.price_details?.product,
          );

          return {
            id: data.id,
            date: new Date(
              (data.period.start as number) * 1000,
            ).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            }),
            plan: name,
            amount: (data.amount / 100).toFixed(2),
            pdf: inv.invoice_pdf,
          };
        }),
      );

      // return { data, pdf: inv.invoice_pdf };
    }),
  );

  const invoices = nestedInvoicesData.flat();

  return {
    upcomingInvoice: {
      nextInvoiceDate,
      price: (upcomingInvoice.subtotal / 100).toFixed(2),
      currency: upcomingInvoice.currency,
    },
    cardDetails,
    invoices,
    subscription: subscription.id,
  };
};

export default {
  getMySubscription,
  getAllSubscriptions,
  subscribe,
  subscribeHook,
  cancelSubscribe,
  getSubscription,
  getInvoices,
};

// https://medium.com/@shankhanbkr/implementing-stripe-subscriptions-in-node-js-b46373be87b8
// mail - wagih11644@adsprite.com
