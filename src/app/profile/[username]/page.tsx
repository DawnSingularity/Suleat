import Head from "next/head";
import { api } from "~/trpc/server";
import styles from './profile.module.css';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faPlusCircle  } from "@fortawesome/free-solid-svg-icons";

import UserProfileComponent from "~/app/_components/profile/profile"

export default async function Profile({ params }: { params: { username: string } }) {
  const data = await api.profile.getUserProfile.query({username: params.username});
  const followers =  await api.profile.getFollowers.query();
  const following = await api.profile.getFollowing.query();

  if(data != null) {
    return (
      <main>
        <UserProfileComponent data={data} followers={followers} following={following}/>
      </main>
    );
  }

}