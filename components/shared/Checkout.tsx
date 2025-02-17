import React from 'react'
import { Button } from '../ui/button'
import { IEvent } from '@/lib/database/models/event.model'

const Checkout = ( {event, userId}: {event: IEvent, userId: string} ) => {

  const onCheckout = async () => {

  }

  return (
    <form action="/api/checkout_sessions" method="POST">
      <section>
        <Button type='submit' role='link' size="lg" className='button sm:w-fit'>
          {event.isFree ? 'Get Tickets' : 'Buy Tickets'}
        </Button>
      </section>
    </form>
  )
}

export default Checkout
