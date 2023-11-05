import Link from 'next/link';
import { api } from "~/trpc/react";
import { User } from "@prisma/client";

import { getQueryKey } from "@trpc/react-query";
import { useQueryClient } from "@tanstack/react-query";

export default function UserList({ follower }: { follower: User }) {
  const queryClient = useQueryClient()
  
  const loggedInUsername = api.profile.getCurrentUser.useQuery().data ?? ""
  const followCheckQuery = {follower: loggedInUsername, following: follower.userName}
  const isFollowing = api.profile.isFollowing.useQuery(followCheckQuery).data

  const followMutation = api.profile.updateFollowState.useMutation()

  const handleFollowToggle = () => {
    followMutation.mutate({username: follower.userName, state: !isFollowing}, {
      onSuccess: () => {
        const queryKey = getQueryKey(api.profile.isFollowing, followCheckQuery)
        void queryClient.invalidateQueries({queryKey: getQueryKey(api.profile.getFollowers)})
        void queryClient.invalidateQueries({queryKey: getQueryKey(api.profile.getFollowing)})
        void queryClient.invalidateQueries({queryKey: getQueryKey(api.profile.isFollowing, followCheckQuery)})

      }
    })
  };

  let followButton;
  if(loggedInUsername !== follower.userName) {
    followButton = (
      <button
      onClick={handleFollowToggle}
      className={`w-[86px] px-4 py-1 rounded-lg text-xs font-bold text-${isFollowing ? 'blue-600' : 'white'}  ${isFollowing ? 'bg-gray-200' : 'bg-blue-600'}`}
      >
        {isFollowing ? "Unfollow" : "Follow"}
      </button>
    )
  }

  return (
    <div className={`flex flex-row w-full gap-3 ${isFollowing ? 'bg-white border-blue-600' : 'bg-white'}`}>
      <div className="w-12">
        <img className="rounded-full h-10 w-10" src={follower.pfpURL} alt="" />
      </div>
      <div className="w-48 flex-col flex">
        <Link href={`/profile/${follower.userName}`}>
          <p className="text-sm font-extrabold">{follower.firstName} {follower.lastName}</p>
        </Link>
        <p className="text-xs font-font-medium color-gray">@{follower.userName}</p>
      </div>
      <div className="w-12">
        { followButton }
      </div>
    </div>
  );
}
