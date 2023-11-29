"use client";

import { User } from "prisma/prisma-client"
import { MouseEventHandler } from 'react';
export function UserIcon({
    onClick,
    user,
    width,
    className = "",
    clickable = true
  }: {
    onClick?: MouseEventHandler<HTMLImageElement>,
    user: User,
    width: number | string,
    className?: string,
    clickable?: boolean
  }) {    const icon = <img onClick={onClick} className={`rounded-full h-${width} w-${width} ${className}`} src={user.pfpURL} alt="" />

    if(clickable) {
        return <a href={`/profile/${user.userName}`}> { icon } </a>
    } else {
        return icon
    }
}
  
