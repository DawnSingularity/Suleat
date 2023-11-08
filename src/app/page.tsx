import { auth } from "@clerk/nextjs";
import { Home } from "~/app/_components/home";
import { Landing } from "~/app/_components/landing";
import { db } from "~/server/db"
import { Onboarding } from "./_components/onboarding";

export default async function RootPage() {
  const currentAuth = auth();

  if(currentAuth.userId != null) {
    if(await db.user.findUnique({where: { uuid: currentAuth.userId }}) == null) { 
      // user has not completed the onboarding procedure
      // note: there might be a better place for this
      return (
        <Onboarding />
      )
    } else {
      return (
        <Home />
      );
    }
  } else {
    return (
      <Landing />
    );
  }
}

