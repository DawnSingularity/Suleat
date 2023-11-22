
"use client";
import { api } from "~/trpc/react";
import { LoadingPage } from "~/app/_components/loading";
import { Navbar } from "~/app/_components/common/navbar"
import { InfiniteComment } from "~/app/_components/common/infiniteComment";


import { useInView } from "react-intersection-observer";
import { getQueryKey } from "@trpc/react-query";
import { Fragment, SetStateAction, useEffect, useState } from "react";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
import { UserIcon } from "~/app/_components/common/user-icon";
import { PostComponent } from "~/app/_components/common/post_v1";
import toast from "react-hot-toast";
import { useUser } from "@clerk/clerk-react";
dayjs.extend(relativeTime);

export default function Post({ params }: { params: { id: string } }) {
  const ctx = api.useUtils();
  const { data, isLoading } = api.post.getPostById.useQuery({id:params.id});
  const { ref: scrollMonitorRef, inView: scrollMonitorInView } = useInView()
  const selfUserQuery = api.profile.getUserProfile.useQuery({})
  const [openCommentId, setOpenCommentId] = useState<string | null>(null);
  const [isReplyOpen, setReplyOpen] = useState(false);

  const toggleReplyButton = (commentId: string) => {
    setReplyOpen(!isReplyOpen);
    setOpenCommentId(commentId);
  };
    const infiniteQuery = api.comment.getCommentByPostId.useInfiniteQuery(
        {
            limit: 5,
            postId: params.id
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

    //creating subcomment
     const [SubCommentValue, setSubCommentValue] = useState<{ [key: string]: string }>({});
     const { mutate: mutateSubComment } = api.comment.createSub.useMutation({
         onSuccess: () => {
             setSubCommentValue({});
             void ctx.comment.getCommentByPostId.invalidate();
         },
         onError: (e) => {
          const errorMessage = e.data?.zodError?.fieldErrors.content;
          if (errorMessage && errorMessage[0]) {
            toast.error(errorMessage[0]);
          } else {
            toast.error("Failed to post!");
          }
        },
     })

     //creating comment
     const [CommentValue, setCommentValue] = useState('');
     const { mutate: mutateComment } = api.comment.create.useMutation({
      onSuccess: () => {
          setCommentValue("");
          void ctx.comment.getCommentByPostId.invalidate();
      },
      onError: (e) => {
       const errorMessage = e.data?.zodError?.fieldErrors.content;
       if (errorMessage && errorMessage[0]) {
         toast.error(errorMessage[0]);
       } else {
         toast.error("Failed to post!");
       }
     },
  })

    if(isLoading || !data) return <LoadingPage/>;
  return (
    <>
    <Navbar />
    <div className="max-w-2xl mx-auto  my-4 rounded-lg">
      
      <PostComponent post={data} />

      <div className="flex items-start">
          <div className="mr-4">
            {(selfUserQuery.data !== null) && <img className={`rounded-full h-${10} w-${10}`} src={selfUserQuery.data?.pfpURL} alt="" />}
          </div>
          <div className="w-full flex items-center mt-2">
            <textarea
              name="comment-text"
              id="comment-text"
              value={CommentValue}
              onChange={(e)=>setCommentValue(e.target.value)}
              className="w-full border-none resize-none bg-transparent outline-none"
              placeholder="post..."
              onKeyDown = {(e) =>{
                  if(e.key === "Enter"){
                  e.preventDefault();
                  if(CommentValue !== ""){
                    mutateComment({text: CommentValue, postId: params.id})
                  }
                  }
              }}
              />
            <button
                className={`ml-2 px-4 py-2 rounded-md ${
                    CommentValue.trim() === ""
                    ? "text-sky-700 cursor-not-allowed"
                    : "text-sky-500 hover:text-sky-500"
                }`}
                onMouseDown={(e) => {
                  mutateComment({text: CommentValue, postId: params.id})
                }}
                disabled={CommentValue.trim() === ""}
                >
                Post
              </button>
          </div>
      </div>
    { infiniteQuery.data?.pages.map((page, index) => (
        <Fragment key={index}>
            {page.map((comment) => (
                <div key={comment.id} className="mb-8">
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
                        value={SubCommentValue[comment.id] || ''}
                        onChange={(e) => {
                          const newValue = e.target.value;
                          setSubCommentValue((prevValues) => ({
                            ...prevValues,
                            [comment.id]: newValue,
                          }));
                        }}
                        className="w-full border-none resize-none bg-transparent outline-none"
                        placeholder="reply..."
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            const textValue = SubCommentValue[comment.id] || ''; // Use empty string if undefined
                            if (textValue !== "") {
                              mutateSubComment({ postId: params.id ,text: textValue, parentId: comment.id });
                            }
                          }
                        }}
                      />
                      <button
                        className={`ml-2 px-4 py-2 rounded-md ${
                            (SubCommentValue[comment.id] || '').trim() === ""
                            ? "text-sky-700 cursor-not-allowed"
                            : "text-sky-500 hover:text-sky-500"
                        }`}
                        onMouseDown={(e) => {
                          const textValue = SubCommentValue[comment.id] || ''; // Use empty string if undefined
                          mutateSubComment({postId: params.id, text: textValue, parentId: comment.id });
                        }}
                        disabled={(SubCommentValue[comment.id] || '').trim() === ""}
                      >
                        Post
                      </button>
                    </div>

            
                    {/* Render subcomments if available */}
                    {comment.subcomments && comment.subcomments.length > 0 && (
                      <div className="mb-6">
                        <button
                          className="text-gray-400 ml-16 text-sm"
                          onClick={() => toggleReplyButton(comment.id)}
                          hidden={!isReplyOpen || openCommentId !== comment.id}
                        >
                          ----- hide reply
                        </button>
                        <button
                          className="text-gray-400 ml-16 text-sm"
                          onClick={() => toggleReplyButton(comment.id)}
                          hidden={isReplyOpen && openCommentId === comment.id}
                        >
                          ----- view reply
                        </button>
                      </div>
                    )}

                    {isReplyOpen && openCommentId === comment.id && comment.subcomments && comment.subcomments.length > 0 && (
                      <div className="ml-10">
                        {comment.subcomments.map((subcomment) => (
                          <div key={subcomment.id} className="flex items-start ml-4 mb-5">
                            <div className="mr-4">
                              <UserIcon user={subcomment.author} width="10" />
                            </div>
                            <div className="flex flex-col">
                              <p className="text-gray-700">{subcomment.text}</p>
                              <p className="mt-1 text-gray-400 text-sm ">{dayjs(subcomment.createdAt).fromNow()}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
            </div>
          ))}
        </Fragment>
    )) }
    {infiniteQuery.hasNextPage && (
        <div className="flex justify-center my-4">
          <button
            onClick={() => infiniteQuery.fetchNextPage()}
            className="text-gray-500 ml-16 text-sm"
          >
            Load More
          </button>
        </div>
      )}
  </div>
  </>
    );

}
  