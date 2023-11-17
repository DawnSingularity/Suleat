import { RouterOutputs } from "~/trpc/shared";
import { PostComponent } from "./common/post_v1";
import { SetStateAction, useState } from 'react';

type PostWithUser = RouterOutputs["post"]["getPostById"];
export const PostView = (props: PostWithUser) => {
    if (!props || props.comments.length === 0) {
        return <div>No comments available for this post.</div>;
    }

    // TODO: move to new file maybe (subcomments)
    const [textareaValue, setTextareaValue] = useState('');
    const [parentCommentId, setParentCommentId] = useState('');

    const onChange = (e: { target: { value: SetStateAction<string>; }; }) => {
        setTextareaValue(e.target.value)
    }

    const handleReply = (parentCommentId : String) => {
        // TODO: use router to update db
        if (textareaValue != "") {
            console.log(textareaValue)
            console.log(parentCommentId);
        } else {
            console.log("empty");
        }
    }

    // end of TODO

    return (
        <div>
        <PostComponent post={props}/>
        {props.comments.map((comment) => (
            <div key={comment.id}>
            <p>{comment.text}</p>
            <textarea
                name="comment-text"
                id="comment-text"
                value={textareaValue}
                onChange={onChange}
            />
            <button
                className="bg-white border-2"
                onMouseDown={ (e) => {
                    handleReply(comment.id)
                }}
                disabled={textareaValue.trim() === ""}
                >comment</button>

            {/* Render subcomments if available */}
            {comment.subcomments && comment.subcomments.length > 0 && (
                <div>
                <p>Subcomments:</p>
                {comment.subcomments.map((subcomment) => (
                    <p key={subcomment.id}>{subcomment.text}</p>
                ))}
                </div>
            )}
            </div>
        ))}
        </div>
    );
};
