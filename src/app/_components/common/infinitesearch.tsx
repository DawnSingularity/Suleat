"use client";

import { api } from "~/trpc/react";
import { useInView } from "react-intersection-observer";
import { getQueryKey } from "@trpc/react-query";
import { Fragment, useEffect } from "react";
import { PostComponent } from "./post_v1";
import { useSearchParams } from 'next/navigation'

export function InfiniteSearch() {
    const searchParams = useSearchParams()
    const searchKey = searchParams.get('search')

    const { ref: scrollMonitorRef, inView: scrollMonitorInView } = useInView()
    console.log("Search Key: " + searchKey)
    var key = ""
    if(searchKey !== null) {
        key = searchKey
    }
    const infiniteQuery = api.post.getSearchPosts.useInfiniteQuery(
        {
            limit: 5,
            searchKey: key
        },
        {
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
        }
      )
    console.log("Obtained Data: " + infiniteQuery)
    useEffect(() => {
        if(scrollMonitorInView && infiniteQuery.hasNextPage) {
            infiniteQuery.fetchNextPage()
        }
    })

  return (<div>
    { infiniteQuery.data?.pages.map((page, index) => (
        <Fragment key={index}>
            {page.map((post) => (<PostComponent post={post} />))}
        </Fragment>
    )) }
    <div ref={scrollMonitorRef}></div>
  </div>)
}
 
 
