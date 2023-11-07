"use client";

import suleatIcon from "~/../public/suleat-icon.png"
import Image from "next/image"
import { useAuth } from "@clerk/nextjs";
import { UserButton, useUser } from "@clerk/clerk-react";
import { api } from "~/trpc/react";
import { PillButton } from "./../profile/pill-button" 
import { UserIcon } from "./user-icon"
import { Flavor, Post, Prisma } from "prisma/prisma-client"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis, faLocationDot  } from "@fortawesome/free-solid-svg-icons";
import { faMessage, faStar } from "@fortawesome/free-regular-svg-icons";

const postDetailed = Prisma.validator<Prisma.PostDefaultArgs>()({
    include: { 
        author: true,
        photos: true,
        flavors: true,
    },
  })
  
type PostDetailed = Prisma.PostGetPayload<typeof postDetailed>
  
export function PostComponent({ post } : { post: PostDetailed }) {
    const auth = useAuth()
    return (
      <>
        <div className="">
            <div className="flex flex-row items-center justify-between py-2">
                <div className="order-first flex flex-row items-center">
                    <UserIcon user={post.author} width="10" className="mx-2" />
                    <div>
                        <div>{ post.author.firstName } { post.author.lastName }</div>
                        <div>
                            <FontAwesomeIcon icon={faLocationDot} className="mr-1" style={{ color: 'red' }} />
                            { post.location }
                         </div>
                    </div>
                </div>
            { auth.isSignedIn ? (
                <div className="order-last flex flex-row items-center">
                    <PillButton id="reserved" text="Follow" backgroundColor="#49e66b" className="color-black" />
                    <FontAwesomeIcon icon={faEllipsis} rotation={90} style={{color: "#000000",}} />
                </div>
            ) : (<></>)}
                
            </div>
            <div className="">
                <div>
                { post.caption }
                </div>
                <div className="flex flex-row items-center justify-between">
                    <div className="order-first">
                        {post.flavors?.map((flavor : Flavor, index : number) => (<PillButton
                            key={index.toString()}
                            id={flavor.name} text={flavor.name} backgroundColor={flavor.color}
                        />))}
                    </div>
                    <div className="order-last flex flex-row">
                        <div className="flex flex-row items-center">
                            <FontAwesomeIcon icon={faMessage} style={{color: "#000000",}} className="pr-1" />
                            <span>{post.commentCount}</span>
                        </div>
                        <div className="flex flex-row items-center">
                            <FontAwesomeIcon icon={faStar} style={{color: "#000000",}} className="pr-1" />
                            <span>{post.favoriteCount}</span>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
      </>
    );

  
}
 
 
 
