import { RouterOutputs } from "~/trpc/shared";
import { PostComponent } from "./common/post_v1";
import { SetStateAction, useState } from 'react';
import { api } from "~/trpc/react";
import { UserIcon } from "./common/user-icon";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
dayjs.extend(relativeTime);

type PostWithUser = RouterOutputs["post"]["getPostById"];
export const PostView = (props: PostWithUser) => {

    //check if there is a post
    if (!props) {
        return <div>Post not Available</div>;
    }



    // TODO: move to new file maybe (subcomments)
    const ctx = api.useUtils();
    const [textareaValue, setTextareaValue] = useState('');
    const [parentCommentId, setParentCommentId] = useState('');

    const onChange = (e: { target: { value: SetStateAction<string>; }; }) => {
        setTextareaValue(e.target.value)
    }
    const { mutate } = api.comment.createSub.useMutation({
        onSuccess: () => {
            console.log('yes')
            // TODO: refresh comments
            //should be done
            setTextareaValue("");
            void ctx.post.getPostById.invalidate();
        }
    })
    const handleReply = async (parentCommentId : string) => {
        mutate({ text: textareaValue, parentId: parentCommentId})
    }
    // end of TODO


    
    return (
        <div className="max-w-2xl mx-auto  my-4 rounded-lg">
          <PostComponent post={props} />
    
          {/* Render Comments */}
          {props.comments.map((comment) => (
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
        </div>
      );
};
