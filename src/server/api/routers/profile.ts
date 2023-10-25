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
    .query(async ({ctx, input}) => {
      const router = useRouter()
      const { username } = router.query

      console.log("try", username)

      // Get user
      const user = await ctx.db.user.findFirst({
        where: { userName: username?.toString() },
      });

      // If user does not exist
      if (!user) {
        throw new Error("User not found");
      }

      // update user info
      const updateProfile = await ctx.db.user.update({
        where: { id: user.id },
        data: {
          firstName: input.firstName,
          lastName: input.lastName,
          bio: input.bio,
          location: input.location
        }
      });

      return updateProfile
    })


});

