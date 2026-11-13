import { connectDB } from "@/lib/db";
import { Note } from "@/lib/models/note";
import { NextResponse, type NextRequest } from "next/server";

export async function DELETE(request: NextRequest, {params}: {params: {id: string}}) {
    await connectDB()
    const {id} = await params;

    await Note.findByIdAndDelete(id);

    return NextResponse.json({message: "Deleted"})
}

export async function PUT(req: NextRequest, {params}:{params: {id: string}}) {
    await connectDB()
    const {id} = await params;
    const {title, content} = await req.json()
    const note = await Note.findByIdAndUpdate(id, {title, content}, {returnDocument: "after"})

    return NextResponse.json(note)
}