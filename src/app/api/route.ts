//path: src/app/api/route.ts
import { Client } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

export async function GET() {
  const client = new Client(process.env.DATABASE_URL!);

  await client.connect();
  // elementsテーブルから全ての行を取得
  const { rows } = await client.query("SELECT * FROM elements");
  await client.end();
  // 取得した結果をJSON形式で返す
  return NextResponse.json(rows);
}
