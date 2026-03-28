"use server";

import prisma from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";

export async function getPricingPlans() {
  try {
    const plans = await prisma.plan.findMany({
      orderBy: { price: "asc" },
    });
    return plans;
  } catch (error) {
    console.error("Error fetching pricing plans:", error);
    return [];
  }
}

export async function getSubscriptionStatus(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { stripeSubscriptionId: true, stripeCurrentPeriodEnd: true },
    });

    if (!user?.stripeSubscriptionId) {
      return { status: "none", cancelAtPeriodEnd: false, currentPeriodEnd: null };
    }

    const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId) as any;

    return {
      status: subscription.status as string,
      cancelAtPeriodEnd: subscription.cancel_at_period_end as boolean,
      currentPeriodEnd: subscription.current_period_end
        ? new Date(subscription.current_period_end * 1000)
        : null,
    };
  } catch (error) {
    console.error("Error fetching subscription status:", error);
    return { status: "none", cancelAtPeriodEnd: false, currentPeriodEnd: null };
  }
}
