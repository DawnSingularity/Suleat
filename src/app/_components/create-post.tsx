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
          
        <div className="cursor-pointer w-full flex group">
          <input onChange={reqAddImages} className="cursor-pointer z-20 opacity-0 w-12 h-5 rounded-lg absolute" id="coverPhoto" type="file" name="coverPhoto" accept="image/*" multiple/>
          <FontAwesomeIcon icon={faImages} style={{ color: "--var(suleat)" }} className="suleat" />
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
