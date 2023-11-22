import { z } from "zod";
import { createTRPCRouter, userProcedure } from "~/server/api/trpc";

export const faveRouter = createTRPCRouter({
  favePost: userProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.db.post.findUnique({
        where: { id: input.postId },
      });

      const updatedPost = await ctx.db.post.update({
        where: { id: input.postId },
        data: { favoriteCount: { increment: 1 } },
      });

      return {
        post: updatedPost,
        liked: true,
      };
    }),
});
