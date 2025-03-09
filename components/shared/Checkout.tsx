import React, { useState } from 'react';
import { Button } from '../ui/button';
import { IEvent } from '@/lib/database/models/event.model';

const Checkout = ({ event, userId }: { event: IEvent; userId: string }) => {
  const [isLoading, setIsLoading] = useState(false);

  const onCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const order = {
        eventTitle: event.title,
        eventId: event._id,
        price: event.price || "",
        isFree: event.isFree,
        buyerId: userId,
      };

      // Fetch API Stripe
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
      });

      // If Fetching Success
      const data = await res.json();
      if (data.url) {
        // Redirect to Stripe Checkout Page
        window.location.href = data.url; 
      }
    } catch (error) {
      console.error("Checkout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={onCheckout}>
      <section>
        <Button type='submit' role='link' size="lg" className='button sm:w-fit' disabled={isLoading}>
          {isLoading ? 'Processing...' : event.isFree ? 'Get Tickets' : 'Buy Tickets'}
        </Button>
      </section>
    </form>
  );
};

export default Checkout;
