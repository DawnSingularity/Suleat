import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const profileRouter = createTRPCRouter({
    getUserProfile: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ctx, input}) => {
        // TODO: Match route name with username and replace hard coded values
          return await ctx.db.user.findFirst({
            where: {"userName": input.username},
            include: { flavors: true },
          });
      }),

      getFollowers: publicProcedure.query(async () => {
        // TODO: Get followers from database and replace hardcoded values
        const followers = [{
          firstName: 'Hazel',
          lastName: 'Wilson',
          username: 'hazelwilson',
          isFollowing: false
        },
        {
          firstName: 'Emilie',
          lastName: 'Green',
          username: 'emiliegreen',
          isFollowing: false
        },
      ];
        return followers;
      }),

      getFollowing: publicProcedure.query(async () => {
        // TODO: Get following from database and replace hardcoded values
        const followers = [
          {
            firstName: 'Preston',
            lastName: 'Thornton',
            username: 'prestonthornton',
            isFollowing: false,
          },
          {
            firstName: 'Emilie',
            lastName: 'Green',
            username: 'emiliegreen',
            isFollowing: false,
          },
          {
            firstName: 'Ariana',
            lastName: 'Clark',
            username: 'arianaclark',
            isFollowing: false,
          },
          {
            firstName: 'Julian',
            lastName: 'Adams',
            username: 'julianadams',
            isFollowing: false,
          },
          {
            firstName: 'Cora',
            lastName: 'Hughes',
            username: 'corahughes',
            isFollowing: false,
          },
          {
            firstName: 'Isaiah',
            lastName: 'Russell',
            username: 'isaiahrussell',
            isFollowing: false,
          },
          {
            firstName: 'Leah',
            lastName: 'Baker',
            username: 'leahbaker',
            isFollowing: false,
          },
          {
            firstName: 'Sebastian',
            lastName: 'Gonzalez',
            username: 'sebastiangonzalez',
            isFollowing: false,
          },
          {
            firstName: 'Olivia',
            lastName: 'Turner',
            username: 'oliviaturner',
            isFollowing: false,
          },
          {
            firstName: 'Nathan',
            lastName: 'Cooper',
            username: 'nathancooper',
            isFollowing: false,
          },
          {
            firstName: 'Madeline',
            lastName: 'Perez',
            username: 'madelineperez',
            isFollowing: false,
          },
          {
            firstName: 'Landon',
            lastName: 'Ward',
            username: 'landonward',
            isFollowing: false,
          },
          {
            firstName: 'Elena',
            lastName: 'Sanders',
            username: 'elenasanders',
            isFollowing: false,
          },
          {
            firstName: 'Xavier',
            lastName: 'Butler',
            username: 'xavierbutler',
            isFollowing: false,
          },
          {
            firstName: 'Ivy',
            lastName: 'Barnes',
            username: 'ivybarnes',
            isFollowing: false,
          },
        ];
        
        return followers;
      }),

});

