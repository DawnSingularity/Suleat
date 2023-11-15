import { z } from "zod";

import { createTRPCRouter, publicProcedure, userProcedure } from "~/server/api/trpc";

import { PrismaClient, Prisma } from "@prisma/client";
import { elasticsearchFTS } from "@prisma-fts/elasticsearch";
import { Client } from "@elastic/elasticsearch";
import { NextRequest } from "next/server";

var key = ""
if(process.env.ELASTIC_SEARCH_KEY != null) {
    key = process.env.ELASTIC_SEARCH_KEY
}

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
            favoriteCount: 0, // Provide default values for other fields
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
  getPostById: publicProcedure
  .input(z.object({ id: z.string() }))
  .query(async ({ ctx, input }) => {
    const post = await ctx.db.post.findUnique({
      where: {
        id: input.id,
      },
      include: {
        comments: {
          include: {
            subcomments: true,
          },
        },
        author: true,
        photos: true,
        flavors: true,
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
        comments: true,
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
    cursor: z.object({
      createdAt: z.coerce.date().default(() => new Date()),
      id: z.string().default(""), // tiebreaker
    }).default({}),
    searchKey: z.string()
  }))
  .query(async ({ ctx, input }) => {
    console.log(input)
    const result = await prisma.post.findMany({
      where: {
        OR: [
          { caption: "fts:" + input.searchKey },
          { 
              author: {
                  firstName: "fts:" + input.searchKey  
              }
          },
          { 
              author: {
                  lastName: "fts:" + input.searchKey  
              }
          },
          { 
              author: {
                  userName: "fts:" + input.searchKey  
              }
          },
        ]
        
      },
      include: {
        author: true,
        photos: true,
        flavors: true,
      },
      orderBy: [
        { createdAt: "desc" },
        { id: "asc" }, // matches "greater than" logic
      ],
      take: input.limit,
    })
    console.log("Result: " +result)
    return result
  })
});
