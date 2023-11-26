import { z } from "zod";

import { createTRPCRouter, publicProcedure, userProcedure } from "~/server/api/trpc";

export const postRouter = createTRPCRouter({
    create: userProcedure
    .input(
      z.object({
        caption: z.string().min(1).max(10000),
        location: z.string(),
        flavors: z.array(z.string()) // You can add more validation if needed
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.auth.userId === null) return;
      const post = await ctx.db.post.create({
        data: {
          caption: input.caption,
          authorId: ctx.auth.userId,
          location: input.location,
          flavors: { 
            connect: input.flavors.map((flavor, idx) => ({
              name: flavor
            }))
          },
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
        favedBy: {
          where: {
            userLikerId: ctx.auth.userId ?? ""
          }
        },
        _count: {
          select: {
            comments: true,
            favedBy: true
          }
        }
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
        favedBy: {
          where: {
            userLikerId: ctx.auth.userId ?? ""
          }
        },
        _count: {
          select: {
            comments: true,
            favedBy: true
          }
        }
      }
    });
  }),
  getPostById: publicProcedure
  .input(z.object({ id: z.string() }))
  .query(async ({ ctx, input }) => {
    const post = await ctx.db.post.findUnique({
      where: {
        id: input.id,
      },
      include: {
        author: true,
        photos: true,
        flavors: true,
        favedBy: {
          where: {
            userLikerId: ctx.auth.userId ?? ""
          }
        },
        _count: {
          select: {
            comments: true,
            favedBy: true
          }
        }
      },
    });

    return post;
  }),



  getPosts: publicProcedure
  .input(z.object({
    limit: z.number().min(1).max(50).default(10),
    cursor: z.object({
      createdAt: z.coerce.date().default(() => new Date()),
      id: z.string().default(""), // tiebreaker
    }).default({})
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
              gt: input.cursor.id,
            }
          }
        ]
      },
      include: {
        author: true,
        photos: true,
        flavors: true,
        favedBy: {
          where: {
            userLikerId: ctx.auth.userId ?? ""
          }
        },
        _count: {
          select: {
            comments: true,
            favedBy: true
          }
        }
      },
      orderBy: [
        { createdAt: "desc" },
        { id: "asc" }, // matches "greater than" logic
      ],
      take: input.limit,
    });
  }),

  getSearchPosts: publicProcedure
  .input(z.object({
    limit: z.number().min(1).max(50).default(10),
    cursor: z.number().default(0),
    searchKey: z.string()
  }))
  .query(async ({ ctx, input }) => {
    console.log(input)
    const searchResults = await ctx.esClient.search({
      from: input.cursor,
      size: input.limit,
      query: {
        bool: {
          should: [
            {
              multi_match: {
                query: input.searchKey,
                fields: ["firstname", "lastname", "caption"],
                fuzziness: "AUTO",
              }
            }
          ]
        }
      }
    })

    const idList = searchResults.hits.hits.map(({_id}) => _id)
    const result = await ctx.db.post.findMany({
      where: {
        id: {
          in: idList
        }
        
      },
      include: {
        author: true,
        photos: true,
        flavors: true,
        favedBy: {
          where: {
            userLikerId: ctx.auth.userId ?? ""
          }
        },
        _count: {
          select: {
            comments: true,
            favedBy: true
          }
        }
      },
      take: input.limit,
    })
    console.log("Result: " +result)
    return result
  }),

  updatePostFavorite: userProcedure
    .input(
      z.object({
        postId: z.string(),
        faved: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if(ctx.auth.userId === null) return;

      const userLiker = ctx.user.uuid;
      if(input.faved) await ctx.db.favorite.create({
        data: {
          userLikerId: userLiker,
          postLikedId: input.postId
        }
      })
      else await ctx.db.favorite.deleteMany({
        where: {
          userLikerId: userLiker,
          postLikedId: input.postId
        }
      })

        
  }),
});
