import { api } from "~/trpc/server";

import UserProfileComponent from "~/app/_components/profile/profile"

export default async function Profile({ params }: { params: { username: string } }) {
  const data = await api.profile.getUserProfile.query({username: params.username});
  const followers =  await api.profile.getFollowers.query({username: params.username});
  const following = await api.profile.getFollowing.query({username: params.username});

  if(data != null) {
    return (
      <main>
        <UserProfileComponent data={data} followers={followers} following={following}/>
      </main>
    );
  }

}