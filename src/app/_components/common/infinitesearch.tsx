"use client";

import { api } from "~/trpc/react";
import { useInView } from "react-intersection-observer";
import { getQueryKey } from "@trpc/react-query";
import { Fragment, useEffect } from "react";
import { PostComponent } from "./post_v1";
import { useSearchParams } from 'next/navigation'
import { LoadingSpinner } from "../loading";

export function InfiniteSearch() {
    const searchParams = useSearchParams()
    const searchKey = searchParams.get('search')
    const loadingScreen = (<div className="h-full flex items-center justify-center"><LoadingSpinner size={20}/></div>)

    const { ref: scrollMonitorRef, inView: scrollMonitorInView } = useInView()
    console.log("Search Key: " + searchKey)
    var key = ""
    if(searchKey !== null) {
        key = searchKey
    }

    let receivedCount = 0
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
                    return receivedCount
                } else {
                    // no more pages, tell tanstack by returning undefined
                    console.log("Last post reached")
                    return undefined;
                }
            } else {
                 // no pages yet, get first page by sending 0
                 return 0;
            }
          },
        }
      )

    for(const page of infiniteQuery.data?.pages ?? []) {
        receivedCount += page.length
    }

    console.log("Obtained Data: " + infiniteQuery)
    useEffect(() => {
        if(scrollMonitorInView && infiniteQuery.hasNextPage) {
            infiniteQuery.fetchNextPage()
        }
    })

    // remove possible duplicate posts
    // note: there might be a better way for this
    const renderedPosts = new Set()
    const posts = infiniteQuery.data?.pages.map((page, index) => (
    <Fragment key={index}>
        {page.map((post) => {
            if (!renderedPosts.has(post.id)) {
                renderedPosts.add(post.id)
                return <PostComponent post={post} />
            } else {
                // do nothing
                return <></>
            }
        })}
    </Fragment>
  ))

  return (<div>
    {
        infiniteQuery.isSuccess ? (receivedCount === 0 ? <div className="text-lg">No search results found.</div> : posts) : (infiniteQuery.isLoading ? loadingScreen : (<></>))
    }
    
    <div ref={scrollMonitorRef}></div>
  </div>)
}
