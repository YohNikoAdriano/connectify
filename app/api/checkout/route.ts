import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  try {
    const { eventTitle, eventId, price, isFree, buyerId } = await req.json();

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: isFree ? 0 : Number(price) * 100,
            product_data: { name: eventTitle },
          },
          quantity: 1,
        },
      ],
      metadata: { eventId, buyerId },
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/profile`,
      cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}
