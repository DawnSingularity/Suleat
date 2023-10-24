"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { api } from "~/trpc/react";

interface ProfileData {
    firstName: string;
    lastName: string;
    username: string;
    postsCount: number;
    followers: number;
    following: number;
    location: string;
    profilePic: string;
    banner: string;
    bio: string;
    flavorProfile: string[];
  }

export function EditProfileModal({ onClose, data }: { onClose: () => void, data: ProfileData }) {
    return (
      <div
        id="defaultModal"
        tabIndex={-1}
        aria-hidden="true"
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50"
      >
        {/* Modal (Box) itself */}
        <div className="w-full max-w-xl p-6 m-5 bg-white rounded-lg shadow-lg">
          {/* Modal content */}
          <div className="relative">
            {/* Modal header */}
            <div className="flex items-start justify-between p-4 border-b rounded-t mb-3">
              <h3 className="text-xl font-semibold text-gray-900">Edit Profile</h3>
              <button
                onClick={onClose}
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center"
                data-modal-hide="defaultModal"
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            {/* Modal body */}
            <div className="m-auto">
              <div className="h-96 overflow-y-auto">
                {/* TODO: Edit Profile Content */}
                <div className="absolute w-full flex justify-center group">
                  <img className="w-full h-40 rounded-lg z-0 object-cover" src={data.banner} alt="" />
                  <div className="text-sm text-white fixed mx-auto z-10 self-center opacity-0 group-hover:opacity-100">Change Cover</div>
                  <div className="absolute w-full h-40 rounded-lg bg-black opacity-0 group-hover:opacity-50"></div>
                </div>
                <div className="flex justify-start ml-4 md:ml-7 mt-16 w-32 h-32 md:h-36 md:w-36 rounded-full absolute group bg-green-500">
                    <div className="text-sm text-white mx-auto z-20 self-center opacity-0 group-hover:opacity-100">Change Profile</div>
                    <div className="border-4 border-white-1000 absolute z-10 w-32 h-32 md:h-36 md:w-36 rounded-full bg-black opacity-0 group-hover:opacity-50"></div>
                    <img className="justify-start w-32 h-32 md:h-36 md:w-36 rounded-full absolute object-cover group-hover:z-0 border-4 border-white-1000 transform md:transform-none" src={data.profilePic} alt="" />
                </div>
                

                
                {/* Long content here */}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
    
    
  }
  
  