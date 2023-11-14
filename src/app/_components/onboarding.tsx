"use client";

import Head from "next/head";
import { api } from "~/trpc/react";
import { useEffect, useState } from "react"
import { useAuth } from "@clerk/nextjs";
import { UserButton, useUser } from "@clerk/clerk-react";
import { useRouter } from "next/navigation";
import { FlavorProfileSelector, useFlavorStates } from "./profile/flavor-profile-selector";
import { Modal } from "./common/modal";
import toast from "react-hot-toast";
import { LoadingSpinner } from "./loading";

/* NOTES
  1. User object in Prisma DB is only created after onboarding
  2. Optimal way to do it is https://clerk.com/docs/users/sync-data, but it needs a fixed URL for the website (which we dont have for now)
*/
export function Onboarding() {
  const { user, isLoaded } = useUser();

  const [ pageNo, setPageNo ] = useState(0);
  const [ firstName, setFirstName ] = useState("");
  const [ lastName, setLastName ] = useState("");
  const [ flavorStates, setFlavorStates ] = useFlavorStates();
  
  const { sessionId, getToken } = useAuth();
  const { mutate } = api.profile.createUser.useMutation();
  const router = useRouter()

  // update from clerk
  useEffect(() => {
    // do not change if the user already changed it
    setFirstName((val) => val == "" ? (user?.firstName ?? "") : val)
    setLastName ((val) => val == "" ? (user?.lastName  ?? "") : val)
  }, [isLoaded])

  const checkPageInput = (pageNo : number) => {
    switch(pageNo) {
      case 0:
        if(firstName !== "" && lastName !== "") {
          return true;
        } else {
          toast.error("How would like us to call you?")
          return false;
        }
      case 1:
        if(flavorStates.toArray().length > 0) {
          return true;
        } else {
          toast.error("Which flavors are you interested in?")
          return false;
        }
    }
  }
  const handleNext = (e : React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    // check input
    if(!checkPageInput(pageNo)) {
      return;
    }

    if(pageNo < 1) {
      // next page
        setPageNo(pageNo + 1)
    } else {
      // submit form
      mutate({firstName, lastName, flavors: flavorStates.toArray()}, {
        onSuccess: () => {
          // refreshes everything
          // https://nextjs.org/docs/app/api-reference/functions/use-router
          router.refresh()
        },
        onError: () => {
          console.log("Error updating profile")
          console.log(e)
        },
      })
    }
  }
  const handleSubmit = (e : React.MouseEvent<HTMLButtonElement>) => {

  } 
  return (
      <Modal open={true} onOpenChange={(x) => {}} title="Welcome to Suleat" showCloseButton={false}>
        <div className="flex flex-col justify-center p-4 w-[66vw] md:w-[32rem]">
        { isLoaded ? <>
          <div className="flex flex-row space-x-2">
            {[-1, 0, 1].map( (pointNo) => 
              <div className={`w-4 h-4 ${pointNo <= pageNo ? "bg-[color:var(--suleat)]" : "" } border-[color:var(--suleat)] border rounded-full`}></div>
            )}

          </div>
          { pageNo == 0 && (<>
            <p className="text-l font-semibold mt-4 mb-1">How would like us to call you?</p>
            <input onChange={(e) => setFirstName(e.target.value)} placeholder="First Name" value={firstName} className="h-12 rounded-xl border-2 p-3 mb-4"/>
            <input onChange={(e) => setLastName(e.target.value)}  placeholder="Last Name" value={lastName} className="h-12 rounded-xl border-2 p-3 mb-4"/>
          </>) }
          { pageNo == 1 && (<>
            <p className="text-l font-semibold mt-4 mb-1">Which flavors are you interested in?</p>
            <p className="text-xs">You may choose multiple flavors.</p>
            <FlavorProfileSelector flavorStates={flavorStates} setFlavorStates={setFlavorStates} className="my-2" />
          </>) }

          <button className="cursor-pointer text-white bg-[color:var(--suleat)] h-12 rounded-xl border-2 mb-2 w-11/12 mt-4" onClick={handleNext}>Next</button>
          </> :

          <div className="m-auto">
            <LoadingSpinner size={50}/>
          </div>
        }
        </div>

        
      </Modal>
  );
}
 
