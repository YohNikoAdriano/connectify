import EventForm from "@/components/shared/EventForm";
import { getEventById } from "@/lib/actions/event.actions";
import { SearchParamProps } from "@/types";
import { auth } from "@clerk/nextjs/server";
import React from "react";

type UpdateParamProps = {
  params: Promise<{ id: string }>;
}
const UpdateEvents = async ( {params}: UpdateParamProps ) => {
  
  const { id } = await params;
  const event = await getEventById(id);

  const { sessionClaims } = await auth();
  const userId = sessionClaims?.userId as string;

  return (
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <h3 className="wrapper h3-bold text-center sm:text-left">
          Update Events
        </h3>
      </section>

      <div className="wrapper my-8">
        <EventForm userId={userId} type="Update" event={event} eventId={event._id} />
      </div>
    </>
  );
};

export default UpdateEvents;
