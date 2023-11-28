"use client";

import { api } from "~/trpc/react";
import { useInView } from "react-intersection-observer";
import { getQueryKey } from "@trpc/react-query";
import { Fragment, useEffect } from "react";
import { PostComponent } from "./post_v1";
import { LoadingSpinner } from "../loading";
import { CustomList } from "@uidotdev/usehooks";
import { RouterOutputs } from "~/trpc/shared";

export function Infinite({ extraPostsList } : { extraPostsList? : (RouterOutputs["post"]["create"])[] }) {
    const { ref: scrollMonitorRef, inView: scrollMonitorInView } = useInView()
    const loadingScreen = (<div className="h-full flex items-center mt-5 justify-center"><LoadingSpinner size={40}/></div>)

    const infiniteQuery = api.post.getPosts.useInfiniteQuery(
        {
            limit: 5,
        },
        {
          staleTime: Infinity,
          getPreviousPageParam: undefined, // not implemented
          getNextPageParam: (lastPage) => {
            if(lastPage != null) {
                if(lastPage.length > 0) {
                    const lastPost = lastPage[lastPage.length - 1]
                    return {
                        createdAt: lastPost?.createdAt,
                        id: lastPost?.id,
                    }
                } else {
                    // no more pages, tell tanstack by returning undefined
                    console.log("Last post reached")
                    return undefined;
                }
            } else {
                 // no pages yet, get first page by sending empty object to server
                 return {};
            }

          },
        },
      )

    useEffect(() => {
        if(scrollMonitorInView && infiniteQuery.hasNextPage) {
            infiniteQuery.fetchNextPage()
        }
    })

    // it sometimes says extraPostsList?.toReversed() is not a function???
    const extraPosts : (JSX.Element | undefined)[] = extraPostsList?.toReversed?.().map((post, index) => (
      post != null ? <Fragment key={-index - 1}>
          <PostComponent post={post} />
      </Fragment> : <></>
    )) ?? []

    const infinitePosts = infiniteQuery.data?.pages.map((page, index) => (
      <Fragment key={index}>
          {page.map((post) => (<PostComponent post={post} />))}
      </Fragment>
    ))

    const posts = extraPosts?.concat(infinitePosts)
    console.log(extraPostsList)

  return (<div id="timelineContainer">
    {
        infiniteQuery.isSuccess ? posts : (infiniteQuery.isLoading ? loadingScreen : (<></>))
    }
    <div ref={scrollMonitorRef}></div>
  </div>)
}
 
 
