import { auth } from "@clerk/nextjs";
import { Home } from "~/app/_components/home";
import { Landing } from "~/app/_components/landing";
import { db } from "~/server/db"
import { Onboarding } from "./_components/onboarding";

export default async function RootPage() {
  const currentAuth = auth();

  
  if(currentAuth.userId != null) {
    // user has not completed the onboarding procedure
    // note: placed on page.tsx so it can be server-side rendered
    const isNotOnboarded = await db.user.findUnique({where: { uuid: currentAuth.userId }}) == null
    return (
      <>
      {isNotOnboarded &&  <Onboarding />}
      <Home />
      </>
    );
  } else {
    return (
      <Landing />
    );
  }
}

