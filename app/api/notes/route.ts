import { connectDB } from "@/lib/db";
import { Note } from "@/lib/models/note";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    await connectDB();
    const notes = await Note.find().sort({createdAt: -1})

    return NextResponse.json(notes, {status: 200})
}


export async function POST(request: NextRequest) {
    await connectDB();
    const {title, content} = await request.json();
    const note = await Note.create({title, content})

    return NextResponse.json(note, {status: 201})
}