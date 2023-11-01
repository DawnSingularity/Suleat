import { fileTypeFromBuffer } from 'file-type';
import { readFile } from 'fs/promises'
import { NextRequest } from "next/server";

export async function GET(req: NextRequest,
                           { params }: { params: { filename: String }}) {

    const filename = params.filename
    const path = "./uploads/" + filename
    const file = await readFile(path)
    
    const type = await fileTypeFromBuffer(file.buffer)

    if(file != null && type != null) {
        const response = new Response(file.buffer)
        response.headers.set("content-type", type.mime)
        return response
    } else {
        return new Response(null, {status: 404})
    }

}