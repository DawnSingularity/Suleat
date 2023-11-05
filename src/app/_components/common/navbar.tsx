"use client";

import suleatIcon from "~/../public/suleat-icon.png"
import Image from "next/image"
import { useAuth } from "@clerk/nextjs";
import { UserButton, useUser } from "@clerk/clerk-react";
import { api } from "~/trpc/react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars  } from "@fortawesome/free-solid-svg-icons";

export function Navbar() {
    const selfUserQuery = api.profile.getUserProfile.useQuery({})

    let userIcon
    if(selfUserQuery.data != null) {
        userIcon = <>
            <a href={`/profile/${selfUserQuery.data?.userName}`}>
                        <img className="rounded-full h-10 w-10" src={selfUserQuery.data?.pfpURL} alt="" />
            </a>
            </>
    }
    
    return (
      <>
        <nav className="sticky top-0 bg-zinc-300 flex flex-row justify-between px-4">
            <div className="order-first flex flex-row items-center py-2">
                <FontAwesomeIcon icon={faBars} style={{color: "#727272",}} size="xl" className="pr-4"/>
                <a className="flex flex-row items-center" href="/">
                    <Image src={suleatIcon} className="w-auto h-6 mr-2" alt="Suleat logo"></Image>
                    <span className="text-neutral-500 text-2xl font-sans font-semibold">Suleat</span>
                </a>
            </div>
            <div className="order-last flex flex-row items-center py-1">
                {userIcon}
            </div>
            
        </nav>
      </>
    );

  
}
 
 
