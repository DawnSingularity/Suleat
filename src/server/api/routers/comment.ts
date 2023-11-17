import { createTRPCRouter, publicProcedure, userProcedure } from "~/server/api/trpc";
import { z } from "zod";

export const commentRouter = createTRPCRouter({
  createSub: userProcedure
    .input(
      z.object({
        text: z.string().min(1).max(10000),
        parentId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if(ctx.auth.userId === null) return;
      const sub = await ctx.db.comment.create({
        data: {
          text: input.text,
          authorId: ctx.auth.userId,
          parentId: input.parentId
        }
      });
      return sub;
    }),
})