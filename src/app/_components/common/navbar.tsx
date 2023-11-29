"use client";

import { FavNotification, FollowNotification, CommentNotification } from "@prisma/client";
import suleatIcon from "~/../public/suleat-icon.png"
import Image from "next/image"
import { useAuth } from "@clerk/nextjs";
import { UserButton, UserProfile, useUser } from "@clerk/clerk-react";
import { api } from "~/trpc/react";
import { UserIcon } from "./user-icon"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faGear, faRightFromBracket, faMagnifyingGlass, faBell } from "@fortawesome/free-solid-svg-icons";
import { UserPopover } from "./user-popover"
import { useEffect, useState } from "react";
import { FloatingFocusManager, FloatingOverlay, FloatingPortal, useFloating } from "@floating-ui/react";
import { Modal } from "./modal";
import { useRouter } from "next/navigation";
import { Notification } from "./notification"

export function Navbar() {
    const auth = useAuth();
    const router = useRouter();
    const {context} = useFloating();
    const selfUserQuery = api.profile.getUserProfile.useQuery({})

    const [showModal, setModal] = useState(false)
    const [searchKey, setSearchKey] = useState("")
    const [mostRecentNotif, setMostRecentNotif] = useState(Number(new Date('2000-01-01')))

    // get all notifications for now... (apply infinite scrolling ? ;-;)
    let uuid = ""

    if(selfUserQuery?.data?.uuid)
        uuid = selfUserQuery?.data?.uuid
    
    const allNotifsQuery = api.profile.getUserNotifs.useQuery({uuid: uuid}, {refetchInterval:30000})
    const favNotifs = allNotifsQuery?.data?.favNotifications ?? []
    const followNotifs = allNotifsQuery?.data?.followNotifications ?? []
    const commentNotifs = allNotifsQuery?.data?.commentNotifications ?? []

    const multipleNotifTypes: (FavNotification | CommentNotification | FollowNotification)[] = []
    for(let x of favNotifs)
        multipleNotifTypes.push(x)
    for(let y of commentNotifs)
        multipleNotifTypes.push(y)
    for(let y of followNotifs)
        multipleNotifTypes.push(y)

    multipleNotifTypes.sort((a, b) => { return( Number(b.createdAt) - Number(a.createdAt))})
    const currentNotifDateTime = Number(multipleNotifTypes[0]?.createdAt)
    const [showBlueCircle, setShowBlueCircle] = useState(false)
    const mostRecent = multipleNotifTypes[0]

    console.log(mostRecent)

    useEffect(() => {
        if(mostRecentNotif < currentNotifDateTime && !mostRecent?.isViewed) {
            setShowBlueCircle(!showBlueCircle)
            setMostRecentNotif(currentNotifDateTime)
        }
    })

    const {mutate} = api.profile.updateIsViewedNotif.useMutation({})
    // show notification system
    const [showNotifSystem, setShowNotifSystem] = useState(false);
    const handleNotifBellClick = () => {
        setShowNotifSystem(!showNotifSystem)
        setShowBlueCircle(false)
        
        let type = ""
        // update isViewed
        if(mostRecent?.category === "favorite" && "favUserLikerId" in mostRecent) {
            console.log("REACHED FAV")
            mutate({mainId: mostRecent.favUserLikerId, secondaryId: mostRecent.favPostLikedId, tertiaryId: mostRecent.userId, type: "favorite"})
        } else if(mostRecent?.category === "follow" && "followedId" in mostRecent) {
            console.log("REACHED FOLLOW")
            mutate({mainId: mostRecent.followedId, secondaryId: mostRecent.followerId, type: "follow"})
        } else if((mostRecent?.category === "comment" || mostRecent?.category === "reply") && "commentId" in mostRecent) {
            console.log("REACHED COMMENT")
            mutate({mainId: mostRecent.commentId, type: "comment"})
        }
    }

    const handleNotifBellClick2 = () => {
        setShowNotifSystem(false)
    }
    
    let userIcon
    if(selfUserQuery.data != null) {
        userIcon = <UserPopover button={(
            <UserIcon onClick={handleNotifBellClick2} user={selfUserQuery.data} width="10" clickable={false} />
        )} popover={(
            <div className="py-6 bg-white flex flex-col shadow-lg rounded-lg">
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
                    <FontAwesomeIcon icon={faGear} style={{color: "#fc571a"}} className="mr-4" />
                    <span>Settings</span>
                </div>
                <div className="flex flex-row items-center py-2 px-6 hover:bg-zinc-200 cursor-pointer" onClick={async () => {await auth.signOut(() => router.push("/"))}}>
                    <FontAwesomeIcon icon={faRightFromBracket} style={{color: "#fc571a"}} className="mr-4" />
                    <span>Sign-out</span>
                </div>
            </div>
        )}/>
    }

    return (
      <>
        <nav className="z-50 sticky h-14 top-0 drop-shadow-md bg-white flex flex-row justify-between px-5 pr-4 sm:mb-4 mb-1">
            <form action="/" className="order-first flex flex-row items-center py-2 md:w-7/12">
                {/* <FontAwesomeIcon icon={faBars} style={{color: "#101010",}} size="xl" className="pr-4"/> */}
                <a className="flex flex-row items-center" href="/">
                    <Image src={suleatIcon} className="w-auto h-7 mr-3" alt="Suleat logo"></Image>
                    <span className="text-[#fc571a] text-[22px] font-poppins font-medium">Suleat</span>
                </a>
                <span className="ml-8 flex px-4 group w-full">
                    <div className="ease-in-out duration-500 group-focus-within:w-full flex items-center w-0 rounded-full group-focus-within:border-black border-white group-focus-within:border sticky">
                        <input 
                        id="search"
                        name="search"
                        placeholder="Search"
                        type="search" 
                        autoComplete="off"
                        onChange={(e) => setSearchKey(e.target.value)}
                        //   onKeyDown={(e)=>{
                        //     if(e.key === "Enter"){
                        //       e.preventDefault()
                        //       if(searchKey.trim() !== "")
                        //         handleSearchButtonClick()
                        //     }
                        //   }}
                        className="cursor-pointer opacity-0 group-focus-within:opacity-100 invisible group-hover:visible group-focus-within:visible ease-in-out duration-500 rounded-full w-full h-5 py-3.5 pl-4 ml-1 text-[#101010] bg-gray-100 leading-tight focus:outline-none focus:shadow-outline lg:text-sm text-xs"
                        />
                        <button className="cursor-default -ml-11 group-focus-within:ml-auto group-focus-within:mr-1">
                            <FontAwesomeIcon icon={faMagnifyingGlass} style={{height: "14px", color: "#fc571a", }} className="cursor-pointer ml-4 rounded-full border-[#fc571a] mt-1 border p-1.5"/>
                        </button>
                    </div>
                </span>
            </form>
            <div className="flex flex-row items-center">
                <div className="items-center justify-center mr-3 sm:mr-5">
                    <FontAwesomeIcon icon={faBell} style={{height: "25px", color: "#fc571a", }} onClick={handleNotifBellClick}/>
                    {showBlueCircle &&
                        <div className="absolute rounded-full bg-blue-950 h-2.5 w-2.5 transform -translate-y-7 translate-x-2.5"></div>
                    }
                </div>
                <div className="order-last flex flex-row items-center py-1">
                    {userIcon}
                </div>
            </div>     
        </nav>
        {showNotifSystem &&
            <div className="sm:fixed sm:top-[46px] fixed sm:transform sm:translate-y-2 drop-shadow-md rounded-md z-50 sm:w-[350px] sm:h-5/6 w-screen h-screen sm:right-5 bg-white">
                <div id="notifTitle" className="text-xl font-bold px-5 mt-5 mb-2 text-[#fc571a]">Notifications</div>
                <>
                    {multipleNotifTypes.map((notif) => <Notification notif={notif}/>) /*Do this for all notification */}
                </>
            </div>
        }

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
 
 
