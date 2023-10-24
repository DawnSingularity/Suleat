"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { api } from "~/trpc/react";

export function FollowersModal({ onClose }: { onClose: () => void }) {
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
          <div className="p-6">
            <div className="h-96 overflow-y-auto">
              {/* TODO: Display followers here */}
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed quis aliquam ante. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nulla eget consequat felis. Nam id mi elementum enim convallis dapibus pulvinar ac lectus. Nullam lobortis sapien id lacus congue consequat. Vestibulum at varius ex, quis consectetur magna. Aenean sed laoreet dui. Quisque mollis magna sed magna iaculis semper. Sed finibus sem ut lacus sollicitudin interdum. Vivamus metus lectus, convallis vel varius et, euismod quis velit. Aliquam dapibus mauris enim, nec varius arcu condimentum eget. Maecenas sit amet sodales orci.

Vivamus luctus diam lacus, ac laoreet dui blandit a. Proin ac dapibus elit. Quisque bibendum nulla dui. Nunc congue velit vitae turpis pretium pulvinar. Morbi nisl risus, condimentum vitae nisi id, feugiat vestibulum lacus. Sed sed hendrerit eros, at viverra erat. Aenean id ultricies metus. Cras ac turpis id augue venenatis sagittis. Ut rhoncus lectus id metus tincidunt, sed faucibus orci tempus. Nam consequat lectus sit amet eros finibus ultrices. Mauris egestas gravida elit, tincidunt egestas mi gravida vel. Nulla turpis sapien, facilisis quis augue vitae, facilisis sagittis metus.

Proin est felis, vulputate ut semper a, tincidunt ut ipsum. Maecenas at magna ligula. Ut pellentesque sodales pretium. Integer pellentesque ullamcorper imperdiet. Ut consequat est eget orci sollicitudin, at tempus justo porttitor. Morbi fermentum sodales venenatis. Integer sem orci, feugiat sodales laoreet in, accumsan at quam. Suspendisse vitae magna nisi. Fusce non tincidunt diam. Integer eu egestas mi. Morbi est ex, vestibulum id bibendum vel, efficitur vel tellus. Maecenas fermentum, lectus ac malesuada auctor, est lacus interdum tellus, placerat varius massa orci vitae ligula. Donec finibus vitae dui at ullamcorper.

Proin interdum efficitur est, sit amet aliquam orci consequat eget. Nulla non nisi lacus. Morbi gravida lacus nec faucibus fermentum. In dictum lorem ex, et ultricies ante faucibus ac. Pellentesque justo justo, eleifend sit amet nulla et, consequat euismod risus. Nullam semper lectus sed ipsum vulputate, non gravida elit auctor. Mauris ultricies eros dignissim condimentum ullamcorper.

Aliquam nec erat libero. Nulla porta arcu ultrices dui facilisis, pulvinar pellentesque est laoreet. Maecenas egestas neque est, sit amet lobortis urna venenatis sed. Suspendisse eu pellentesque leo. Nulla quis dapibus quam, id consectetur risus. Ut tincidunt, risus accumsan imperdiet vehicula, libero diam finibus mi, id faucibus purus nibh sed est. In nec nibh et ex lacinia interdum. Vivamus tincidunt, purus vel volutpat ullamcorper, tortor magna consectetur lectus, quis cursus purus massa vitae velit. Duis purus purus, rutrum non risus et, ornare luctus diam. Aenean congue, est et molestie gravida, odio metus facilisis ante, consequat ullamcorper tellus diam at risus. Nunc et elit ac lacus efficitur laoreet id eget sapien. Nulla varius eget nulla at iaculis. Etiam tempor urna id euismod mattis.</p>
              {/* Long content here */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
  
}

