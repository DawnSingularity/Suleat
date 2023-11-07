"use client";

import { User } from "prisma/prisma-client"

export function UserIcon({ user, width }: { user: User, width: number | string }) {
    return (
        <a href={`/profile/${user.userName}`}>
                    <img className={`rounded-full h-${width} w-${width}`} src={user.pfpURL} alt="" />
        </a>
    )
}
  
