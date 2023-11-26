import { createTRPCRouter, publicProcedure, userProcedure } from "~/server/api/trpc";
import { z } from "zod";

export const commentRouter = createTRPCRouter({
  createSub: userProcedure
    .input(
      z.object({
        postId: z.string(),
        text: z.string().min(1).max(10000),
        parentId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if(ctx.auth.userId === null) return;
      const sub = await ctx.db.comment.create({
        data: {
          postId: input.postId,
          text: input.text,
          authorId: ctx.auth.userId,
          parentId: input.parentId
        }
      });
      return sub;
    }),
    
    create: userProcedure
    .input(
      z.object({
        text: z.string().min(1).max(10000),
        postId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if(ctx.auth.userId === null) return;
      const comment = await ctx.db.comment.create({
        data: {
          text: input.text,
          authorId: ctx.auth.userId,
          postId: input.postId
        }
      });
      return comment;
    }),


  getCommentByPostId: publicProcedure
  .input(z.object({
    postId: z.string(),
    limit: z.number().min(1).max(50).default(10),
    cursor: z.object({
      createdAt: z.coerce.date().default(() => new Date()),
      id: z.string().default(""), // tiebreaker
    }).default({})
  }))
  .query(async ({ ctx, input }) => {
    console.log(input)
    return await ctx.db.comment.findMany({
      where: {
        postId: input.postId,
        parentComment: null,
        OR: [
          {
            createdAt: {
              lt: input.cursor.createdAt,
            }
          },

          // equal date, tiebreaker needed
          {
            createdAt: input.cursor.createdAt,
            id: {
              gt: input.cursor.id,
            }
          }
        ]
      },
      include: {
        author: true,
        subcomments: {
          include:{
            author: true,
          }
        },
      },
      orderBy: [
        { createdAt: "desc" },
        { id: "asc" }, // matches "greater than" logic
      ],
      take: input.limit,
    });
  }),

})