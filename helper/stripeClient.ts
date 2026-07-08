import Stripe from "stripe";
import { errorHandler } from "./errorHandler";
import dotenv from "dotenv";

dotenv.config();

const { STRIPE_SECRET_KEY } = process.env;

if (!STRIPE_SECRET_KEY) {
  throw errorHandler(500, "No Stripe key");
}

export const stripeClient = new Stripe(STRIPE_SECRET_KEY);
