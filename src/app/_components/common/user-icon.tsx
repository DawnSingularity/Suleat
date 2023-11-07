"use client";

import { User } from "prisma/prisma-client"

export function UserIcon({ user, width, className = "" }: { user: User, width: number | string, className?: string }) {
    return (
        <a href={`/profile/${user.userName}`}>
                    <img className={`rounded-full h-${width} w-${width} ${className}`} src={user.pfpURL} alt="" />
        </a>
    )
}
  
