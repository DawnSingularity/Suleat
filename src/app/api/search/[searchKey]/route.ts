import { PrismaClient, Prisma } from "@prisma/client";
import { elasticsearchFTS } from "@prisma-fts/elasticsearch";
import { Client } from "@elastic/elasticsearch";
import { NextRequest } from "next/server";

var key = ""
if(process.env.ELASTIC_SEARCH_KEY != null) {
    key = process.env.ELASTIC_SEARCH_KEY
}

const esClient = new Client({ 
    node: 'https://localhost:3000',
    auth: {
        apiKey: key
    }
 });

const prisma = new PrismaClient();
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

prisma.$use(middleware)

export async function GET(req: NextRequest,
    { params }: { params: { searchKey: String }}) {

    // back-end checker to ensure that search key isn't blank
    if(params.searchKey !== "") {
        const users = await prisma.user.findMany({ // TODO: implement infinite scrolling
            where: {
                OR: [
                    { firstName: "fts:" + params.searchKey },
                    { lastName: "fts:" + params.searchKey },
                    { userName: "fts:" + params.searchKey }
                ]
            }
        })

        const posts = await prisma.post.findMany({ // TODO: implement infinite scrolling
            where: {
                OR: [
                    { caption: "fts:" + params.searchKey },
                    { 
                        author: {
                            firstName: "fts:" + params.searchKey  
                        }
                    },
                    { 
                        author: {
                            lastName: "fts:" + params.searchKey  
                        }
                    },
                    { 
                        author: {
                            userName: "fts:" + params.searchKey  
                        }
                    }
                ]
            }
        })

        if (users !== null && posts != null) {
            console.log('Posts:', posts)
            console.log('Users', users)

            return { users, posts }
        }
    }
    
    return new Response("OK")
}