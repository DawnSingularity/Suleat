"use client";

import Head from "next/head";
import { api } from "~/trpc/react";
import { useEffect, useState } from "react"
import { useAuth } from "@clerk/nextjs";
import { UserButton, useUser } from "@clerk/clerk-react";

/* NOTES
  1. User object in Prisma DB is only created after onboarding
  2. Optimal way to do it is https://clerk.com/docs/users/sync-data, but it needs a fixed URL for the website (which we dont have for now)
*/
export function Onboarding() {
  const { user, isLoaded } = useUser();
  const [ firstName, setFirstName ] = useState("");
  const [ lastName, setLastName ] = useState("");
  const { sessionId, getToken } = useAuth();
  const { mutate } = api.profile.createUser.useMutation();


  // update from clerk
  useEffect(() => {
    setFirstName(user?.firstName ?? "")
    setLastName(user?.lastName ?? "")
  }, [isLoaded])

  const handleSubmit = () => {
    mutate({firstName, lastName}, {
      onSuccess: () => {
      },
      onError: () => {
        console.log("Error updating profile")
      },
      onSettled: () => {
        window.location.reload()
      },
    })
  } 
  if (!isLoaded ) {
    return ( <main> Wait </main>)
  } else {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
          <form className="flex flex-col justify-center" id="form-register">
            <input onChange={(e) => setFirstName(e.target.value)} placeholder="First Name" value={firstName} className="h-12 rounded-xl border-2 p-3 mb-4 w-11/12 m-auto"/>
            <input onChange={(e) => setLastName(e.target.value)}  placeholder="Last Name" value={lastName} className="h-12 rounded-xl border-2 p-3 mb-4 w-11/12 m-auto"/>
            <button value="Register Now" className="cursor-pointer text-white bg-[color:var(--suleat)] h-12 rounded-xl border-2 mb-2 w-11/12 m-auto" onClick={handleSubmit}> Register</button>
          </form>
        </main>
    );
  }

  
}
 
