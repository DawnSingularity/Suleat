import { z } from "zod";
import { createTRPCRouter, publicProcedure, userProcedure } from "~/server/api/trpc";

export const profileRouter = createTRPCRouter({
    getUserProfile: publicProcedure
    .input(z.object({ username: z.string().optional() }))
    .query(async ({ctx, input}) => {
          if(input.username != null) {
            return await ctx.db.user.findFirst({
              where: {"userName": input.username},
              include: { flavors: true },
            });
          } else if (ctx.auth.userId != null) { // username not provided
            // can't use ctx.user because it does not have the flavor profiles
            return await ctx.db.user.findFirst({
              where: {"uuid": ctx.auth.userId},
              include: { flavors: true },
            });
          } else {
            return null;
          }
      }),

      getFollowers: publicProcedure
      .input(z.object({ username: z.string() }))
      .query(async ({ctx, input}) => {
        // Get user
        const user = await ctx.db.user.findFirst({
          where: { userName: input.username },
        });

        // If user does not exist
        if (!user) {
          throw new Error("User not found");
        }

        // Get all followers
        const followers = await ctx.db.following.findMany({
          where: { userFollowingId: user.uuid },
          include: { myUser: true },
        });

        return followers.map((follower) => follower.myUser);
    }),

    getFollowing: userProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ctx, input}) => {
      // Get user
      const user = await ctx.db.user.findFirst({
        where: { userName: input.username },
      });

      // If user does not exist
      if (!user) {
        throw new Error("User not found");
      }

      // Get all following
      const following = await ctx.db.following.findMany({
        where: { myUserId: user.uuid },
        include: { userFollowing: true },
      });

      return following.map((follow) => follow.userFollowing);
    }),

    isFollowing: publicProcedure
    .input(z.object({ follower: z.string(), following: z.string() }))
    .query(async ({ctx, input}) => {
      // Get user
      const getId = async (username : string) => 
        (await ctx.db.user.findFirst({
          where: { userName: username },
        }))?.uuid;

      // Get all following
      const relation = await ctx.db.following.findFirst({
        where: { 
          myUserId: await getId(input.follower), 
          userFollowingId: await getId(input.following), 
         },
      });

      return relation != null;
    }),

    updateFollowState: userProcedure
    .input(z.object({ username: z.string(), state: z.boolean() }))
    .mutation(async ({ctx, input}) => {
      // Get user
      const myUserId = ctx.user.uuid
      const userFollowingId = (await ctx.db.user.findUnique({
        where: {
          userName: input.username
        }
      }))?.uuid

      console.log(input.state)
      if(myUserId != null && userFollowingId != null) {
        if(input.state /* follow */) {
          await ctx.db.following.create({
            data: { userFollowingId, myUserId }
          })
        } else {
          await ctx.db.following.delete({
            where: { 
              userFollowingId_myUserId: { userFollowingId, myUserId }
            }
          })
        }

      }

      return {}
    }),

    updateUserProfile: userProcedure
    .input(z.object({
      firstName: z.string(),
      lastName: z.string(),
      bio: z.string(),
      location: z.string(),
      flavors: z.array(z.string())
    }))
    .mutation(async ({ctx, input}) => {
      // update user info
      const updateProfile = await ctx.db.user.update({
        where: { uuid: ctx.user.uuid },
        data: {
          firstName: input.firstName,
          lastName: input.lastName,
          bio: input.bio,
          location: input.location,
          modifiedAt: new Date(),
          flavors: { 
            set: [], // delete all flavors for now
            connect: input.flavors.map((flavor, idx) => ({
              name: flavor
            }))
          },
        }
      });
      return updateProfile
    }),
    
    createUser: publicProcedure
    .input(z.object({
      firstName: z.string(),
      lastName: z.string(),
      flavors: z.array(z.string()).min(1)
    }))
    .mutation(async ({ctx, input}) => {
      
      if(ctx.auth.userId != null) {
        const user = await ctx.db.user.findUnique({
          where: { uuid: ctx.auth.userId },
        })

        // if user does not exist
        if(user == null) {
          // twitter default username
          const removeWhitespace = (s : string) => s.replace(/\s/g, '')
          const username = removeWhitespace(input.firstName) + removeWhitespace(input.lastName) + Math.random().toString().slice(2, 10)

          await ctx.db.user.create({
            data: {
              uuid: ctx.auth.userId,
              userName: username,
              firstName: input.firstName,
              lastName: input.lastName,
              flavors: {
                connect: input.flavors.map((flavor, idx) => ({
                  name: flavor
                }))
              }
          }})

          return {
            message: "OK"
          }
        }
      }

      return {
        message: "ERROR"
      }
    }),

    // TODO: move somewhere else
    getCurrentUser: publicProcedure.query(
      async ({ ctx }) => {
        if(ctx.auth.userId != null) {
          const user = await ctx.db.user.findUnique({
            where: { uuid: ctx.auth.userId },
          })

          return user?.userName
        }

        return null
      }
    ),

    // TODO: move somewhere else
    getSearchUsers: publicProcedure
    .input(z.object({
      limit: z.number().min(1).max(50).default(10),
      cursor: z.number().default(0),
      searchKey: z.string()
    }))
    .query(async ({ ctx, input }) => {
      console.log(input)
      const searchOptions = ` {"searchOptions": {"from": ${ input.cursor }}}`
      const result = await ctx.db.user.findMany({
        where: {
          OR: [
            { firstName: "fts:" + input.searchKey + searchOptions },
            { lastName: "fts:" + input.searchKey + searchOptions },
            { userName: "fts:" + input.searchKey + searchOptions },
          ]
        },
        include: {
          flavors: true
        },
        take: input.limit,
      })
      console.log("Result: " + result)
      return result
    })
});

