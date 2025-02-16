import EventForm from "@/components/shared/EventForm";
import { auth } from "@clerk/nextjs/server";

const CreateEvents = async () => {
  // const [userId, setUserId] = useState<string | null>(null)
  // useEffect(() => {
  //   const fetchAuth = async () => {
  //     const authData = await auth() // Tunggu hasil Promise
  //     setUserId(authData?.userId || null) // Simpan userId dalam state
  //   }
  //   fetchAuth()
  // },[])

  const { sessionClaims } = await auth();
  const userId = sessionClaims?.userId as string;

  return (
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <h3 className="wrapper h3-bold text-center sm:text-left">
          Create Events
        </h3>
      </section>

      <div className="wrapper my-8">
        <EventForm userId={userId} type="Create" />
      </div>
    </>
  );
};

export default CreateEvents;
