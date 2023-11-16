"use client";
import { api } from "~/trpc/react";

import UserProfileComponent from "~/app/_components/profile/profile"
import { Prisma, User, Flavor } from "@prisma/client";


export default function Profile({ params }: { params: { username: string } }) {
  // convert URI-encoded string back to unicode
  params.username = decodeURIComponent(params.username);

  const data = api.profile.getUserProfile.useQuery({username: params.username}).data;
  const followers = api.profile.getFollowers.useQuery({username: params.username}).data as User[];
  const following = api.profile.getFollowing.useQuery({username: params.username}).data as User[];

  if(data != null && followers != null && following != null) {
    return (
      <main>
        <UserProfileComponent data={data} followers={followers} following={following}/>
      </main>
    );
  }

}