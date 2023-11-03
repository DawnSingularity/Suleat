import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

import { useRouter } from 'next/navigation';
import { Prisma, User, Flavor } from "@prisma/client";

export const profileRouter = createTRPCRouter({
    getUserProfile: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ctx, input}) => {
          return await ctx.db.user.findFirst({
            where: {"userName": input.username},
            include: { flavors: true },
          });
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
        const followers = await ctx.db.follower.findMany({
          where: { myUserId: user.id },
          include: { followedUser: true },
        });

        return followers.map((follower) => follower.followedUser);
    }),

    getFollowing: publicProcedure
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
        where: { myUserId: user.id },
        include: { userFollowing: true },
      });

      return following.map((follow) => follow.userFollowing);
    }),


    updateUserProfile: publicProcedure
    .input(z.object({
      firstName: z.string(),
      lastName: z.string(),
      bio: z.string(),
      location: z.string(),
      flavors: z.array(z.string())
    }))
    .mutation(async ({ctx, input}) => {
      // Get user
      const user = await ctx.db.user.findUnique({
        where: { uuid: ctx.auth.userId },
      })

      // If user does not exist
      if (!user) {
        throw new Error("User not found");
      }

      //
      const flavorsToAdd = input.flavors.map((flavor, idx) => {
        return {name: flavor}
      })

      // update user info
      const updateProfile = await ctx.db.user.update({
        where: { id: user.id },
        data: {
          firstName: input.firstName,
          lastName: input.lastName,
          bio: input.bio,
          location: input.location,
          flavors: { // delete all flavors for now
            deleteMany: {},
            create: flavorsToAdd, // TODO: check if flavors are valid
          },
        }
      });

      return updateProfile
    }),
    
    createUser: publicProcedure
    .input(z.object({
      firstName: z.string(),
      lastName: z.string(),
    }))
    .mutation(async ({ctx, input}) => {
      
      if(ctx.auth.userId != null) {
        const user = await ctx.db.user.findUnique({
          where: { uuid: ctx.auth.userId },
        })

        // if user does not exist
        if(user == null) {
          // twitter default username
          const username = input.firstName + input.lastName + Math.random().toString().slice(2, 10)

          await ctx.db.user.create({
            data: {
              uuid: ctx.auth.userId,
              userName: username,
              firstName: input.firstName,
              lastName: input.lastName,
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
    )
});

