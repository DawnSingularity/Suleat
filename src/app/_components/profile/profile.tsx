"use client";

import styles from './profile.module.css';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faPlusCircle, faEdit, faMinusCircle  } from "@fortawesome/free-solid-svg-icons";

import { useState } from 'react';
import { FollowersModal } from "~/app/_components/profile/profile-followers-modal"
import { FollowingModal } from "~/app/_components/profile/profile-following-modal"
import { EditProfileModal } from "~/app/_components/profile/edit-profile-modal"

import { Prisma, User, Flavor } from "@prisma/client";
const userWithFlavors = Prisma.validator<Prisma.UserDefaultArgs>()({
  include: { flavors: true },
})

type UserWithFlavors = Prisma.UserGetPayload<typeof userWithFlavors>

  export default function UserProfileComponent({ data, followers, following }: { data: UserWithFlavors; followers: User[], following: User[] }) {
    const [showFollowersModal, setShowFollowersModal] = useState(false);
    const [showFollowingModal, setShowFollowingModal] = useState(false); // Add state for modal visibility
    const [showEditProfileModal, setShowEditProfileModal] = useState(false)

    const [isFollowing, setIsFollowing] = useState(false); // Add state for follow button

    const handleFollowButton = () => {
      // TODO: Handle follow functionality here
      setIsFollowing(!isFollowing);
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

  return (
    <main className={`h-full`}>
      <div className="container px-5 mx-auto mt-5 flex justify-center flex-col md:flex-row w-full max-w-screen-lg relative h-[450px] md:h-[330px] items-start ">
        <img className="absolute top-0 inset-0 w-full max-w-screen h-60 rounded-lg z-0 object-cover" src={data.coverURL} alt="" />
        <img className="w-48 h-48 rounded-full absolute object-cover z-10 border-4 border-white bottom-22 md:bottom-0 md:left-5 left-1/2 transform -translate-x-1/2 md:transform-none" src={data.pfpURL} alt="" />
        <div className="absolute left-1/2 transform -translate-x-1/2 md:transform-none container flex flex-col md:flex-row md:w-7/12 md:full md:bottom-7 bottom-3 md:left-[35%]">
          <div className="w-full max-w-screen md:w-5/12 flex-col flex justify-center items-center md:flex-none md:justify-normal md:items-start md:-translate-x-24">
            <p className="text-xl font-extrabold"> {data.firstName} {data.lastName} <FontAwesomeIcon icon={followIcon} className="hover:cursor-pointer hover:drop-shadow-md" style={{ color: '#24a0ed' }} onClick={handleFollowButton} /> <FontAwesomeIcon id="edit-profile-button" className="hover:cursor-pointer hover:drop-shadow-md" icon={faEdit} onClick={handleEditProfileModal}/></p>
            <p className="text-base font-font-medium color-gray"> @{data.userName} </p>
          </div>
          <div className="w-full max-w-screen flex flex-row ">
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

      <div className="container px-5 md:mx-auto mt-5 flex justify-center flex-col md:flex-row w-full max-w-screen-lg">
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
            {data.flavors.map((flavor : Flavor, index : Number) => (
              <button
                key={index.toString()}
                className={`my-1 mx-2 text-xs hover:bg-orange-700 text-white py-1 px-2 rounded-full h-full ${styles.suleat}`} 
              >
                {flavor.name}
              </button>
            ))}
          </div>

        </div>

        <div className="w-full md:w-6/12 order-3 md:order-2 mt-6 md:mt-1">
          <h2 className="text-lg font-bold">Posts</h2>
          <hr className="w-11/12 mt-2 border-1 border-gray-300" />
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
      {showFollowersModal && <FollowersModal onClose={handleFollowersModal} followers = {followers}/>} {/* Show modal based on state */}
      {showFollowingModal && <FollowingModal onClose={handleFollowingModal} following={following} />} {/* Show modal based on state */}
      {showEditProfileModal && <EditProfileModal onClose={handleEditProfileModal} data={data} />} {/* Show edit profile modal based on state */}
    </main>
  );
}