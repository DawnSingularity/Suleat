
"use client";
import { api } from "~/trpc/react";
import { PostView } from "~/app/_components/postview";
import { LoadingPage } from "~/app/_components/loading";

export default function Post({ params }: { params: { id: string } }) {
  const { data, isLoading } = api.post.getPostById.useQuery({ id: params.id });

  if(!data) return <div>Something went wrong</div>; 
  if(isLoading) return <LoadingPage/>;
  return (
      <main>
        <PostView {...data}/>
      </main>
    );

}
  