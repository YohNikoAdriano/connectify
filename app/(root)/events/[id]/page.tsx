import { getEventById } from '@/lib/actions/event.actions'
import { formatDateTime } from '@/lib/utils'
import { SearchParamProps } from '@/types'
import Image from 'next/image'
import React from 'react'

const EventDetails = async ( {params}: SearchParamProps ) => {
  
  const { id } = await params;
  const event = await getEventById(id);

  return (
    <section className='flex justify-center bg-primary-50 bg-dotted-pattern bg-contain'>
      <div className='grid grid-cols-1 md:grid-cols-2 2xl:max-w-7xl'>
        <Image src={event.imageUrl} alt='Event Hero' width={1000} height={1000} className='h-full min-h-[300px] object-cover object-center'/>

        <div className="flex w-full flex-col gap-8 p-5 md:p-10">

          {/* Top Information */}
          <div className='flex flex-col gap-6'>
            {/* Title */}
            <h2 className='h2-bold'>{event.title}</h2>

            {/* Price, Category, Organizer */}
            <div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
              <div className='flex gap-3'>
                <p className='p-bold-20 rounded-full bg-green-500/20 px-5 py-2 text-green-600'>
                  {event.isFree ? 'FREE' : `$${event.price}`}
                </p>
                <p className='p-medium-16 rounded-full bg-grey-500/20 px-4 py-2.5 text-gray-600'>
                  {event.category.name}
                </p>
              </div>

              <p className='p-medium-18 ml-2 mt-2 sm:mt-0'>
                by{' '}
                <span className='text-primary-500'>{event.organizer.firstName} {event.organizer.lastName}</span>
              </p>
            </div>
          </div>

          {/* Middle Information */}
          {/* Time and Location */}
          <div className='flex flex-col gap-5'>
            <div className='flex gap-2 md:gap-3'>
              <Image src="/assets/icons/calendar.svg" alt='Calendar' width={32} height={32}/>
              <div className='p-medium-16 lg:p-regular-20 flex flex-wrap items-center'>
                <p>Start: {formatDateTime(event.startDateTime).dateOnly} | {formatDateTime(event.startDateTime).timeOnly}</p>
                <p>End: {formatDateTime(event.endDateTime).dateOnly} | {formatDateTime(event.endDateTime).timeOnly}</p>
              </div>
            </div>

            <div className='p-regular-20 flex items-center gap-3'>
              <Image src="/assets/icons/location.svg" alt='Location' width={32} height={32}/>
              <p className='p-medium-16 lg:p-regular-20'>{event.location}</p>
            </div>
          </div>

          {/* Bottom Information */}
          <div className='flex flex-col gap-2'>
            <p className='p-bold-20 text-grey-600'>
              Why you should Attend?
            </p>
            <p className='p-medium-16 lg:p-regular-18'>{event.description}</p>
            <p className='p-bold-20 text-grey-600'>
              More Information:
            </p>
            <p className='p-medium-16 lg:p-regular-18 truncate text-primary-500 underline'>{event.url}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default EventDetails
