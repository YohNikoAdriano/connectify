// next
import { auth } from '@clerk/nextjs/server'
import Link from 'next/link'

// lib
import Collection from '@/components/shared/Collection'
import { Button } from '@/components/ui/button'
import { getEventsByUser } from '@/lib/actions/event.actions'
import { getOrdersByUser } from '@/lib/actions/order.actions'
import { IOrder } from '@/lib/database/models/order.model'
import { SearchParamProps } from '@/types'


const ProfilePage = async ( {searchParams}: SearchParamProps ) => {

  const { sessionClaims } = await auth()
  const userId = sessionClaims?.userId as string;

  const params = await searchParams;

  const ordersPage = Number(params?.ordersPage) || 1
  const eventsPage = Number(params?.eventsPage) || 1

  const order = await getOrdersByUser( {userId, page: ordersPage})
  const orderedEvents = order?.data.map((order: IOrder) => order.event) || []
  
  const organizedEvents = await getEventsByUser( {userId, page: eventsPage} )

  return (
    <>
      {/* My Tickets */}
      <section className='bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10'>
        <div className='wrapper flex items-center justify-center sm:justify-between'>
          <h3 className='h3-bold text-center sm:text-left'>My tickets</h3>
          <Button asChild size='lg' className='button hidden sm:flex'>
            <Link href='/#events'>Explore More Event</Link>
          </Button>
        </div>
      </section>

      <section className='wrapper my-8'>
        <Collection data={orderedEvents} emptyTitle= "No Event Ticket Purchased Yet" emptyStateSubtext= "No Worries - Plenty of Exiting organizedEvents to Explore!" collectionType="My_Tickets" limit={3} page={ordersPage} urlParamName='ordersPage' totalPages={order?.totalPages}/>
      </section>

      {/* Events Organized */}
      <section className='bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10'>
        <div className='wrapper flex items-center justify-center sm:justify-between'>
          <h3 className='h3-bold text-center sm:text-left'>Events Organized</h3>
          <Button asChild size='lg' className='button hidden sm:flex'>
            <Link href='/events/create'>Create New Event</Link>
          </Button>
        </div>
      </section>

      <section className='wrapper my-8'>
        <Collection data={organizedEvents?.data} emptyTitle= "No Event have been Created Yet" emptyStateSubtext= "Go Create Some Now!" collectionType="Event_Organized" limit={3} page={eventsPage} urlParamName='eventsPage' totalPages={organizedEvents?.totalPages}/>
      </section>
    </>
  )
}

export default ProfilePage
