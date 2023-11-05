"use client";

import Head from "next/head";
import { Navbar } from "~/app/_components/common/navbar"
import { useAuth } from "@clerk/nextjs";
import { UserButton, useUser } from "@clerk/clerk-react";
import { api } from "~/trpc/react";

export function Home() {
  const { sessionId, userId, getToken } = useAuth();
  const user = useUser();
  const username = api.profile.getCurrentUser.useQuery().data;
  
    return (
      <>
        <Head>
          <title>Home</title>
          <meta name="description" content="Generated by create-t3-app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Navbar />
        <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b">
          <div>
            Hello {username ?? ""}, your current active session is {sessionId}
          </div>
          {!!user.isSignedIn && <UserButton afterSignOutUrl="/" />}
        </main>
      </>
    );

  
}
 
