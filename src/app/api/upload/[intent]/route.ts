import fs from 'fs-extra';
import { fileTypeFromBuffer } from 'file-type';
import { writeFile } from 'fs/promises'
import { NextRequest } from "next/server";

import { PrismaClient } from "@prisma/client";
import { getAuth } from '@clerk/nextjs/server';

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
        await fs.ensureDir("./uploads")
        await writeFile("./uploads/" + fileName, fileBuffer)
    
    
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
                    where: { id: user.id },
                    data: {
                        pfpURL: "/api/content/" + fileName,
                    },
                })
                break
            case "cover":
                await prisma.user.update({
                    where: { id: user.id },
                    data: {
                        coverURL: "/api/content/" + fileName,
                    },
                })
                break
        }
    }

    return new Response("OK")
}