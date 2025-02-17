'use client'

import { IEvent } from '@/lib/database/models/event.model'
import { SignedIn, SignedOut, useUser } from '@clerk/nextjs'
import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'
import Checkout from './Checkout'

const CheckoutButton = ( {event}: {event:IEvent} ) => {
  const hasEventFinished = new Date(event.endDateTime) < new Date()
  const {user} = useUser()
  const userId = user?.publicMetadata.userId as string

  return (
    <div className='flex items-center gap-3'>
      { hasEventFinished ? (
        <p className='p-2 text-red-500'>Sorry, Tickets are No Longer Available</p>
      ) : (
        <>
          {/* If User not sign in */}
          <SignedOut>
            <Button asChild className='button rounded-full' size='lg'>
              <Link href='/sign-in'>Get Tickets</Link>
            </Button>
          </SignedOut>

          {/* If User signed in */}
          <SignedIn>
            <Checkout event={event} userId={userId} />
          </SignedIn>
        </>
      )}
    </div>
  )
}

export default CheckoutButton
