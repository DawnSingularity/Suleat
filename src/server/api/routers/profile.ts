import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

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

      getFollowers: publicProcedure.query(async () => {
        // TODO: Get followers from database and replace hardcoded values
        const followers = [{
          id: 1,
          bio: "Lorem ipsum dolor sit amet",
          firstName: "John",
          lastName: "Doe",
          userName: "johndoe",
          email: "johndoe@example.com",
          pfpURL: "https://example.com/johndoe_profile.jpg",
          location: "New York",
          coverURL: "https://example.com/johndoe_cover.jpg",
          createdAt: new Date(),
        },
        {
          id: 1,
          bio: "Lorem ipsum dolor sit amet",
          firstName: "John",
          lastName: "Doe",
          userName: "johndoe",
          email: "johndoe@example.com",
          pfpURL: "https://example.com/johndoe_profile.jpg",
          location: "New York",
          coverURL: "https://example.com/johndoe_cover.jpg",
          createdAt: new Date(),
        },
      ];
        return followers;
      }),

      getFollowing: publicProcedure.query(async () => {
        // TODO: Get following from database and replace hardcoded values
        const followers = [
          {
            id: 1,
            bio: "Lorem ipsum dolor sit amet",
            firstName: "John",
            lastName: "Doe",
            userName: "johndoe",
            email: "johndoe@example.com",
            pfpURL: "https://example.com/johndoe_profile.jpg",
            location: "New York",
            coverURL: "https://example.com/johndoe_cover.jpg",
            createdAt: new Date(),
          },
          {
            id: 1,
            bio: "Lorem ipsum dolor sit amet",
            firstName: "John",
            lastName: "Doe",
            userName: "johndoe",
            email: "johndoe@example.com",
            pfpURL: "https://example.com/johndoe_profile.jpg",
            location: "New York",
            coverURL: "https://example.com/johndoe_cover.jpg",
            createdAt: new Date(),
          },
          
        ];
        
        return followers;
      }),

});

