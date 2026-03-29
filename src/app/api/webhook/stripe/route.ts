import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import prisma from "@/lib/prisma";
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(`Webhook Error: ${message}`);
    return new NextResponse(`Webhook Error: ${message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === "checkout.session.completed") {
    const subscriptionId = session.subscription as string;
    const subscription = (await stripe.subscriptions.retrieve(subscriptionId)) as Stripe.Subscription;

    if (!session?.metadata?.userId) {
      return new NextResponse("User id is required in metadata", { status: 400 });
    }

    // Find the plan based on the price ID
    const plan = await prisma.plan.findFirst({
      where: {
        OR: [
          { stripeMonthlyPriceId: subscription.items.data[0].price.id },
          { stripeYearlyPriceId: subscription.items.data[0].price.id },
        ],
      },
    });

    await prisma.user.update({
      where: {
        id: session.metadata.userId,
      },
      data: {
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: subscription.customer as string,
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: subscription.items.data[0].current_period_end
          ? new Date(subscription.items.data[0].current_period_end * 1000)
          : null,
        planId: plan?.id,
      },
    });
  }

  if (event.type === "invoice.payment_succeeded") {
    const invoice = event.data.object as Stripe.Invoice & { subscription: string };
    const subscriptionId = invoice.subscription;
    const subscription = (await stripe.subscriptions.retrieve(subscriptionId)) as Stripe.Subscription;

    const plan = await prisma.plan.findFirst({
      where: {
        OR: [
          { stripeMonthlyPriceId: subscription.items.data[0].price.id },
          { stripeYearlyPriceId: subscription.items.data[0].price.id },
        ],
      },
    });

    await prisma.user.update({
      where: {
        stripeSubscriptionId: subscription.id,
      },
      data: {
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: subscription.items.data[0].current_period_end
          ? new Date(subscription.items.data[0].current_period_end * 1000)
          : null,
        planId: plan?.id,
      },
    });
  }
  
  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;

    // Fallback to the free plan logically
    const freePlan = await prisma.plan.findUnique({
      where: {
        name: "Free plan",
      },
    });

    await prisma.user.update({
      where: {
        stripeSubscriptionId: subscription.id,
      },
      data: {
        stripeSubscriptionId: null,
        stripePriceId: null,
        stripeCurrentPeriodEnd: null,
        planId: freePlan?.id,
      },
    });
  }

  return new NextResponse(null, { status: 200 });
}
