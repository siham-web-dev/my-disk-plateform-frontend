import "dotenv/config";
import prisma from "../src/lib/prisma";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

async function main() {
  console.log("Start seeding plans...");

  const plans = [
    {
      name: "Free plan",
      description: "$0/month",
      price: 0,
      storageLimit: BigInt(40 * 1024 * 1024), // 40 MB in bytes
      canShare: false,
      numPeopleToShare: 0,
      hasSecurity: false,
    },
    {
      name: "Pro plan",
      description: "$5/month",
      price: 5,
      storageLimit: BigInt(700 * 1024 * 1024), // 700 MB in bytes
      canShare: true,
      numPeopleToShare: 10,
      hasSecurity: false,
    },
    {
      name: "Entreprise plan",
      description: "$250/month",
      price: 250,
      storageLimit: BigInt(2 * 1024 * 1024 * 1024), // 2 GB in bytes
      canShare: true,
      numPeopleToShare: 0,
      hasSecurity: true,
    },
  ];

  for (const plan of plans) {
    let stripeMonthlyPriceId = null;
    let stripeYearlyPriceId = null;

    if (plan.price > 0) {
      // 1. Find or Create Stripe Product
      const searchRes = await stripe.products.search({
        query: `name:'${plan.name}'`,
      });

      let product: Stripe.Product;
      
      if (searchRes.data.length > 0) {
        product = searchRes.data[0];
        console.log(`Found existing Stripe product: ${product.name}`);
      } else {
        product = await stripe.products.create({
          name: plan.name,
          description: plan.description,
        });
        console.log(`Created Stripe product: ${product.name}`);
      }
      
      // 2. Find or Create Monthly/Yearly Prices
      const prices = await stripe.prices.list({ product: product.id });
      
      const monthlyPriceObj = prices.data.find(p => p.recurring?.interval === 'month' && p.unit_amount === plan.price * 100);
      if (monthlyPriceObj) {
        stripeMonthlyPriceId = monthlyPriceObj.id;
      } else {
        const newPrice = await stripe.prices.create({
          product: product.id,
          unit_amount: plan.price * 100,
          currency: 'usd',
          recurring: { interval: 'month' },
        });
        stripeMonthlyPriceId = newPrice.id;
      }

      // Yearly price is 12 months with 20% discount (0.8 multiplier)
      const yearlyUnitAmount = Math.round(plan.price * 12 * 0.8 * 100);
      const yearlyPriceObj = prices.data.find(p => p.recurring?.interval === 'year' && p.unit_amount === yearlyUnitAmount);
      if (yearlyPriceObj) {
        stripeYearlyPriceId = yearlyPriceObj.id;
      } else {
        const newPrice = await stripe.prices.create({
          product: product.id,
          unit_amount: yearlyUnitAmount,
          currency: 'usd',
          recurring: { interval: 'year' },
        });
        stripeYearlyPriceId = newPrice.id;
      }
    }

    const createdPlan = await prisma.plan.upsert({
      where: { name: plan.name },
      update: {
        description: plan.description,
        price: plan.price,
        storageLimit: plan.storageLimit,
        canShare: plan.canShare,
        numPeopleToShare: plan.numPeopleToShare,
        hasSecurity: plan.hasSecurity,
        stripeMonthlyPriceId,
        stripeYearlyPriceId,
      },
      create: {
        name: plan.name,
        description: plan.description,
        price: plan.price,
        storageLimit: plan.storageLimit,
        canShare: plan.canShare,
        numPeopleToShare: plan.numPeopleToShare,
        hasSecurity: plan.hasSecurity,
        stripeMonthlyPriceId,
        stripeYearlyPriceId,
      },
    });
    console.log(`Upserted DB plan: ${createdPlan.name} with Monthly: ${stripeMonthlyPriceId} / Yearly: ${stripeYearlyPriceId}`);
  }

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
