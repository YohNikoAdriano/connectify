import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Collection from "@/components/shared/Collection";
import { getAllEvents } from "@/lib/actions/event.actions";
import Search from "@/components/shared/Search";
import { SearchParamProps } from "@/types";
import { CategoryFilter } from "@/components/shared/CategoryFilter";

export default async function Home( {searchParams}: SearchParamProps) {

  const params = await searchParams;
  const page = Number(params?.page) || 1;
  const searchText = (params?.query as string) || "";
  const category = (params?.category as string) || "";

  // Fetch All Event Data
  const events = await getAllEvents({
    query: searchText,
    category: category,
    page: page,
    limit: 6
  })
  
  return (
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-contain py-5 md:py-10">
        <div className="wrapper grid grid-cols-1 gap-5 md:grid-cols-2 2xl:gap-0">
          <div className="flex flex-col justify-center gap-8">
            <h1 className="h1-bold">"Explore, Connect, Create!" Bringing People Together, One Event at a Time</h1>
            <p className="p-regular-20 md:p-regular-24">Your gateway to meaningful connections and unforgettable experiences. Discover events, join communities, and meet people who share your passions—all in one seamless platform.</p>
            <Button size='lg' asChild className="button w-full sm:w-fit">
              <Link href={'#events'}>
                Explore Now!
              </Link>
            </Button>
          </div>

          <Image src={'/assets/images/hero.png'} width={1000} height={1000} alt='Connectify Hero' className="max-h-[70vh] object-contain object-center 2xl:max-h-[50vh]"/>

        </div>
      </section>

      <section className="wrapper my-8 flex flex-col gap-8 md:gap-12">
        <h2 className="h2-bold">
          Trust by <br /> Thousands of Events
        </h2>
        <div className="flex flex-col gap-5 w-full md:flex-row">
          <Search />
          <CategoryFilter />
        </div>

        {/* All Event Data */}
        <Collection data={events?.data} emptyTitle= "No Event Found" emptyStateSubtext= "Come Back Later" collectionType="All_Events" limit={6} page={1} totalPages={2}/>
      </section>
    </>
  );
}
{}