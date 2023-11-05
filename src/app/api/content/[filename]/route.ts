import { GetObjectCommand } from '@aws-sdk/client-s3';
import { fileTypeFromBuffer } from 'file-type';
import { readFile } from 'fs/promises'
import { NextRequest } from "next/server";
import { s3 } from "~/s3"

export async function GET(req: NextRequest,
                           { params }: { params: { filename: String }}) {

    const filename = params.filename

    let file : Buffer | Uint8Array | undefined
    if(process.env.S3_BUCKET_NAME != null) {
        const response = await s3.send(new GetObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: filename.toString(),
        }))
        const byteArray = await response.Body?.transformToByteArray()
        file = byteArray
    }
    
    // fallback to local
    if(file == null) {
        const path = "./uploads/" + filename
        file = await readFile(path)
    }
    
    if (file != null) {
        const type = await fileTypeFromBuffer(file.buffer)

        if(file != null && type != null) {
            const response = new Response(file.buffer)
            response.headers.set("content-type", type.mime)
            return response
        } else {
            return new Response(null, {status: 404})
        }
    }
}