"use client";

import { useUser } from "@clerk/clerk-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

import { api } from "~/trpc/react";
import { LoadingSpinner } from "./loading";
const CreatePostWizard = () =>{
  const user = useUser();
  const [location, setLocation] = useState("");
  const [caption, setCaption] = useState("");
  const ctx = api.useUtils();
  const {mutate, isLoading: isPosting} = api.post.create.useMutation({
    onSuccess: ()=>{
      setCaption("");
      setLocation("");
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

  if(!user) return null;
  return (
    <div className = "border-b border-slate-400 p-8 flex flex-col">
      <div className ="flex w-full gap-3 flex-col">
        <input 
          placeholder="Location" 
          className="bg-transparent grow outline-none"
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          onKeyDown={(e)=>{
            if(e.key === "Enter"){
              e.preventDefault();
              if(caption !=="" && location !==""){
                mutate({caption,location});
              }
            }
          }}
          disabled={isPosting}
        />
        <textarea 
          id="message" 
          className="block p-2.5 w-full text-sm bg-transparent rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" 
          placeholder="Content"
          name="content"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          onKeyDown={(e)=>{
            if(e.key === "Enter"){
              e.preventDefault();
              if(caption !=="" && location !==""){
                mutate({caption,location});
              }
            }
          }}
          disabled={isPosting}
          />
        {caption !=="" && location !=="" && !isPosting && (
          <button 
          onClick={() => mutate({caption, location})} 
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
