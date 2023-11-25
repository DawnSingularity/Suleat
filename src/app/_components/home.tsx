"use client";

import Head from "next/head";
import { Navbar } from "~/app/_components/common/navbar"
import { useAuth } from "@clerk/nextjs";
import { UserButton, useUser } from "@clerk/clerk-react";
import { api } from "~/trpc/react";
import { Infinite } from "./common/infinite";
import { InfiniteSearch } from "./common/infinitesearch"
import { InfiniteSearchUsers } from "./common/infinitesearchusers"
import { useSearchParams } from 'next/navigation'
import { useState } from 'react';
import { CreatePost } from "./create-post";

export function Home() {
  const { sessionId, userId, getToken } = useAuth();
  const user = useUser();
  const username = api.profile.getCurrentUser.useQuery().data;

  const searchParams = useSearchParams()
  const searchKey = searchParams.get('search')
  console.log(searchKey)

  const [showUsers, setShowUsers] = useState(false);

  const showSearchedUsers = () => {
    setShowUsers(true);
    const showPostBtn = document.getElementById("showPostBtn")
    const showUserBtn = document.getElementById("showUserBtn")
    showUserBtn?.classList.remove('text-stone-400')
    showUserBtn?.classList.add('text-[#fc571a]')
    showPostBtn?.classList.remove('text-[#fc571a]')
    showPostBtn?.classList.add('text-stone-400')
  };

  const showPosts = () => {
    setShowUsers(false)
    const showPostBtn = document.getElementById("showPostBtn")
    const showUserBtn = document.getElementById("showUserBtn")
    showPostBtn?.classList.remove('text-stone-400')
    showPostBtn?.classList.add('text-[#fc571a]')
    showUserBtn?.classList.remove('text-[#fc571a]')
    showUserBtn?.classList.add('text-stone-400')
  }

  if(searchKey !== null && searchKey !== "") {
    return (
      <>
        <Head>
          <title>Search</title>
          <meta name="description" content="Generated by create-t3-app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Navbar />
        <main className="flex flex-col items-center bg-gradient-to-b">

          <div className="w-full sm:w-[500px]">
            <div className="mb-2 text-xl font-bold text-[#fc571a]">Search Results</div>
            <div className="s">
            {/* Filter buttons */}
              <button id="showPostBtn" onClick={showPosts} type="button" className="text-sm text-[#fc571a] hover:text-black mb-4 font-bold mr-4">Posts</button>
              <button id="showUserBtn" onClick={showSearchedUsers} type="button" className="text-sm text-stone-400 hover:text-black mb-4 font-bold mr-4">Users</button>
              <div className="w-full mb-3 border-black border-b-2"></div>
            </div>
            
            {/* {content} */}
            <div id="search-content">
              {showUsers ? <InfiniteSearchUsers /> : <InfiniteSearch />}
            </div>
            
            
          </div>
          <div className="mb-6">

          </div>
          
        </main>
      </>
    );
  } else {
    return (
      <>
        <Head>
          <title>Home</title>
          <meta name="description" content="Generated by create-t3-app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Navbar />
        <main className="flex flex-col items-center bg-gradient-to-b">
          <div className="w-full sm:w-[500px]">
            <CreatePost />
            <Infinite />
          </div>
          
        </main>
      </>
    );
  }

  
}
 
