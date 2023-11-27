"use client";

import Image from "next/image"
import { useAuth } from "@clerk/nextjs";
import { UserButton, useUser } from "@clerk/clerk-react";
import { api } from "~/trpc/react";
import { PillButton } from "./../profile/pill-button" 
import { UserIcon } from "./user-icon"
import { Flavor, Post, Prisma, User } from "prisma/prisma-client"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis, faLocationDot  } from "@fortawesome/free-solid-svg-icons";
import { faMessage, faStar } from "@fortawesome/free-regular-svg-icons";

import React, {useEffect} from 'react'
import ReactDOM from 'react-dom/client'
import EmblaCarousel from '../carousel/EmblaCarousel'
import { EmblaOptionsType } from 'embla-carousel-react'
import Link from "next/link";
import { RouterOutputs } from "~/trpc/shared";
import { useQueryClient } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";
const OPTIONS: EmblaOptionsType = {}
const SLIDE_COUNT = 5
const SLIDES = Array.from(Array(SLIDE_COUNT).keys())
  
export function PostComponent({ post }: { post: RouterOutputs["post"]["getPostById"] }) {
    if(post == null) {
        return;
    }

    const queryClient = useQueryClient()
    const auth = useAuth();
    const [isFavorited, setIsFavorited] = React.useState(false);
    const [favoriteCount, setFavoriteCount] = React.useState(post._count.favedBy);
    const { mutate } = api.post.updatePostFavorite.useMutation();
    const notifMutation = api.post.createFavNotif.useMutation();
    const postLikedId = post.id;
    const userLikerId = auth.userId ?? "";

    const loggedInUsernameQuery = api.profile.getCurrentUser.useQuery()
    const followMutation = api.profile.updateFollowState.useMutation()
    const loggedInUsername = loggedInUsernameQuery.data ?? ""
    const followers = api.profile.getFollowers.useQuery({username: post.author.userName}).data as User[];
    
    const isFollowing = followers?.some((user) => user.userName === loggedInUsername);
    const followIcon = isFollowing ? "Following" : "Follow";

    const handleFollowButton = () => {
      // TODO: Handle follow functionality here
      followMutation.mutate({username: post.author.userName, state: !isFollowing}, {
        onSuccess: () => {
          const queryKey = getQueryKey(api.profile.getFollowers, {username: post.author.userName});
          queryClient.invalidateQueries({queryKey});
        }
      })
    };

    let followButton = <></>, followText = <></>
    if(loggedInUsernameQuery.isSuccess && loggedInUsername !== post.author.userName) {
        followText = <PillButton id="reserved" text={followIcon} backgroundColor="linear-gradient(to bottom, #005cb1, #005cb1)" className="color-white text-white font-bold cursor-pointer" onChange={handleFollowButton} />
        followButton = <FontAwesomeIcon icon={faEllipsis} rotation={90} style={{color: "#000000",}}/>
    }

    useEffect(() => {
        setIsFavorited(post.favedBy.some( item => item.userLikerId === userLikerId));
    }, [post.favedBy]) 

    const handleFavoriteClick = async () => {
        try {
            const response = mutate( { postId: postLikedId, faved: !isFavorited } );
            console.log("Done mutating")
            if(!isFavorited) {
                console.log("Did it reach here?")
                
                const response = notifMutation.mutate({ postId: postLikedId })
                console.log("Successfully made notif")
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
    

    let comment_count = post._count.comments

    return (
      <>
        <div className="py-4 bg-white sm:mb-3 mb-0.5 drop-shadow-md sm:rounded-lg">  
            <div className="px-5 flex flex-row items-center justify-between mb-4">
                <div className="order-first flex flex-row items-center">
                    <Link href={`/profile/${post.author.userName}`}>
                        <UserIcon user={post.author} width="10" className="mr-3" />
                    </Link>
                    <div>
                        <Link href={`/profile/${post.author.userName}`}>
                            <div className="text-sm hover:underline font-semibold">{ post.author.firstName } { post.author.lastName }</div>
                        </Link>
                        <Link href={`/post/${post.id}`}>
                            <div className="text-xs text-red-600 hover:underline">
                                <FontAwesomeIcon icon={faLocationDot} className="mr-1  hover:text-black" style={{ color: 'red' }} />
                                { post.location }
                            </div>
                        </Link>
                    </div>
                </div>
            { auth.isSignedIn ? (
                <div className="order-last flex flex-row items-center">
                    {followText}
                    {followButton}
                </div>
            ) : (<></>)}
            </div>
            
            <Link href={`/post/${post.id}`}>
                <div className="">
                    {post.photos && post.photos.length > 0 && (
                        <EmblaCarousel photos={post.photos} options={OPTIONS} />
                    )}
                </div>
            </Link>

            <div className="px-5 ">
                <div className="text-sm mt-4">
                { post.caption }
                </div>
                <div className="mt-2 flex flex-row items-center justify-between">
                    <div className="order-first flex flex-wrap">
                        {post.flavors?.map((flavor : Flavor, index : number) => (<PillButton
                            key={index.toString()}
                            id={flavor.name} text={flavor.name} backgroundColor={flavor.color}
                            className="cursor-default"
                        />))}
                    </div>
                    <div className="order-last flex flex-row">
                        <div className="flex flex-row items-center mr-1">
                            <FontAwesomeIcon icon={faMessage} style={{color: "#000000",}} className="pr-1 pt-0.5" />
                            <span>{comment_count}</span>
                        </div>
                        <button
                            className="flex flex-row items-center"
                            onClick={handleFavoriteClick}
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
 
 
 
