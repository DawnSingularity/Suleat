"use client";

import { User } from "prisma/prisma-client"

export function UserIcon({ user, width, className = "", clickable = true }: { user: User, width: number | string, className?: string, clickable? : boolean }) {
    const icon = <img className={`rounded-full h-${width} w-${width} ${className}`} src={user.pfpURL} alt="" />

    if(clickable) {
        return <a href={`/profile/${user.userName}`}> { icon } </a>
    } else {
        return icon
    }
}
  
