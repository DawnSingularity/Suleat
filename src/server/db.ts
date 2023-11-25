import { Prisma, PrismaClient } from "@prisma/client";
import { elasticsearchFTS } from "~/prisma-fts/elasticsearch/index";
import { Client } from "@elastic/elasticsearch";

import { env } from "~/env.mjs";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  esClient: Client | undefined;
};

export const esClient = 
 globalForPrisma.esClient ??
 new Client({ 
  node: process.env.ELASTIC_SEARCH_URL ?? 'http://localhost:9200',
  auth: {
    username: process.env.ELASTIC_SEARCH_USERNAME ?? 'elastic',
    password: process.env.ELASTIC_SEARCH_KEY ?? 'elastic'
  }
});

const createNewPrismaClient = () => {
  const prismaClient = new PrismaClient({
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  })

  const middleware = elasticsearchFTS(
    esClient,
    Prisma.dmmf,
    {
      User: {
        docId: "uuid",
        indexes: {
          firstName: "user_index",
          lastName: "user_index",
          userName: "user_index"
        }
      },
      Post: {
        docId: "id",
        indexes: {
          caption: "post_index",
          author: "post_index"  
        }
      }
    }
  )

  prismaClient.$use(middleware)
  return prismaClient
}  

export const db =
  globalForPrisma.prisma ??
  createNewPrismaClient();

if (env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db
  globalForPrisma.esClient = esClient
}
