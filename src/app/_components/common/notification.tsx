import { FavNotification } from "@prisma/client";
import { api } from "~/trpc/react";
import Link from "next/link";
import { UserIcon } from "./user-icon"
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

export function Notification({notif}: {notif: FavNotification}) { // add || to add more types of notifs

    let showComment = false
    let action = ""

    if(notif.category === "favorite") {
        const userLiker = api.profile.getUserById.useQuery({uuid: notif.favUserLikerId})
        if(userLiker.data) {
            return (
                <>
                    <Link href={`/post/${notif.favPostLikedId}`}>
                        <div className="flex flex-row w-full h-[70px] hover:brightness-90 bg-white p-5 mb-1 items-center">
                            <span id ="pfp" className="w-[58px] w- mr-3 flex flex-row items-center object-cover">
                                <UserIcon user={userLiker?.data} width="12" className="self-center" />
                            </span>
                            
                            <div className="w-full">
                                <span id="text" className="text-sm line-clamp-2 ">
                                    <span className="font-semibold">{userLiker.data?.firstName}&nbsp;{userLiker.data?.lastName}</span> liked your post.
                                </span>
                                <p className="text-[12px] text-gray-400">{dayjs(notif.createdAt).fromNow()}</p>
                            </div>
                        </div>
                    </Link>
                </>
            )
        }
    } else if(notif.category === "follow") {
        // WIP
        // const follower = api.profile.getUserById.useQuery({uuid: notif.followerId})

        // if(follower.data) {
        //     return (
        //         <>
        //             <Link href={`/profile/${follower.data.userName}`}>
        //                 <div className="flex flex-row w-full h-[70px] hover:brightness-90 bg-white p-5 mb-1 items-center">
        //                     <span id ="pfp" className="w-[58px] w- mr-3 flex flex-row items-center object-cover">
        //                         <UserIcon user={follower?.data} width="12" className="self-center" />
        //                     </span>
                            
        //                     <div className="w-full">
        //                         <span id="text" className="text-sm line-clamp-2 ">
        //                             <span className="font-semibold">{follower.data?.firstName}&nbsp;{follower.data?.lastName}</span> followed you.
        //                         </span>
        //                         <p className="text-[12px] text-gray-400">{dayjs(notif.createdAt).fromNow()}</p>
        //                     </div>
        //                 </div>
        //             </Link>
        //         </>
        //     )
        // }
    } else if(notif.category === "comment") {
        action = " commented on your post: "
        showComment = true

        // handle trim comment here

    } else if(notif.category === "reply") {
        // handle if-else of notifying post author or comment author here
        action = " replied to your comment: "
        let tempAction2 = " replied to a comment under your post: "
    }

    // return(
    //     <>
    //         <div className="w-full h-16 hover:brightness-90 p-5 bg-white mb-1">
    //             You received a notif from...
    //         </div>
    //     </>
    // )
}