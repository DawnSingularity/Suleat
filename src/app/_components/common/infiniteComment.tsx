"use client";

import { api } from "~/trpc/react";
import { useInView } from "react-intersection-observer";
import { getQueryKey } from "@trpc/react-query";
import { Fragment, SetStateAction, useEffect, useState } from "react";
import { PostComponent } from "./post_v1";
import { UserIcon } from "./user-icon";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
dayjs.extend(relativeTime);


export function InfiniteComment(postId : string) {
    const { ref: scrollMonitorRef, inView: scrollMonitorInView } = useInView()

    const infiniteQuery = api.comment.getCommentByPostId.useInfiniteQuery(
        {
            limit: 5,
            postId: postId
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
                    console.log("Last comment reached")
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


     // TODO: move to new file maybe (subcomments)
     const ctx = api.useUtils();
     const [textareaValue, setTextareaValue] = useState('');
     const [parentCommentId, setParentCommentId] = useState('');
 
     const onChange = (e: { target: { value: SetStateAction<string>; }; }) => {
         setTextareaValue(e.target.value)
     }
     const { mutate } = api.comment.createSub.useMutation({
         onSuccess: () => {
             setTextareaValue("");
             void ctx.post.getPostById.invalidate();
         }
     })
     const handleReply = async (parentCommentId : string) => {
         mutate({ text: textareaValue, parentId: parentCommentId})
     }
  return (<div>
    { infiniteQuery.data?.pages.map((page, index) => (
        <Fragment key={index}>
            {page.map((comment) => (
                <div key={comment.id}>
                    <div className="flex items-start">
                        <div className="mr-4">
                            <UserIcon user={comment.author} width="10" />
                        </div>
                        <div className="flex flex-col">
                            <p className="text-gray-700">{comment.text}</p>
                            <p className="mt-1 text-sm text-gray-400">{dayjs(comment.createdAt).fromNow()}</p>
                        </div>
                    </div>
        
                    
                    <div className="flex items-center mt-2 ml-16">
                    <textarea
                        name="comment-text"
                        id="comment-text"
                        value={textareaValue}
                        onChange={onChange}
                        className="w-full border-none resize-none bg-transparent outline-none"
                        placeholder="reply..."
                        onKeyDown = {(e) =>{
                            if(e.key === "Enter"){
                            e.preventDefault();
                            if(textareaValue !== ""){
                                handleReply(comment.id);
                            }
                            }
                        }}
                        />
                        <button
                            className={`ml-2 px-4 py-2 rounded-md ${
                                textareaValue.trim() === ""
                                ? "text-sky-700 cursor-not-allowed"
                                : "text-sky-500 hover:text-sky-500"
                            }`}
                            onMouseDown={(e) => {
                                handleReply(comment.id);
                            }}
                            disabled={textareaValue.trim() === ""}
                            >
                            Post
                        </button>
        
                    </div>
            
                    {/* Render subcomments if available */}
                    {comment.subcomments && comment.subcomments.length > 0 && (
                        <div className="ml-10">
                            {comment.subcomments.map((subcomment) => (
                            <div key={subcomment.id} className="flex items-start ml-4 mb-5">
                                <div className="mr-4">
                                <UserIcon user={subcomment.author} width="10" />
                                </div>
                                <div className="flex flex-col">
                                <p className="text-gray-700">
                                    {subcomment.text}
                                </p>
                                <p className="mt-1 text-gray-400 text-sm ">
                                    {dayjs(subcomment.createdAt).fromNow()}
                                </p>
                                </div>
                            </div>
                            ))}
                        </div>
                    )}
                    </div>
            ))}
        </Fragment>
    )) }
    <div ref={scrollMonitorRef}></div>
  </div>)
}
 
 
