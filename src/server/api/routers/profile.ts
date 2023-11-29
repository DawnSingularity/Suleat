import { Prisma } from "@prisma/client";
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

      getUserById: publicProcedure
      .input(z.object({ uuid: z.string() }))
      .query(async ({ctx, input}) => {
        if(input.uuid != null) {
          return await ctx.db.user.findUnique({
            where: {"uuid": input.uuid},
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

          // Create follow notification
          const followedId = userFollowingId
          const followerId = ctx.user.uuid
          const notifSystem = await ctx.db.notificationSystem.upsert({
            where: {
              userId: followedId
            },
            update: {},
            create: {
              userId: followedId
            }
          })

          if(notifSystem !== null) {
            const followNotif = await ctx.db.followNotification.create({
              data: {
                followedId: followedId,
                followerId: followerId,
                systemId: notifSystem?.id,
                isViewed: false,
                category: 'follow',
              },
              include: {
                system: true // Include related NotificationSystem data
              },
            });
          }

        } else {
          // if(postLiked) {
          //   await ctx.db.favNotification.deleteMany({
          //     where: {
          //       favUserLikerId: userLiker,
          //       favPostLikedId: input.postId,
          //       userId: postLiked.authorId
          //     }
          //   }) 
          // }
          await ctx.db.following.delete({
            where: { 
              userFollowingId_myUserId: { userFollowingId, myUserId }
            }
          })
        }

      }

      return {}
    }),

      createFollowNotif: userProcedure
      .input(
        z.object({
          followedId: z.string(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (ctx.auth.userId === null) return;

        const followedId = input.followedId
        const followerId = ctx.user.uuid
        const notifSystem = await ctx.db.notificationSystem.upsert({
          where: {
            userId: followedId
          },
          update: {},
          create: {
            userId: followedId
          }
        })

        if(notifSystem !== null) {
          const followNotif = await ctx.db.followNotification.create({
            data: {
              followedId: followedId,
              followerId: followerId,
              systemId: notifSystem?.id,
              isViewed: false,
              category: 'follow',
            },
            include: {
              system: true // Include related NotificationSystem data
            },
          });
          return followNotif
        }
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
      const searchResults = await ctx.esClient.search({
        from: input.cursor,
        size: input.limit,
        query: {
          bool: {
            should: [
              {
                multi_match: {
                  query: input.searchKey,
                  fields: ["firstname", "lastname", "username"],
                  fuzziness: "AUTO",
                }
              }
            ]
          }
        }
      })
  
      const idList = searchResults.hits.hits.map(({_id}) => _id)
      const result = await ctx.db.user.findMany({
        where: {
          uuid: {
            in: idList
          }
        },
        include: {
          flavors: true
        },
        take: input.limit,
      })
      console.log("Result: " + idList.toString())
      return result
    }),

    getUserNotifs: publicProcedure
    .input(z.object({
      uuid: z.string(),
      limit: z.number().default(10),
      cursor: z.object({
        createdAt: z.coerce.date().default(() => new Date()),
        id: z.object({
          favNotifications: z.string().default(""),
          followNotifications: z.string().default(""),
          commentNotifications: z.string().default(""),
        }).default({}),
      }).default({})
    }))
    .query(async ({ctx, input}) => {
      if(input.uuid != null) {
          // based on post infinite scrolling
          // NOTE: all types of notifications will share the same createdAt cursor
         const notificationIncludeSettings = ({id} : {id: string}) => ({
           take: input.limit,
           where: {
             OR: [ {
                 createdAt: { lt: input.cursor.createdAt, }
               }, {
                 createdAt: input.cursor.createdAt,
                 id: { gt: id, }
               }, ]
           },
           orderBy: [
             { createdAt: Prisma.SortOrder.desc },
             { id: Prisma.SortOrder.asc },
           ],
         });

        return await ctx.db.notificationSystem.findUnique({
          where: {"userId": input.uuid},
          include: {
            favNotifications: notificationIncludeSettings({id: input.cursor.id.favNotifications}),
            followNotifications: notificationIncludeSettings({id: input.cursor.id.followNotifications}),
            commentNotifications: notificationIncludeSettings({id: input.cursor.id.commentNotifications}),
          },
        });
      } else {
        return null;
      }
  }),
  
    updateIsViewedNotif: publicProcedure
    .input(z.object({
      mainId: z.string(),
      secondaryId: z.string().optional(),
      tertiaryId: z.string().optional(),
      type: z.string()
    }))
    .mutation(async({ctx, input}) => {
      if(input.mainId && input.type) {
        if(input.type === "favorite" && input.secondaryId && input.tertiaryId) {
          const response = await ctx.db.favNotification.update({
            where: {
              favUserLikerId_favPostLikedId_userId: {
                favUserLikerId: input.mainId,
                favPostLikedId: input.secondaryId,
                userId: input.tertiaryId
              }
            },
            data: {
              isViewed: true
            }
          })
        } else if(input.type === "comment") {
          const response = await ctx.db.commentNotification.update({
            where: {
              id: input.mainId
            },
            data: {
              isViewed: true
            }
          })
        } else if(input.type === "follow" && input.secondaryId) {
          const response = await ctx.db.followNotification.update({
            where: {
              followedId_followerId: {
                followedId: input.mainId,
                followerId: input.secondaryId
              }
            },
            data: {
              isViewed: true
            }
          })
        }
      }
    })
});

