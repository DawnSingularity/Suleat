"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { api } from "~/trpc/server";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faPlusCircle  } from "@fortawesome/free-solid-svg-icons";

import Link from 'next/link';

import { User } from "@prisma/client";

export default function UserList({ follower }: { follower: User }) {

  return (
    <div className="flex flex-row w-full gap-5">
        <div className="w-12">
          <img className="rounded-full h-12 w-12" src="https://picsum.photos/100/100" alt="" />
        </div>
        <div className="w-44 flex-col flex">
          <Link href={`/${follower.userName}`}>
            <p className="text-base font-extrabold">{follower.firstName} {follower.lastName}</p>
          </Link>
          <p className="text-sm font-font-medium color-gray">@{follower.userName}</p>
        </div>
        <div className="w-12">
            <button className="hover:bg-blue-700 bg-blue-600 px-4 py-1 rounded-lg text-xs text-white"> 
            {false /*follower.isFollowing*/ ? "Unfollow" : "Follow"}
            </button>
        </div>
    </div>
  );
}

