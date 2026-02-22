import { InsertUser } from '@/db/schema';
import { NextRequest, NextResponse } from "next/server";
import { createUser } from "@/db/queries/insert";

export async function POST(req: NextRequest) {
  try {
    const data: InsertUser = await req.json();
    await createUser(data);
    return NextResponse.json({ message: "User created successfully" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}
