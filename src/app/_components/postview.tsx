import { RouterOutputs } from "~/trpc/shared";
import { PostComponent } from "./common/post_v1";

type PostWithUser = RouterOutputs["post"]["getPostById"];
export const PostView = (props: PostWithUser) => {
    if (!props || props.comments.length === 0) {
        return <div>No comments available for this post.</div>;
    }

    return (
        <div>
        <PostComponent post={props}/>
        {props.comments.map((comment) => (
            <div key={comment.id}>
            <p>{comment.text}</p>

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
