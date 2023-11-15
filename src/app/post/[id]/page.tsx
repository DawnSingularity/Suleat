
"use client";
import { api } from "~/trpc/react";
import { PostView } from "~/app/_components/postview";
import { LoadingPage } from "~/app/_components/loading";
import { Navbar } from "~/app/_components/common/navbar"

export default function Post({ params }: { params: { id: string } }) {
  const { data, isLoading } = api.post.getPostById.useQuery({ id: params.id });

  if(!data) return <div className="mx-auto">Something went wrong</div>; 
  if(isLoading) return <LoadingPage/>;
  return (
      <main>
        <Navbar />
        <PostView {...data}/>
      </main>
    );

}
  