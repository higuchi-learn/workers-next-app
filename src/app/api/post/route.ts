import { InsertPost } from '@/db/schema';
import { NextRequest, NextResponse } from "next/server";
import { createPost } from "@/db/queries/insert";

export async function POST(req: NextRequest) {
  try {
    const data: InsertPost = await req.json();
    await createPost(data);
    return NextResponse.json({ message: "Post created successfully" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
