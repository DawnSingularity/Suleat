import { z } from "zod";

import { createTRPCRouter, publicProcedure, userProcedure } from "~/server/api/trpc";

import { PrismaClient, Prisma, Post, Comment } from "@prisma/client";
import { elasticsearchFTS } from "~/prisma-fts/elasticsearch/index";
import { Client } from "@elastic/elasticsearch";
import { NextRequest } from "next/server";

const esClient = new Client({ 
  node: 'http://localhost:9200',
  auth: {
    username: 'elastic',
    password: 'vZptqzgfVNilxfw4HUVl'
  }
    // d6a40f0f4459def1ae56122410bebb6d0f493b4f00d681aa5c4c7dd2e8350410
    // LTKlDBeyBh-GdvlFssIr
    // eyJ2ZXIiOiI4LjExLjEiLCJhZHIiOlsiMTkyLjE2OC41Ni4xOjkyMDAiXSwiZmdyIjoiZDZhNDBmMGY0NDU5ZGVmMWFlNTYxMjI0MTBiZWJiNmQwZjQ5M2I0ZjAwZDY4MWFhNWM0YzdkZDJlODM1MDQxMCIsImtleSI6ImROOGZ6WXNCdTZRbWxObkhMb2s1OmJuZTFtRl9nU1FXN3pTMlJ1V1BHT1EifQ==
 });

const prisma = new PrismaClient();
const middleware = elasticsearchFTS(
  esClient,
  Prisma.dmmf,
  {
    User: {
      docId: "uuid",
      indexes: {
        firstName: "user_index",
        lastName: "user_index",
        userName: "user_index"
      }
    },
    Post: {
      docId: "id",
      indexes: {
        caption: "post_index",
        author: "post_index"  
      }
    }
  }
)

prisma.$use(middleware)

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
    const searchOptions = ` {"searchOptions": {"from": ${ input.cursor }}}`
    const searchResults = await esClient.search({
      from: input.cursor,
      size: input.limit,
      query: {
        bool: {
          should: [
            {
              match: {
                firstname: {
                  query: input.searchKey,
                  fuzziness: "AUTO",
                }
              },
            },
            {
              match: {
                lastname: {
                  query: input.searchKey,
                  fuzziness: "AUTO",
                }
              },
            },
            {
              match: {
                caption: {
                  query: input.searchKey,
                  fuzziness: "AUTO",
                }
              },
            },
          ]
        }
      }
    })

    const idList = searchResults.hits.hits.map(({_id}) => _id)
    const result = await prisma.post.findMany({
      where: {
        id: {
          in: idList
        }
        
      },
      include: {
        author: true,
        photos: true,
        flavors: true,
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
      if(input.faved) ctx.db.favorite.create({
        userLikerId: userLiker,
        postLikedId: input.postId
      })

        
  }),
});
