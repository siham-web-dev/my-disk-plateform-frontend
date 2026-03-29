import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { stripe } from "@/lib/stripe";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { priceId } = await req.json();

    if (!priceId) {
      return new NextResponse("Price ID is required", { status: 400 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!dbUser) {
      return new NextResponse("User not found", { status: 404 });
    }

    const baseURL = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL

    const session = await stripe.checkout.sessions.create({
      customer: dbUser.stripeCustomerId || undefined,
      customer_email: dbUser.stripeCustomerId ? undefined : user.email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${baseURL}/account?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseURL}/account?cancel=true`,
      metadata: {
        userId: user.id,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[STRIPE_CHECKOUT]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
