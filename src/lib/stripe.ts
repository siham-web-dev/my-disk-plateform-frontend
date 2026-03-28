import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn("STRIPE_SECRET_KEY is missing. Please add it to your .env file.");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  // Use '2025-02-24.acacia' or whatever the latest strict version the installed SDK defaults to.
  // Casting to 'any' ensures older or newer enum string types don't block the build.
  apiVersion: "2025-02-24.acacia" as any,
  appInfo: {
    name: "MyDisk Platform",
    version: "0.1.0",
  },
});
