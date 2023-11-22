"use client";

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

import React from 'react'
import ReactDOM from 'react-dom/client'
import EmblaCarousel from '../carousel/EmblaCarousel'
import { EmblaOptionsType } from 'embla-carousel-react'
import Link from "next/link";
import { RouterOutputs } from "~/trpc/shared";
import { faveRouter } from '~/server/api/routers/fave';
import { unfaveRouter } from '~/server/api/routers/unfave';
const OPTIONS: EmblaOptionsType = {}
const SLIDE_COUNT = 5
const SLIDES = Array.from(Array(SLIDE_COUNT).keys())
  
export function PostComponent({ post }: { post: RouterOutputs["post"]["getPostById"] }) {
    if(post == null) {
        return;
    }

    const auth = useAuth();
    const [isFavorited, setIsFavorited] = React.useState(false);
    const [favoriteCount, setFavoriteCount] = React.useState(post.favoriteCount);
    /*
    const handleFavoriteClick = async () => {
        try {

          if (isFavorited) {
            // Unfavorite 
            const response = await unfaveRouter.unfavePost({ postId: post.id });

          } else {
            // Favorite 
            const response = await faveRouter.favePost({ postId: post.id });
          }
        } catch (error) {
          console.error('Error fave-ing:', error);
        }
    
        // Update UI 
        if (isFavorited) {
          setFavoriteCount((prevCount) => prevCount - 1);
        } else {
          setFavoriteCount((prevCount) => prevCount + 1);
        }
        setIsFavorited((prev) => !prev);
      };
    */

    let comment_count = post._count.comments

    return (
      <>
        <div className="py-4 bg-white sm:mb-4 mb-0.5 drop-shadow-md sm:rounded-lg rounded">
            <Link href={`/post/${post.id}`}>
                <div className="px-5 flex flex-row items-center justify-between mb-4">
                    <div className="order-first flex flex-row items-center">
                        <UserIcon user={post.author} width="10" className="mr-3" />
                        <div>
                            <div className="text-sm">{ post.author.firstName } { post.author.lastName }</div>
                            <div className="text-xs text-red-600">
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
            </Link>
            
            <div className="">
                {post.photos && post.photos.length > 0 && (
                    <EmblaCarousel photos={post.photos} options={OPTIONS} />
                )}
            </div>

            <div className="px-5 ">
                <div className="text-sm mt-4">
                { post.caption }
                </div>
                <div className="mt-2 flex flex-row items-center justify-between">
                    <div className="order-first">
                        {post.flavors?.map((flavor : Flavor, index : number) => (<PillButton
                            key={index.toString()}
                            id={flavor.name} text={flavor.name} backgroundColor={flavor.color}
                        />))}
                    </div>
                    <div className="order-last flex flex-row">
                        <div className="flex flex-row items-center mr-1">
                            <FontAwesomeIcon icon={faMessage} style={{color: "#000000",}} className="pr-1 pt-0.5" />
                            <span>{comment_count}</span>
                        </div>
                        <button
                            className="flex flex-row items-center"
                          
                            style={{ color: isFavorited ? '#ff7f50' : '#000000' }}
                        >
                            <FontAwesomeIcon icon={faStar} className="pr-1" />
                            <span>{favoriteCount}</span>
                         </button>
                    </div>
                </div>
            </div>    
        </div>   
      </>
    );

  
}
 
 
 
