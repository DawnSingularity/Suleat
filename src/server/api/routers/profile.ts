import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const profileRouter = createTRPCRouter({
    getUserProfile: publicProcedure.query(async () => {
        // TODO: Match route name with username and replace hard coded values
        const user = {
          firstName: 'Gordon',
          lastName: 'Ramsay',
          username: 'gordonramsay',
          postsCount: 16, // Can be array of posts
          followers: 4703, // Can be array of follower usernames
          following: 205, // Can be array of following usernames
          location: 'Manila, Philippines',
          profilePic: 'https://picsum.photos/500/500',
          banner: 'https://picsum.photos/600/600',
          bio: 'Renowned chef & TV personality with a passion for culinary excellence. Known for my fiery persona in the kitchen and commitment to exquisite flavors. Join me on a journey of taste and gastronomic exploration. #CookingWithPassion 🍽️',
          flavorProfile: ['sweet','spicy','umami','bitter','sour']
        };
        return user;
      }),

});

