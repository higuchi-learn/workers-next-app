import { db } from '../db';
import { InsertPost, InsertUser, InsertImage, postsTable, usersTable, imagesTable } from '../schema';
export async function createUser(data: InsertUser) {
  await db.insert(usersTable).values(data);
}
export async function createPost(data: InsertPost) {
  await db.insert(postsTable).values(data);
}
export async function createImage(data: InsertImage) {
  await db.insert(imagesTable).values(data);
}
