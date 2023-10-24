import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const profileRouter = createTRPCRouter({
    getUserProfile: publicProcedure.query(async () => {
        // TODO: Match route name with username and replace hard coded values
        const user = {
          firstName: 'Gordon',
          lastName: 'Ramsay',
          username: 'gordonramsay',
          postsCount: 0, // Can be array of posts
          followers: 2, // Can be array of follower usernames
          following: 15, // Can be array of following usernames
          location: 'Manila, Philippines',
          profilePic: 'https://picsum.photos/500/500',
          banner: 'https://picsum.photos/600/600',
          bio: 'Renowned chef & TV personality with a passion for culinary excellence. Known for my fiery persona in the kitchen and commitment to exquisite flavors. Join me on a journey of taste and gastronomic exploration. #CookingWithPassion 🍽️',
          flavorProfile: ['sweet','spicy','umami','bitter','sour']
        };
        return user;
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

