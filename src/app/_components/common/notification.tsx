import { FavNotification, FollowNotification, CommentNotification } from "@prisma/client";
import { api } from "~/trpc/react";
import Link from "next/link";
import { UserIcon } from "./user-icon"
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

export function Notification({notif}: {notif: FavNotification | CommentNotification | FollowNotification}) { // add || to add more types of notifs

    let showComment = false
    let action = ""
    if(notif.category === "favorite" && 'favUserLikerId' in notif) {
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
    } else if(notif.category === "follow" && 'followerId' in notif) {
        const follower = api.profile.getUserById.useQuery({uuid: notif.followerId})

        if(follower.data) {
            return (
                <>
                    <Link href={`/profile/${follower.data.userName}`}>
                        <div className="flex flex-row w-full h-[70px] hover:brightness-90 bg-white p-5 mb-1 items-center">
                            <span id ="pfp" className="w-[58px] w- mr-3 flex flex-row items-center object-cover">
                                <UserIcon user={follower?.data} width="12" className="self-center" />
                            </span>
                            
                            <div className="w-full">
                                <span id="text" className="text-sm line-clamp-2 ">
                                    <span className="font-semibold">{follower.data?.firstName}&nbsp;{follower.data?.lastName}</span> followed you.
                                </span>
                                <p className="text-[12px] text-gray-400">{dayjs(notif.createdAt).fromNow()}</p>
                            </div>
                        </div>
                    </Link>
                </>
            )
        }
    } else if(notif.category === "comment" && 'commentId' in notif) {
        action = " commented on your post: "
        showComment = true
        // handle trim comment here
        const userLiker = api.comment.getCommentById.useQuery({commentId: notif.commentId})
        if(userLiker.data) {
            return (
                <>
                    <Link href={`/post/${userLiker.data.postId}`}>
                        <div className="flex flex-row w-full h-[70px] hover:brightness-90 bg-white p-5 mb-1 items-center">
                            <span id ="pfp" className="w-[58px] w- mr-3 flex flex-row items-center object-cover">
                                <UserIcon user={userLiker?.data.author} width="12" className="self-center" />
                            </span>
                            
                            <div className="w-full">
                                <span id="text" className="text-sm line-clamp-2 break-all">
                                    <span className="font-semibold">{userLiker.data?.author.firstName}&nbsp;{userLiker.data?.author.lastName}</span> {action} {userLiker.data.text}
                                </span>
                                <p className="text-[12px] text-gray-400">{dayjs(notif.createdAt).fromNow()}</p>
                            </div>
                        </div>
                    </Link>
                </>
            )
        }

    } else if(notif.category === "reply" && 'commentId' in notif && 'notifyWho' in notif) {
        // handle if-else of notifying post author or comment author here
        action = " replied to your comment: "
        let tempAction2 = " replied to a comment under your post: "

        const userLiker = api.comment.getCommentById.useQuery({commentId: notif.commentId})

        if(userLiker.data && notif.notifyWho === "postAuthor") {
            return (
                <>
                    <Link href={`/post/${userLiker.data.postId}`}>
                        <div className="flex flex-row w-full h-[70px] hover:brightness-90 bg-white p-5 mb-1 items-center">
                            <span id ="pfp" className="w-[58px] w- mr-3 flex flex-row items-center object-cover">
                                <UserIcon user={userLiker?.data.author} width="12" className="self-center" />
                            </span>
                            
                            <div className="w-full">
                                <span id="text" className="text-sm line-clamp-2 break-all">
                                    <span className="font-semibold">{userLiker.data?.author.firstName}&nbsp;{userLiker.data?.author.lastName}</span> replied to a comment on your post: {userLiker.data.text}
                                </span>
                                <p className="text-[12px] text-gray-400">{dayjs(notif.createdAt).fromNow()}</p>
                            </div>
                        </div>
                    </Link>
                </>
            )
        }

        else if(userLiker.data && notif.notifyWho === "parentCommentAuthor") {
            return (
                <>
                    <Link href={`/post/${userLiker.data.postId}`}>
                        <div className="flex flex-row w-full h-[70px] hover:brightness-90 bg-white p-5 mb-1 items-center">
                            <span id ="pfp" className="w-[58px] w- mr-3 flex flex-row items-center object-cover">
                                <UserIcon user={userLiker?.data.author} width="12" className="self-center" />
                            </span>
                            
                            <div className="w-full">
                                <span id="text" className="text-sm line-clamp-2 break-all">
                                    <span className="font-semibold">{userLiker.data?.author.firstName}&nbsp;{userLiker.data?.author.lastName}</span> replied to your comment: {userLiker.data.text}
                                </span>
                                <p className="text-[12px] text-gray-400">{dayjs(notif.createdAt).fromNow()}</p>
                            </div>
                        </div>
                    </Link>
                </>
            )
        }
    }

}