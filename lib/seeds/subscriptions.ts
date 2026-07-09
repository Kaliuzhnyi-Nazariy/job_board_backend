import { stripeClient } from "../../helper/stripeClient";
import db from "../db";

const subscriptions = [
  { name: "basic", price: 19, limits: 1 },
  { name: "standard", price: 39, limits: 3 },
  { name: "premium", price: 59, limits: 6 },
];

export const seedSubscriptions = async () => {
  await Promise.all(
    subscriptions.map(async ({ name, price, limits }) => {
      const product = await stripeClient.products.create({
        name,
      });

      const stripePrice = await stripeClient.prices.create({
        currency: "usd",
        unit_amount: price * 100,
        recurring: {
          interval: "month",
        },
        product: product.id,
      });

      await db.query(
        `INSERT INTO subscriptionsPlan (name, price, stripe_product_id,   stripe_price_id, limits) 
          VALUES ($1, $2, $3, $4, $5)
          ON CONFLICT (stripe_product_id) 
          DO UPDATE SET 
          name = EXCLUDED.name,
          price = EXCLUDED.price,
          stripe_price_id = EXCLUDED.stripe_price_id,
          limits = EXCLUDED.limits;
        `,
        [name, price, product.id, stripePrice.id, limits],
      );

      // return {
      //   name,
      //   price,
      //   productId: product.id,
      //   priceId: stripePrice.id,
      // };
    }),
  );
};
