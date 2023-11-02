"use client";

import Head from "next/head";
import { useAuth } from "@clerk/nextjs";
import { UserButton, useUser } from "@clerk/clerk-react";

export function Home() {
  const { sessionId, getToken } = useAuth();
  const user = useUser();
    return (
      <>
        <Head>
          <title>Create T3 App</title>
          <meta name="description" content="Generated by create-t3-app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
          <div>
            Hello, your current active session is {sessionId}
          </div>
          {!!user.isSignedIn && <UserButton afterSignOutUrl="/" />}
        </main>
      </>
    );

  
}
 
