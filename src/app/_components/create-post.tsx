"use client";

import { useUser } from "@clerk/clerk-react";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImages } from "@fortawesome/free-solid-svg-icons";

import { Prisma, User, Flavor, PrismaClient } from "@prisma/client";
import { api } from "~/trpc/react";
import { LoadingSpinner } from "./loading";

import { ImageUploadPreview } from "./image-upload-preview";
import { FlavorProfileSelector, useFlavorStates } from "./profile/flavor-profile-selector";
const userWithFlavors = Prisma.validator<Prisma.UserDefaultArgs>()({
  include: { flavors: true },
})

type UserWithFlavors = Prisma.UserGetPayload<typeof userWithFlavors>

const CreatePostWizard = () =>{
  const user = useUser();
  const [location, setLocation] = useState("");
  const [caption, setCaption] = useState("");
  
  const wholeListOfFlavors = api.flavor.getFlavors.useQuery().data ?? [];
  const [flavorStates, setFlavorStates] = useFlavorStates();

  const ctx = api.useUtils();

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  // ADD IMAGES
  type FilesType = {
    [key: string]: File;
  };
  let FILES: FilesType = {}; // use to store pre selected files

  const reqAddImages = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFiles = Array.from(event.target.files);
  
      // Check if the number of uploaded files plus the selected files is less than or equal to 5
      if (uploadedFiles.length + selectedFiles.length <= 5) {
        // Update the uploaded files array
        setUploadedFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
        toast.success(`${selectedFiles.length} image(s) added successfully!`);
      } else {
        toast.error("You can upload only up to 5 images.");
      }
  
      // Clear the input field after successful or failed upload
      event.target.value = "";
    } else {
      console.log("Image upload failed!");
    }
  };

  const {mutate, isLoading: isPosting} = api.post.create.useMutation({
    onSuccess: async  (data)=>{
      console.log(data)
      await Promise.all(
        uploadedFiles.map(async (file) => {
          const formData = new FormData();
          formData.append("id", String(data?.id));
          formData.append("file", file);
          const response = await fetch("/api/upload/post", {
            method: "POST",
            body: formData,
          });
        })
      );

      setCaption("");
      setLocation("");
      FILES = {}
      setUploadedFiles([])
      void ctx.post.getByUser.invalidate();  //add refresh if necessary
    },
    onError: (e) =>{
      const errorMessage =e.data?.zodError?.fieldErrors.content;
      if(errorMessage && errorMessage[0]){
        toast.error(errorMessage[0]);
      }else{
        toast.error("Failed to post!");
      }
    }
  });
  
  const handleDeleteImage = (fileIndex: number) => {
    // Create a copy of the uploadedFiles array
    const updatedFiles = [...uploadedFiles];
    // Remove the file at the specified index
    updatedFiles.splice(fileIndex, 1);
    // Update the state with the new array
    setUploadedFiles(updatedFiles);
  };

  const handlePostButtonClick = async () => {
      // Trigger the post mutation 
      mutate({ caption, location});
  };
  

  if(!user) return null;
  return (
    <div className = "bg-white rounded-lg mb-4 p-6 flex flex-col">
      <div className ="flex w-full gap-1 flex-col">
        
      <h1 className="font-bold text-lg text-[#fc571a]">Create Post</h1>
      

      <input 
          placeholder="Location" 
          className="block p-2.5 w-full text-sm bg-transparent rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          onKeyDown={(e)=>{
            if(e.key === "Enter"){
              e.preventDefault();
              if(caption !=="" && location !==""){
                handlePostButtonClick;
              }
            }
          }}
          disabled={isPosting}
        />

        <textarea 
          id="message" 
          className="block p-2.5 w-full text-sm bg-transparent rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" 
          placeholder="Tasting something?"
          name="content"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          onKeyDown={(e)=>{
            if(e.key === "Enter"){
              e.preventDefault();
              if(caption !=="" && location !==""){
                handlePostButtonClick;
              }
            }
          }}
          disabled={isPosting}
          />
          <div id="images-preview-container" className="flex flex-wrap">
          {uploadedFiles.map((file, index) => (
            <div key={index} className="w-1/2">
            <ImageUploadPreview file={file} onDelete={() => handleDeleteImage(index)} />
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center w-full">
      <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-20 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer">
        <div className="flex flex-col items-center justify-center pt-5 pb-5">
        <div className="text-gray">
        <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512"><path d="M160 80H512c8.8 0 16 7.2 16 16V320c0 8.8-7.2 16-16 16H490.8L388.1 178.9c-4.4-6.8-12-10.9-20.1-10.9s-15.7 4.1-20.1 10.9l-52.2 79.8-12.4-16.9c-4.5-6.2-11.7-9.8-19.4-9.8s-14.8 3.6-19.4 9.8L175.6 336H160c-8.8 0-16-7.2-16-16V96c0-8.8 7.2-16 16-16zM96 96V320c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H160c-35.3 0-64 28.7-64 64zM48 120c0-13.3-10.7-24-24-24S0 106.7 0 120V344c0 75.1 60.9 136 136 136H456c13.3 0 24-10.7 24-24s-10.7-24-24-24H136c-48.6 0-88-39.4-88-88V120zm208 24a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"/></svg>
        </div>

          <p className="m-2 text-sm text-gray-500"><span className="font-semibold">Add Photos</span> </p>
        </div>
        <input id="dropzone-file" type="file" onChange={reqAddImages} className="cursor-pointer z-20 opacity-0 w-12 h-5 rounded-lg absolute" name="coverPhoto" accept="image/*" multiple />
      </label>
    </div>


        

        <div className="mt-2">
          <label htmlFor="flavors" className="pl-2 text-sm text-stone-500">Flavors</label><br></br>
          <FlavorProfileSelector flavors={wholeListOfFlavors} flavorStates={flavorStates} setFlavorStates={setFlavorStates} className="pl-2 ml-1"/>
        </div>

        {caption !=="" && location !=="" && uploadedFiles.length > 0 && !isPosting && (
          <button 
          onClick={handlePostButtonClick}
          className="primaryButton hover:bg-green-300 text-white font-bold p-1 rounded-lg"
          >
            Post
          </button>)}
        {isPosting && (
          <div className="flex justify-center item-center">
            <LoadingSpinner size={20}/>
          </div>
        )}
      </div>
    </div>
  );
};


export function CreatePost() {
  return CreatePostWizard();
}
