"use client";

import { api } from "~/trpc/react";
import { useInView } from "react-intersection-observer";
import { getQueryKey } from "@trpc/react-query";
import { Fragment, useEffect } from "react";
import { PostComponent } from "./post_v1";
import { UserComponent } from "./user";
import { useSearchParams } from 'next/navigation'

export function InfiniteSearchUsers() {
    const searchParams = useSearchParams()
    const searchKey = searchParams.get('search')

    const { ref: scrollMonitorRef, inView: scrollMonitorInView } = useInView()
    console.log("Search Key: " + searchKey)
    var key = ""
    if(searchKey !== null) {
        key = searchKey
    }

    let receivedCount = 0
    const infiniteQuery = api.profile.getSearchUsers.useInfiniteQuery(
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
  const renderedUsers = new Set()

  return (
    <div>
    { 
      infiniteQuery.data?.pages.map((page, index) => (
        <Fragment key={index}>
            {page.map((user) => {
                if (!renderedUsers.has(user.uuid)) {
                    renderedUsers.add(user.uuid)
                    return <UserComponent user={user} />
                } else {
                    // do nothing
                    return <></>
                }
            })}
        </Fragment>
    )) }
    <div ref={scrollMonitorRef}></div>
    </div>)
}
 
 
