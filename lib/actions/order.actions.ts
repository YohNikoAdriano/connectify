'use server'

import { headers } from 'next/headers';
import { CheckoutOrderParams } from './../../types/index';
import { stripe } from '@/lib/stripe';
import { NextResponse } from 'next/server';
import { redirect } from 'next/navigation';

export const checkoutOrder = async (order : CheckoutOrderParams) => {
  try {
    const headersList = await headers()
    const origin = headersList.get('origin')

    const price = order.isFree ? 0 : Number(order.price)*100

    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: price,
            product_data: {
              name: order.eventTitle
            }
          },
          quantity: 1
        },
      ],
      metadata: {
        eventId: order.eventId,
        buyerId: order.buyerId
      },
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/profile`,
      cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/`,
    });
    redirect(session.url!)
  } catch (error) {
    throw error
  }
}