import { NextRequest, NextResponse } from "next/server";
import { updatePost } from "@/db/queries/update";
import type { SelectPost } from "@/db/schema";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body: Partial<Omit<SelectPost, 'id'>> = await req.json();

    await updatePost(Number(id), body);

    return NextResponse.json(
      { message: 'Post updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
