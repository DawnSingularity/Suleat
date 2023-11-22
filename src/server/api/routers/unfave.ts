import { z } from "zod";
import { createTRPCRouter, userProcedure } from "~/server/api/trpc";

export const unfaveRouter = createTRPCRouter({
  unfavePost: userProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.db.post.findUnique({
        where: { id: input.postId },
      });

      const updatedPost = await ctx.db.post.update({
        where: { id: input.postId },
        data: { favoriteCount: { decrement: 1 } },
      });

      return {
        data: {
          post: updatedPost,
          liked: false,
        },
      };
    }),
});
