"use client";

import { api } from "~/trpc/react";
import { RouterOutputs } from "~/trpc/shared";
import { useInView } from "react-intersection-observer";
import { getQueryKey } from "@trpc/react-query";
import { Fragment, useEffect } from "react";
import { PostComponent } from "./post_v1";
import { UserComponent } from "./user-search";
import { useSearchParams } from 'next/navigation'
import { LoadingSpinner } from "../loading";

export function InfiniteSearch({ category } : { category: string }) {
    const searchParams = useSearchParams()
    const searchKey = searchParams.get('search')
    const loadingScreen = (<div className="h-full flex items-center mt-5 justify-center"><LoadingSpinner size={40}/></div>)

    const { ref: scrollMonitorRef, inView: scrollMonitorInView } = useInView()
    console.log("Search Key: " + searchKey)
    var key = ""
    if(searchKey !== null) {
        key = searchKey
    }
    
    const getRPC = () => {
        switch(category) {
            case "users":
                return api.profile.getSearchUsers
            case "posts":
            default:
                return api.post.getSearchPosts
        }
    }

    let receivedCount = 0
    const infiniteQuery = getRPC().useInfiniteQuery(
        {
            limit: 5,
            searchKey: key
        },
        {
          staleTime: Infinity,
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

    console.log("Obtained data count: " + receivedCount)
    useEffect(() => {
        if(scrollMonitorInView && infiniteQuery.hasNextPage) {
            infiniteQuery.fetchNextPage()
        }
    })

    // remove possible duplicate posts
    // note: there might be a better way for this
    const renderedSet = new Set()
    const renderPage = (page : unknown) => {
        switch(category) {
            case "users":
                const users = page as RouterOutputs["profile"]["getSearchUsers"]
                return users.map((user) => {
                    if(!renderedSet.has(user.uuid)) {
                        renderedSet.add(user.uuid)
                        return <UserComponent user={user} />
                    } else {
                        // do nothing
                        return <></>
                    }
                })
            case "posts":
            default:
                const posts = page as RouterOutputs["post"]["getSearchPosts"]
                return posts.map((post) => {
                    if(!renderedSet.has(post.id)) {
                        renderedSet.add(post.id)
                        return <PostComponent post={post} />
                    } else {
                        // do nothing
                        return <></>
                    }
                })
        }
    }
    
    const renderedResults = infiniteQuery.data?.pages.map((page : unknown, index) => (
        <Fragment key={index}>
            { renderPage(page) }
        </Fragment>
    ))

    return (<div>
        {
            infiniteQuery.isSuccess ? (receivedCount === 0 ? <div className="text-lg">No search results found.</div> : renderedResults) : (infiniteQuery.isLoading ? loadingScreen : (<></>))
        }
        
        <div ref={scrollMonitorRef}></div>
      </div>)
}
