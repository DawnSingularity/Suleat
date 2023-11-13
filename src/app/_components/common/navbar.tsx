"use client";

import suleatIcon from "~/../public/suleat-icon.png"
import Image from "next/image"
import { useAuth } from "@clerk/nextjs";
import { UserButton, UserProfile, useUser } from "@clerk/clerk-react";
import { api } from "~/trpc/react";
import { UserIcon } from "./user-icon"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faGear, faRightFromBracket  } from "@fortawesome/free-solid-svg-icons";
import { UserPopover } from "./user-popover"
import { useEffect, useState } from "react";
import { FloatingFocusManager, FloatingOverlay, FloatingPortal, useFloating } from "@floating-ui/react";
import { Modal } from "./modal";

export function Navbar() {
    const auth = useAuth();
    const {context} = useFloating();
    const selfUserQuery = api.profile.getUserProfile.useQuery({})

    const [showModal, setModal] = useState(false)
    
    let userIcon
    if(selfUserQuery.data != null) {
        userIcon = <UserPopover button={(
            <UserIcon user={selfUserQuery.data} width="10" clickable={false} />
        )} popover={(
            <div className="mx-4 py-6 bg-white flex flex-col shadow-lg rounded-lg">
                <a href={`/profile/${selfUserQuery.data.userName}`} className="py-4 pl-4 pr-6 hover:bg-zinc-200">
                    <div className="flex flex-row items-center">
                        <UserIcon user={selfUserQuery.data} width="12" clickable={false} className="mr-3" />
                        <div>
                            <div className="font-bold">{selfUserQuery.data.firstName} {selfUserQuery.data.lastName}</div>
                            <div>{selfUserQuery.data.userName}</div>
                        </div>
                    </div>
                </a>
                <div className="flex flex-row items-center py-2 px-6 hover:bg-zinc-200 cursor-pointer" onClick={() => { setModal(true) }}>
                    <FontAwesomeIcon icon={faGear} style={{color: "--var(suleat)"}} className="mr-4" />
                    <span>Settings</span>
                </div>
                <div className="flex flex-row items-center py-2 px-6 hover:bg-zinc-200 cursor-pointer" onClick={async () => {await auth.signOut()}}>
                    <FontAwesomeIcon icon={faRightFromBracket} style={{color: "--var(suleat)"}} className="mr-4" />
                    <span>Sign-out</span>
                </div>
            </div>
        )} />
    }
    
    return (
      <>
        <nav className="z-50 sticky top-0 drop-shadow-md bg-white flex flex-row justify-between px-4">
            <div className="order-first flex flex-row items-center py-2">
                {/* <FontAwesomeIcon icon={faBars} style={{color: "#101010",}} size="xl" className="pr-4"/> */}
                <a className="flex flex-row items-center ml-2" href="/">
                    <Image src={suleatIcon} className="w-auto h-6 mr-3" alt="Suleat logo"></Image>
                    <span className="text-[#101010] text-xl font-['Poppins'] font-medium">Suleat</span>
                </a>
            </div>
            <div className="order-last flex flex-row items-center py-1">
                {userIcon}
            </div>
            
        </nav>
        {showModal && (
            <Modal open={showModal} onOpenChange={setModal} title="Settings">
                <UserProfile path="/user-profile" routing="virtual" appearance={{
                    elements: {
                        card: {
                            borderRadius: 0,
                            boxShadow: "none",
                            height: "75vh",
                            margin: "0",
                        },
                        scrollBox: {
                            borderRadius: "0",
                        },
                        // disable "profile section" for now
                        profileSection__profile: {
                            display: "none",
                        },
                        // disable "delete account" for now
                        profileSection__danger: {
                            display: "none",
                        }
                    }
                }} />
            </Modal>)}
      </>
    );

  
}
 
 
