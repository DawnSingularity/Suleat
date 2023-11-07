"use client";

import suleatIcon from "~/../public/suleat-icon.png"
import Image from "next/image"
import { useAuth } from "@clerk/nextjs";
import { UserButton, useUser } from "@clerk/clerk-react";
import { api } from "~/trpc/react";

import { PostComponent } from "../common/post_v1"

  
export function ProfilePosts({ username } : { username: string }) {
    const postQuery = api.post.getByUser.useQuery({username})
    return (
      <>
        { postQuery.data?.map((post) => <PostComponent post={post} />) }
      </>
    );

  
}
 
 
 
 
