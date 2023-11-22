import { flavorRouter } from "~/server/api/routers/flavor";
import { postRouter } from "~/server/api/routers/post";
import { profileRouter } from "~/server/api/routers/profile";
import { createTRPCRouter } from "~/server/api/trpc";
import { commentRouter } from "~/server/api/routers/comment";
import { faveRouter } from "./routers/fave";
import { unfaveRouter } from "./routers/unfave";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  flavor: flavorRouter,
  post: postRouter,
  profile: profileRouter,
  comment: commentRouter,
  fave: faveRouter,
  unfave: unfaveRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
