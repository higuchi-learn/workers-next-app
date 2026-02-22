import { eq } from 'drizzle-orm';
import { db } from '../db';
import { SelectPost, postsTable } from '../schema';

export async function updatePost(id: SelectPost['id'],
  // idを除いたデータ部分の型を受け取る
  data: Partial<Omit<SelectPost, 'id'>>) {
  await db.update(postsTable).set(data).where(eq(postsTable.id, id));
}
