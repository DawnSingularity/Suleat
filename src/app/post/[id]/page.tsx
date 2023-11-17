
"use client";
import { api } from "~/trpc/react";
import { PostView } from "~/app/_components/postview";
import { LoadingPage } from "~/app/_components/loading";
import { Navbar } from "~/app/_components/common/navbar"

export default function Post({ params }: { params: { id: string } }) {
  const { data, isLoading } = api.post.getPostById.useQuery({ id: params.id });

  if(isLoading || !data) return <LoadingPage/>;
  return (
      <>
        <Navbar />
        
        <div className="flex items-center justify-center">
          <div className="md:w-4/12 order-3 md:order-2 mt-6 md:mt-1">
            <div><PostView {...data}/></div>
          </div>
        </div>

      </>
    );

}
  