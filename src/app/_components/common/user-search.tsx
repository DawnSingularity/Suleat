import Link from "next/link"
import { Flavor, Post, Prisma, User } from "prisma/prisma-client"
import { useAuth } from "@clerk/nextjs";
import { UserIcon } from "./user-icon"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis, faLocationDot  } from "@fortawesome/free-solid-svg-icons";
import { PillButton } from "../profile/pill-button" 
import { api } from "~/trpc/react";
import { useQueryClient } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";

const userWithFlavors = Prisma.validator<Prisma.UserDefaultArgs>()({
    include: { flavors: true },
  })
  
  type UserWithFlavors = Prisma.UserGetPayload<typeof userWithFlavors>

export function UserComponent({ user }: { user: UserWithFlavors }) {
  const auth = useAuth();
  console.log("Flavors: " + user.flavors)

  const loggedInUsernameQuery = api.profile.getCurrentUser.useQuery()
  const followMutation = api.profile.updateFollowState.useMutation()
  const loggedInUsername = loggedInUsernameQuery.data ?? ""
  const followers = api.profile.getFollowers.useQuery({username: user.userName}).data as User[];
  const queryClient = useQueryClient()

  const isFollowing = followers?.some((user) => user.userName === loggedInUsername);
  const followIcon = isFollowing ? "Unfollow" : "Follow";

  const handleFollowButton = () => {
    // TODO: Handle follow functionality here
    followMutation.mutate({username: user.userName, state: !isFollowing}, {
      onSuccess: () => {
        const queryKey = getQueryKey(api.profile.getFollowers, {username: user.userName});
        queryClient.invalidateQueries({queryKey});
      }
    })
  };

  let followButton = <></>, followText = <></>
    if(loggedInUsernameQuery.isSuccess && loggedInUsername !== user.userName) {
        followText = <PillButton id="reserved" text={followIcon} backgroundColor="linear-gradient(to bottom, #005cb1, #005cb1)" className="color-white text-white font-bold cursor-pointer" onChange={handleFollowButton} />
        followButton = <FontAwesomeIcon icon={faEllipsis} rotation={90} style={{color: "#000000",}}/>
    }

  return (
    <>
    <Link href={`/profile/${user.userName}`}>
      <div className="bg-white mb-3 p-4 rounded-lg drop-shadow-md">
        <div className=" flex flex-row items-center justify-between">
            <div className="order-first flex flex-row items-center">
                <UserIcon user={user} width="10" className="mr-3" />
                <div>
                    <div className="text-sm">{ user.firstName } { user.lastName }</div>
                    <div className="text-xs text-red-600">
                        <FontAwesomeIcon icon={faLocationDot} className="mr-1" style={{ color: 'red' }} />
                        { user.location }
                    </div>
                </div>
            </div>
        { auth.isSignedIn ? (
            <div className="order-last flex flex-row items-center">
                {followText}
                {followButton}
            </div>
        ) : (<></>)}
        </div>
        <div className="flex flex-wrap px-1 ml-12">
          {user.flavors?.map((flavor : Flavor, index : Number) => 
            <PillButton
              key={index.toString()}
              id={flavor.name} text={flavor.name} backgroundColor={flavor.color}
              className="cursor-default"
            />)}
        </div>
      </div>
      
      
  </Link>
    </>
  )
}
