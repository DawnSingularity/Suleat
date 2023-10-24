import Head from "next/head";
import { api } from "~/trpc/server";
import styles from './profile.module.css';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faPlusCircle  } from "@fortawesome/free-solid-svg-icons";

import UserProfileComponent from "~/app/_components/profile/profile"

export default async function Profile() {
  const data = await api.profile.getUserProfile.query();

  return (
    <main>
      <UserProfileComponent data={data}/>
    </main>
  );
}