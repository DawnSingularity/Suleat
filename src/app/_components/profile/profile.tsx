"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faPlusCircle, faEdit, faMinusCircle  } from "@fortawesome/free-solid-svg-icons";
import { api } from "~/trpc/react";
import { useState } from 'react';
import { FollowModal } from "~/app/_components/profile/profile-follow-modal"
import { EditProfileModal } from "~/app/_components/profile/edit-profile-modal"
import { ProfilePosts } from "./profile-posts";
import { Prisma, User, Flavor } from "@prisma/client";
import { PillButton } from './pill-button';
import { Navbar } from "~/app/_components/common/navbar"

import { getQueryKey } from "@trpc/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { CreatePost } from "../create-post";


const userWithFlavors = Prisma.validator<Prisma.UserDefaultArgs>()({
  include: { flavors: true },
})

type UserWithFlavors = Prisma.UserGetPayload<typeof userWithFlavors>

  export default function UserProfileComponent({ data, followers, following }: { data: UserWithFlavors; followers: User[], following: User[] }) {
    const queryClient = useQueryClient()

    const [showFollowersModal, setShowFollowersModal] = useState(false);
    const [showFollowingModal, setShowFollowingModal] = useState(false); // Add state for modal visibility
    const [showEditProfileModal, setShowEditProfileModal] = useState(false)

    const loggedInUsernameQuery = api.profile.getCurrentUser.useQuery()
    const loggedInUsername = loggedInUsernameQuery.data ?? ""

    const isFollowing = followers.some((user) => user.userName === loggedInUsername);

    const followMutation = api.profile.updateFollowState.useMutation()

    const handleFollowButton = () => {
      // TODO: Handle follow functionality here
      followMutation.mutate({username: data.userName, state: !isFollowing}, {
        onSuccess: () => {
          const queryKey = getQueryKey(api.profile.getFollowers, {username: data.userName});
          queryClient.invalidateQueries({queryKey});
        }
      })
    };

    // Function to handle modal visibility
    const handleFollowersModal = () => {
      setShowFollowersModal(!showFollowersModal);
    };

    const handleFollowingModal = () => {
      setShowFollowingModal(!showFollowingModal);
    };

    const handleEditProfileModal = () => {
      setShowEditProfileModal(!showEditProfileModal)
    }

    const followIcon = isFollowing ? faMinusCircle : faPlusCircle;
    let followButton = <></>, editProfileButton = <></>;

    // follow button should not be visible in user's own profile
    if(loggedInUsernameQuery.isSuccess && loggedInUsername !== data.userName) {
      followButton = <FontAwesomeIcon icon={followIcon} className="hover:cursor-pointer hover:drop-shadow-md" style={{ color: '#24a0ed' }} onClick={handleFollowButton} />
    } 

    // edit button should only be visible in user's own profile
    if(loggedInUsernameQuery.isSuccess && loggedInUsername === data.userName) {
      editProfileButton = <FontAwesomeIcon id="edit-profile-button" className="hover:cursor-pointer hover:drop-shadow-md" icon={faEdit} onClick={handleEditProfileModal}/>
    }

  return (
    <main className={`h-full`}>
      <Navbar />
      <div className="shadow-xl rounded-xl container px-5 mx-auto flex justify-center flex-col md:flex-row w-full max-w-screen-lg relative h-[450px] md:h-[330px] items-start ">
        <img className="absolute top-0 inset-0 w-full h-60 rounded-xl z-0 object-cover" src={data.coverURL} alt="" />
        <img className="w-48 h-48 rounded-full absolute object-cover z-10 border-4 border-white bottom-22 md:bottom-0 md:left-5 left-1/2 transform -translate-x-1/2 md:transform-none" src={data.pfpURL} alt="" />
        <div className="absolute left-1/2 transform -translate-x-1/2 md:transform-none container flex flex-col md:flex-row md:w-9/12 md:full md:bottom-7 bottom-3 md:left-[25%]">
          <div className="md:ml-8 lg:ml-0 w-full max-w-screen md:w-80 flex-col flex justify-center items-center md:flex-none md:justify-normal md:items-start ">
            <p className="text-xl font-extrabold"> {data.firstName} {data.lastName} {followButton} {editProfileButton} </p>
            <p className="text-base font-font-medium color-gray"> @{data.userName} </p>
          </div>
          <div className=" w-full max-w-screen flex flex-row ">
            <div className="w-6/12 flex flex-col justify-center items-center px-0 rounded-full hover:bg-gray-200 transition-colors hover:cursor-pointer">
              <p className="text-xl font-extrabold"> 0 </p>
              <p className="text-base font-medium text-gray-500">posts</p>
            </div>
            <div onClick={handleFollowersModal} className="flex-col w-6/12 flex justify-center items-center px-0 rounded-full hover:bg-gray-200 transition-colors hover:cursor-pointer">
              <p className="text-xl font-extrabold"> {followers && followers.length} </p>
              <p className="text-base font-medium text-gray-500">followers</p>
            </div>

            <div onClick={handleFollowingModal} className="flex-col w-6/12 flex justify-center items-center px-0 rounded-full hover:bg-gray-200 transition-colors hover:cursor-pointer">
              <p className="text-xl font-extrabold"> {following && following.length} </p>
              <p className="text-base font-medium text-gray-500">following</p>
            </div>
            
          </div>
        </div>
      </div>

      <div className="container px-5 md:mx-auto pt-5 flex justify-center flex-col md:flex-row w-full h-full max-w-screen-lg">
        <div className="w-full md:w-3/12 order-1">
          <h2 className="text-sm font-bold flex items-center">
            <span className="mr-2 h-4 w-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path fill="#fc571a" d="M18 11v7a2 2 0 0 1-4 0v-5h-2V3a3 3 0 0 1 3-3h3v11zM4 10a2 2 0 0 1-2-2V1a1 1 0 0 1 2 0v4h1V1a1 1 0 0 1 2 0v4h1V1a1 1 0 0 1 2 0v7a2 2 0 0 1-2 2v8a2 2 0 0 1-4 0v-8z"></path>
              </svg>
            </span>
            FLAVOR PROFILE
          </h2>

          <div className="flex flex-wrap px-1 justify-center items-center md:justify-normal md:items-start">
            {data.flavors.map((flavor : Flavor, index : Number) => 
              <PillButton
                key={index.toString()}
                id={flavor.name} text={flavor.name} backgroundColor={flavor.color}
              />)}
          </div>

        </div>

        <div className="w-full md:w-6/12 order-3 md:order-2 mt-6 md:mt-1">
          <h2 className="text-lg font-bold">Posts</h2>
          <hr className="w-11/12 mt-2 border-1 border-gray-300" />
          <div className="md:w-11/12 w-full">
            <ProfilePosts username={data.userName} />
          </div>
        </div>
        
        <div className="w-full md:w-3/12 order-2 md:order-3 mt-6 md:mt-1">
          <h2 className="text-base font-semibold">About {data.firstName} </h2>
          <h3 className="mt-2 font-light">
          <FontAwesomeIcon icon={faLocationDot} className="mr-2" style={{ color: 'red' }} /> {data.location}
          </h3>
          <p className="mt-2">
            { data.bio }
          </p>
        </div>
      </div>
      {showFollowersModal && <FollowModal onClose={handleFollowersModal} title="Followers" users={followers} />} {/* Show modal based on state */}
      {showFollowingModal && <FollowModal onClose={handleFollowingModal} title="Following" users={following} />} {/* Show modal based on state */}
      {showEditProfileModal && <EditProfileModal onClose={handleEditProfileModal} data={data} />} {/* Show edit profile modal based on state */}
      <CreatePost />
    </main>
  );
}