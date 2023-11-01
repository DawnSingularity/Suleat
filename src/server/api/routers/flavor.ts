import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const flavorRouter = createTRPCRouter({
  getFlavors: publicProcedure
    .query(async ({ ctx }) => {
      return await ctx.db.flavor.findMany(
        {
            orderBy: {
                id: "asc",
            }
        });
    })
})