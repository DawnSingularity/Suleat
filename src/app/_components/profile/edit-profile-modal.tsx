"use client"


import { ChangeEvent, useEffect, useState } from "react";
import { Prisma, User, Flavor, PrismaClient } from "@prisma/client";
import { api } from "~/trpc/react";
import { getQueryKey } from "@trpc/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { FlavorProfileSelector, useFlavorStates } from "./flavor-profile-selector";
const userWithFlavors = Prisma.validator<Prisma.UserDefaultArgs>()({
  include: { flavors: true },
})

type UserWithFlavors = Prisma.UserGetPayload<typeof userWithFlavors>

export function EditProfileModal({ onClose, data }: { onClose: () => void, data: UserWithFlavors }) {
  const queryClient = useQueryClient()
  const {mutate} = api.profile.updateUserProfile.useMutation();
  const [newProfilePhoto, setNewProfilePhoto] = useState<File | null>(null);
  const [newCoverPhoto, setNewCoverPhoto] = useState<File | null>(null);

  const wholeListOfFlavors = api.flavor.getFlavors.useQuery().data ?? []
  const [flavorStates, setFlavorStates] = useFlavorStates({initialValues: data.flavors})

  // Helper functions
  const getUserProfileUrl = () : string => {
    return newProfilePhoto != null ? URL.createObjectURL(newProfilePhoto) : data.pfpURL;
  }

  const getUserCoverUrl = () : string => {
    return newCoverPhoto != null ? URL.createObjectURL(newCoverPhoto) : data.coverURL;
  }

  // Event Listeners
  const changeCover = (event: ChangeEvent) => {
    console.log("Request to Change Cover Photo Reached")
    if (event.target instanceof HTMLInputElement && event.target.files && event.target.files[0]) {
      setNewCoverPhoto(event.target.files[0])
    } else {
      console.log("Changing Cover Photo Preview Failed!")
    }
  }

  const changeProfilePhoto = (event: ChangeEvent) => {
    console.log("Request to Change Cover Photo Reached")
    if (event.target instanceof HTMLInputElement && event.target.files && event.target.files[0]) {
      setNewProfilePhoto(event.target.files[0])
    } else {
      console.log("Changing Profile Photo Preview Failed!")
    }
  }



  const saveProfile = async () => {
    // handle saving information to database here
    const firstNameInput = document.getElementById("firstName") as HTMLInputElement
    const lastNameInput = document.getElementById("lastName") as HTMLInputElement
    const bioInput = document.getElementById("bio") as HTMLTextAreaElement
    const locationInput = document.getElementById("location") as HTMLInputElement



    const updatedData = {
      firstName: firstNameInput.value,
      lastName: lastNameInput.value,
      bio: bioInput.value,
      location: locationInput.value,
      flavors: flavorStates.toArray()
    }
    console.log(data)

    // step 2: upload files
    const uploadFile = async (intent : String, file : File) => {
      const data = new FormData();
      data.append("file", file);
      await fetch("/api/upload/" + intent,
      {
        method: "POST",
        body: data,
      });
    } 

    if (newProfilePhoto != null) {
      await uploadFile("pfp", newProfilePhoto)
    }
    if (newCoverPhoto != null) {
      await uploadFile("cover", newCoverPhoto)
    }

    // step 3: update data
    const result = mutate(updatedData, {
      onSuccess: () => {
        const queryKey = getQueryKey(api.profile.getUserProfile, {username: data.userName});
        queryClient.invalidateQueries({queryKey});
      },
      onError: () => {
        console.log("Error updating profile")
      },
      onSettled: () => {
        onClose()
      },
    })
  }

  return (  

  <div id="defaultModal" tabIndex={-1} aria-hidden="true" className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
    {/* Modal (Box) itself */}
    <div className="w-full max-w-2xl pb-6 pl-6 pr-6 pt-2 m-5 bg-white rounded-lg shadow-lg">
      {/* Modal content */}
      <div className="relative">
        {/* Modal header */}
        <div className="flex items-start border-b rounded-t">
          <button onClick={onClose} type="button" className="my-4 mr-1 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center" data-modal-hide="defaultModal">
            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
            </svg>
            <span className="sr-only">Close modal</span>
          </button>
          <h3 className="p-4 text-xl font-semibold text-gray-900">Edit Profile</h3>
          <button onClick={saveProfile} type="button" className="text-white md:w-20 w-16 p-1 mt-4 mb-4 mr-2 ml-auto bg-[#fc571a] rounded-2xl">Save</button>
        </div>
        {/* Modal body */}
        <div className="m-auto">
          <div className="">
            {/* TODO: Edit Profile Content */}
            <form method="PATCH" id="edit-profile-form">
              <div> {/* This is to let the absolute position of cover + profile photos to anchor to this element */}
                <br></br>
              </div>
              <div className="">
                <div className="cursor-pointer absolute w-full flex justify-center group">
                  <input onChange={changeCover} className="cursor-pointer z-20 opacity-0 w-full h-40 rounded-lg absolute" id="coverPhoto" type="file" name="coverPhoto" accept="image/*"/>
                  <img id="newCoverPhoto" className="cursor-pointer w-full h-40 rounded-lg z-0 object-cover" src={getUserCoverUrl()} alt="" />
                  <div className="cursor-pointer text-sm text-white fixed mx-auto z-10 self-center opacity-0 group-hover:opacity-100">Choose New</div>
                  <div className="cursor-pointer absolute w-full h-40 rounded-lg bg-black opacity-0 group-hover:opacity-70"></div>
                </div>

                <div className="cursor-pointer flex justify-start ml-2 md:ml-4 mt-20 w-32 h-32 md:h-36 md:w-36 rounded-full absolute group">
                  <input onChange={changeProfilePhoto} className="cursor-pointer z-40 opacity-0 absolute w-32 h-32 md:h-36 md:w-36 rounded-full" id="profilePhoto" type="file" name="profilePhoto" accept="image/*"/>
                  <div className="cursor-pointer text-sm text-white mx-auto z-30 self-center opacity-0 group-hover:opacity-100">Choose New</div>
                  <div className="cursor-pointer border-4 border-white-1000 absolute z-20 w-32 h-32 md:h-36 md:w-36 rounded-full bg-black opacity-0 group-hover:opacity-70"></div>
                  <img id="newProfilePhoto" className="cursor-pointer justify-start w-32 h-32 md:h-36 md:w-36 rounded-full absolute object-cover group-hover:z-0 border-4 border-white-1000 transform md:transform-none" src={getUserProfileUrl()} alt="" />
                </div>
              </div>
              
              {/* Text Edits */}
              <div className="mt-56 h-64 overflow-y-auto p-2 mb-2">
                <div className="">
                  <label htmlFor="firstName" className="pl-0 text-sm text-stone-500">First Name</label>
                  <input id="firstName" name="firstName" className="border-2 border-stone-200 rounded p-2 w-full justify-center" placeholder="Enter your first name." defaultValue={data.firstName} type="text"></input>
                </div>
                <div className="mt-2">
                  <label htmlFor="lastName" className="pl-0 text-sm text-stone-500">Last Name</label>
                  <input id="lastName" name="lastName" className="border-2 border-stone-200 rounded p-2 w-full justify-center" placeholder="Enter your last name." defaultValue={data.lastName} type="text"></input>
                </div>
                <div className="mt-2">
                  <label htmlFor="bio" className="pl-0 text-sm text-stone-500">Bio</label><br></br>
                  <textarea className="border-2 border-stone-200 rounded p-2 w-full justify-center" name="bio" id="bio" rows={5} placeholder="Write something about yourself." defaultValue={data.bio}></textarea>
                </div>
                <div className="mt-1">
                  <label htmlFor="location" className="pl-0 text-sm text-stone-500">Location</label>
                  <input id="location" name="location" className="border-2 border-stone-200 rounded p-2 w-full justify-center" placeholder="Enter your location." defaultValue={data.location} type="text"></input>
                </div>
                <div className="mt-2">
                  <label htmlFor="flavors" className="pl-2 text-sm text-stone-500">Flavors</label><br></br>
                  <FlavorProfileSelector flavors={wholeListOfFlavors} flavorStates={flavorStates} setFlavorStates={setFlavorStates} className="pl-2 ml-1"/>
                </div>    
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div> 

  )

}
  
  