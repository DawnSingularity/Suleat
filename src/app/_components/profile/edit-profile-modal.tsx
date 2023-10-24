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
                  <img className="w-full h-36 rounded-lg z-0 object-cover" src={data.banner} alt="" />
                  <div className="text-white fixed mx-auto z-10 self-center opacity-0 group-hover:opacity-100">Edit Cover Photo</div>
                  <div className="absolute w-full h-36 rounded-lg bg-black opacity-0 group-hover:opacity-50"></div>
                </div>
                

                
                {/* Long content here */}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
    
    
  }
  
  