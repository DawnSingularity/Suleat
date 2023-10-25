"use client";

import UserList from "~/app/_components/profile/profile-user-list"
import { User } from "@prisma/client";

export function FollowersModal({ onClose, followers }: { onClose: () => void; followers: User[] }) {
  return (
    <div
      id="defaultModal"
      tabIndex={-1}
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50"
    >
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        {/* Modal content */}
        <div className="relative">
          {/* Modal header */}
          <div className="flex items-start justify-between p-4 border-b rounded-t">
            <h3 className="text-xl font-semibold text-gray-900">Followers</h3>
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
          <div className="py-6 px-2">
            <div className="h-96 overflow-y-auto flex flex-col gap-5">
            {followers.map((follower, index) => (
              <UserList key={index} follower={follower} />
            ))}
            {followers.map((follower, index) => (
              <UserList key={index} follower={follower} />
            ))}
            {followers.map((follower, index) => (
              <UserList key={index} follower={follower} />
            ))}
            {followers.map((follower, index) => (
              <UserList key={index} follower={follower} />
            ))}
            {followers.map((follower, index) => (
              <UserList key={index} follower={follower} />
            ))}
            {followers.map((follower, index) => (
              <UserList key={index} follower={follower} />
            ))}
            {followers.map((follower, index) => (
              <UserList key={index} follower={follower} />
            ))}
            {followers.map((follower, index) => (
              <UserList key={index} follower={follower} />
            ))}
            {followers.map((follower, index) => (
              <UserList key={index} follower={follower} />
            ))}
            {followers.map((follower, index) => (
              <UserList key={index} follower={follower} />
            ))}
            {followers.map((follower, index) => (
              <UserList key={index} follower={follower} />
            ))}
            {followers.map((follower, index) => (
              <UserList key={index} follower={follower} />
            ))}
            {followers.map((follower, index) => (
              <UserList key={index} follower={follower} />
            ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
  
}

