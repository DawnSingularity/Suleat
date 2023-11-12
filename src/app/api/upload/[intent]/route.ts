import fs from 'fs-extra';
import { fileTypeFromBuffer } from 'file-type';
import { writeFile } from 'fs/promises'
import { NextRequest } from "next/server";

import { PrismaClient } from "@prisma/client";
import { getAuth } from '@clerk/nextjs/server';
import { s3 } from "~/s3"
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getBody } from '@trpc/client/dist/links/internals/httpUtils';

const prisma = new PrismaClient()


export async function POST(req: NextRequest,
                           { params }: { params: { intent: String }}) {
    const formData = await req.formData()
    const file = formData.get("file") as Blob
    const fileBuffer = Buffer.from(await file.arrayBuffer())
    const intent = params.intent
    
    const detectedType = await fileTypeFromBuffer(fileBuffer)

    // ensure that the file is a real image
    if(detectedType?.mime.startsWith("image")) {
        const fileName = crypto.randomUUID()

        if(process.env.S3_BUCKET_NAME != null) {
            await s3.send(new PutObjectCommand({
                Bucket: process.env.S3_BUCKET_NAME,
                Key: fileName,
                Body: fileBuffer,
            }))
        } else {
            await fs.ensureDir("./uploads")
            await writeFile("./uploads/" + fileName, fileBuffer)
        }
    
    
        // find user
        const user = await prisma.user.findUnique({
            where: { uuid: getAuth(req)?.userId ?? undefined },
        });
    
        // If user does not exist
        if (!user) {
            throw new Error("User not found");
        }
        switch(intent) {
            case "pfp":
                await prisma.user.update({
                    where: { uuid: user.uuid },
                    data: {
                        pfpURL: "/api/content/" + fileName,
                    },
                })
                break
            case "cover":
                await prisma.user.update({
                    where: { uuid: user.uuid },
                    data: {
                        coverURL: "/api/content/" + fileName,
                    },
                })
                break
            case 'post':
                console.log(formData)
                const postid = formData.get("id") as Blob
                const postId: number = Number(await new Response(postid).text());
                console.log(postId)
                await prisma.post.update({
                    where: { id: postId},
                    data: {
                    photos: {
                        create: {
                          photoUrl: '/api/content/' + fileName,
                        },
                      }
                    },
                });
                break;
        }
    }

    return new Response("OK")
}