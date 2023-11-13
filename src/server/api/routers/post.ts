import { z } from "zod";

import { createTRPCRouter, publicProcedure, userProcedure } from "~/server/api/trpc";

export const postRouter = createTRPCRouter({


    create: userProcedure
    .input(
      z.object({
        caption: z.string().min(1).max(10000),
        location: z.string(), // You can add more validation if needed
      })
    )
    .mutation(async ({ ctx, input }) => {
      if(ctx.auth.userId === null) return;
        const post = await ctx.db.post.create({
          data: {
            caption: input.caption,
            authorId: ctx.auth.userId,
            location: input.location,
            favoriteCount: 0, // Provide default values for other fields
            commentCount: 0,
            isEdited: false,
          },
        });
        return post;
  }),


  getPreview: publicProcedure
  .query(async ({ ctx }) => {
    return await ctx.db.post.findMany({
      take: 10, // TODO: don't hardcode
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: true,
        photos: true,
        flavors: true,
      },
    });
  }),

  getByUser: publicProcedure
  .input(z.object({ username: z.string() }))
  .query(async ({ ctx, input }) => {
    return await ctx.db.post.findMany({
      where: {
        authorId: (await ctx.db.user.findUnique({where: {userName: input.username}}))?.uuid
      },
      include: {
        author: true,
        photos: true,
        flavors: true,
      }
    });
  }),

  getPosts: publicProcedure
  .input(z.object({
    limit: z.number().min(1).max(50).default(10),
    cursor: z.object({
      createdAt: z.coerce.date().default(() => new Date()),
      id: z.number().default(1 << 64 /* max ID */), // tiebreaker
    }).default({}),
  }))
  .query(async ({ ctx, input }) => {
    console.log(input)
    return await ctx.db.post.findMany({
      where: {
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
              lt: input.cursor.id, // untested, "less than" is arbitrary
            }
          }
        ]
      },
      include: {
        author: true,
        photos: true,
        flavors: true,
      },
      orderBy: [
        { createdAt: "desc" },
        { id: "desc" }, // matches "less than" logic
      ],
      take: input.limit,
    });
  })
});
