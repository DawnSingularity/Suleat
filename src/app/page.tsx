import { auth } from "@clerk/nextjs";
import { Home } from "~/app/_components/home";
import { Landing } from "~/app/_components/landing";
import { db } from "~/server/db"
import { redirect } from "next/navigation";

export default async function RootPage() {
  const currentAuth = auth();

  if(currentAuth.userId != null) {
    if(await db.user.findUnique({where: { uuid: currentAuth.userId }}) == null) { 
      // user has not completed the onboarding procedure
      redirect("/onboarding")
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

