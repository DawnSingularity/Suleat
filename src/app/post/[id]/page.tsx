
"use client";
import { api } from "~/trpc/react";
import { LoadingPage } from "~/app/_components/loading";
import { Navbar } from "~/app/_components/common/navbar"
// import { InfiniteComment } from "~/app/_components/common/infiniteComment";


import { useInView } from "react-intersection-observer";
import { getQueryKey } from "@trpc/react-query";
import { Fragment, SetStateAction, useEffect, useState, useRef } from "react";
import useAutosizeTextArea from "~/app/_components/common/useAutosizeTextArea";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
import { UserIcon } from "~/app/_components/common/user-icon";
import { PostPageComponent } from "~/app/_components/common/post_v3";
import toast from "react-hot-toast";
import { useUser } from "@clerk/clerk-react";
import { comment } from "postcss";
import Link from "next/link"
dayjs.extend(relativeTime);

export default function Post({ params }: { params: { id: string } }) {
  const ctx = api.useUtils();
  const { data, isLoading } = api.post.getPostById.useQuery({id:params.id});
  const { ref: scrollMonitorRef, inView: scrollMonitorInView } = useInView()
  const selfUserQuery = api.profile.getUserProfile.useQuery({})
  const [openCommentId, setOpenCommentId] = useState<string | null>(null);
  const [isReplyOpen, setReplyOpen] = useState(false);
  // const loadingScreen = (<div className="h-full flex items-center justify-center"><LoadingSpinner size={40}/></div>)

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

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useAutosizeTextArea(textAreaRef.current, CommentValue);

  const handleChange = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = evt.target?.value;

    setCommentValue(val);
  };

  if(isLoading || !data) return <LoadingPage size={60}/>;
  return (
    <>
    <Navbar />
    <div className="max-w-2xl mx-auto sm:my-4 sm:rounded-lg">
      
      <PostPageComponent post={data} />

      <div className="bg-white drop-shadow-md sm:rounded-b-lg px-5 pb-4">
        <div className="flex items-start pb-4">
          {(selfUserQuery.data !== null) && <Link href={`/profile/${selfUserQuery.data?.userName}`}><img className={`rounded-full h-${10} w-${10} mr-2`} src={selfUserQuery.data?.pfpURL} alt="" /></Link>}
          <div className="w-full flex items-center my-auto">
            <textarea
              name="comment-text"
              id="comment-text"
              value={CommentValue}
              ref={textAreaRef}
              onChange={handleChange}
              className="w-full resize-none my-auto bg-transparent outline-none border p-2 text-sm rounded-md overflow-hidden"
              placeholder="Write a comment..."
              onKeyDown = {(e) =>{
                if(e.key === "Enter" && !e.shiftKey){
                  e.preventDefault();
                  if(CommentValue !== ""){
                    mutateComment({text: CommentValue, postId: params.id})
                  }
                }
              }}
            />
            <button
              className={`ml-3 self-end ${
                CommentValue.trim() === ""
                  ? "text-gray-300 cursor-not-allowed"
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
              <div key={comment.id} className="">
                <div className="flex items-start  py-2">
                  <div className="mr-2 w-11">
                    <Link href={`/profile/${comment.author.userName}`}>
                      <UserIcon user={comment.author} width="10" />
                    </Link>
                  </div>
                  <div className="flex flex-col border rounded-lg w-full p-2">
                    <Link href={`/profile/${comment.author.userName}`}>
                      <div className="hover:underline text-sm font-semibold break-all">{comment.author.firstName}&nbsp;{comment.author.lastName}</div>
                    </Link>
                    <p className="text-[12px] text-gray-400">{dayjs(comment.createdAt).fromNow()}</p>
                    <p className="text-gray-700 text-[13px] mt-2 break-all">{comment.text}</p>
                  </div>
                </div>

                {/* Render subcomments if available */}
                {comment.subcomments && comment.subcomments.length > 0 && (
                  <div className="mt-1 mb-3">
                    <button
                      className="text-sky-500 ml-12 text-sm hover:underline"
                      onClick={() => toggleReplyButton(comment.id)}
                      hidden={!isReplyOpen || openCommentId !== comment.id}
                    >
                      Hide Replies
                    </button>
                    <button
                      className="text-sky-500 ml-12 text-sm hover:underline"
                      onClick={() => toggleReplyButton(comment.id)}
                      hidden={isReplyOpen && openCommentId === comment.id}
                    >
                      View Replies
                    </button>
                  </div>
                )}

                {isReplyOpen && openCommentId === comment.id && comment.subcomments && comment.subcomments.length > 0 && (
                  <div className="ml-12">
                    {comment.subcomments.map((subcomment) => (
                      <div key={subcomment.id} className="flex items-start mb-2">
                        <div className="mr-4">
                          <Link href={`/profile/${subcomment.author.userName}`}>
                            <UserIcon user={subcomment.author} width="8" />
                          </Link>
                        </div>
                        <div className="flex flex-col border rounded-lg w-full p-2">
                          <Link href={`/profile/${subcomment.author.userName}`}>
                            <p className="text-sm font-semibold">{subcomment.author.firstName}&nbsp;{subcomment.author.lastName}</p>
                          </Link>
                          <p className="text-[12px] text-gray-400">{dayjs(subcomment.createdAt).fromNow()}</p>
                          <p className="text-gray-700 text-[13px] mt-2 break-all">{subcomment.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                      
                <div className="flex ml-12">
                  <div className="mr-2 w-11">
                    {(selfUserQuery.data !== null) && <Link href={`/profile/${selfUserQuery.data?.userName}`}><img className={`rounded-full h-${8} w-${8} mr-4`} src={selfUserQuery.data?.pfpURL} alt="" /></Link>}
                  </div>
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
                    rows="1"
                    className="w-full resize-none my-auto bg-transparent outline-none border p-2 text-sm rounded-md overflow-hidden"
                    placeholder="Reply to comment..."
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        const textValue = SubCommentValue[comment.id] || ''; // Use empty string if undefined
                        if (textValue !== "") {
                          mutateSubComment({ postId: params.id ,text: textValue, parentId: comment.id });
                        }
                      }
                    }}
                  />
                  <button
                    className={`ml-3 self-end text-sm ${
                      (SubCommentValue[comment.id] || '').trim() === ""
                      ? "text-gray-300 cursor-not-allowed"
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
              </div>
            ))}
          </Fragment>
        )) }

        {infiniteQuery.hasNextPage && (
          <div className="flex mt-4">
            <button
              onClick={() => infiniteQuery.fetchNextPage()}
              className="text-sky-500 text-sm"
            >
              View More Comments...
            </button>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
  