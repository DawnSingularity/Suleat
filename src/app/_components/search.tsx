"use client";

import Head from "next/head";
import { Navbar } from "~/app/_components/common/navbar"
import { useAuth } from "@clerk/nextjs";
import { UserButton, useUser } from "@clerk/clerk-react";
import { api } from "~/trpc/react";
import { InfiniteSearch } from "./common/infinitesearch";

export function Search() {
  const { sessionId, userId, getToken } = useAuth();
  const user = useUser();
  const username = api.profile.getCurrentUser.useQuery().data;
  
  const currentURL = window.location.href;
  const searchParams = new URLSearchParams(new URL(currentURL).search);
  const searchKey = searchParams.get('search');

    if(searchKey !== null) {
        return (
        <>
            <Head>
            <title>Search</title>
            <meta name="description" content="Generated by create-t3-app" />
            <link rel="icon" href="/suleat-icon.png" />
            </Head>
            <Navbar />
            <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b">
            <div className="w-full sm:w-[500px]">
                <InfiniteSearch key={searchKey} />
            </div>
            
            </main>
        </>
        );
    }

  
}
 