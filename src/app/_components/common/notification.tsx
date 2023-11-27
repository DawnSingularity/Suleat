import { FavNotification } from "@prisma/client";
import { api } from "~/trpc/react";
import Link from "next/link";
import { UserIcon } from "./user-icon"

export function Notification({notif}: {notif: FavNotification}) { // add || to add more types of notifs

    let showComment = false
    let action = ""

    if(notif.category === "favorite") {
        const userLiker = api.profile.getUserById.useQuery({uuid: notif.favUserLikerId})
        if(userLiker.data) {
            return (
                <>
                    <div className="flex break-all w-ful h-16 hover:brightness-90 p-5 bg-white mb-1 items-center line-clamp-2">
                        <div id = "pfp" className=" flex flex-row items-center">
                            <Link href={`/profile/${userLiker?.data?.userName}`}>
                                <UserIcon user={userLiker?.data} width="10" className="mr-3 self-center" />
                            </Link>
                        </div>
                        <div id="text" className="text-sm line-clamp-2 text-ellipsis overflow-hidden whitespace-nowrap">
                            {userLiker.data?.firstName}&nbsp;{userLiker.data?.lastName} liked your post. Today and beyond, we are going to the world
                        </div>
                    </div>
                </>
            )
        }
    } else if(notif.category === "follow") {
        action = " followed you."
    } else if(notif.category === "comment") {
        action = " commented on your post: "
        showComment = true

        // handle trim comment here

    } else if(notif.category === "reply") {
        // handle if-else of notifying post author or comment author here
        action = " replied to your comment: "
        let tempAction2 = " replied to a comment under your post: "
    }

    return(
        <>
            <div className="w-full h-16 hover:brightness-90 p-5 bg-white mb-1">
                You received a notif from...
            </div>
        </>
    )
}