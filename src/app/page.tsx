import { auth } from "@clerk/nextjs";
import { Home } from "~/app/_components/home";
import { Landing } from "~/app/_components/landing";

export default async function RootPage() {
  const currentAuth = auth();

  if(currentAuth.sessionId != null) {
    return (
      <Home />
    );
  } else {
    return (
      <Landing />
    );
  }
}

