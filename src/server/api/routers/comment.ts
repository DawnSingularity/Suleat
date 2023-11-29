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

      // create subcomment
      const sub = await ctx.db.comment.create({
        data: {
          postId: input.postId,
          text: input.text,
          authorId: ctx.auth.userId,
          parentId: input.parentId
        }
      });

      // notify post author
      const post = await ctx.db.post.findUnique({
        where:{
          id: input.postId,
        },
        include:{
          author: true,
        }
      })
      if(post !== null){
        const notifSystemPostAuthor = await ctx.db.notificationSystem.upsert({
          where: {
            userId: post?.author.uuid
          },
          update: {},
          create: {
            userId: post?.authorId
          }
        })
        if(notifSystemPostAuthor !== null){
            await ctx.db.commentNotification.create({
            data: {
              commentId: sub.id,
              systemId: notifSystemPostAuthor?.id,
              isViewed: false,
              category: "reply",
              notifyWho: "postAuthor" 
            },
          });
        }
      }



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
      const post = await ctx.db.post.findUnique({
        where:{
          id: input.postId,
        },
        include:{
          author: true,
        }
      })
      if(post !== null){
        const notifSystem = await ctx.db.notificationSystem.upsert({
          where: {
            userId: post?.author.uuid
          },
          update: {},
          create: {
            userId: post?.authorId
          }
        })
        if(notifSystem !== null){
            await ctx.db.commentNotification.create({
            data: {
              commentId: comment.id,
              systemId: notifSystem?.id,
              isViewed: false,
              category: "comment"
            },
          });
        }
      }

      return comment;
    }),

  getCommentById: publicProcedure
  .input(z.object({
    commentId: z.string()
  }))
  .query(async({ctx, input})=>{
    return await ctx.db.comment.findUnique({
      where:{
        id: input.commentId,
      },
      include:{
        author: true,
      }
    })
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