"use client";
import { api } from "~/trpc/react";

import UserProfileComponent from "~/app/_components/profile/profile"

export default function Profile({ params }: { params: { username: string } }) {
  const data = api.profile.getUserProfile.useQuery({username: params.username}).data;
  const followers = api.profile.getFollowers.useQuery({username: params.username}).data;
  const following = api.profile.getFollowing.useQuery({username: params.username}).data;

  if(data != null) {
    return (
      <main>
        <UserProfileComponent data={data} followers={followers} following={following}/>
      </main>
    );
  }

}