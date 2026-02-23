import { InsertUser } from '@/db/schema';
import { InsertPost } from '@/db/schema';
import { InsertImage } from "@/db/schema";
import { createUser } from "@/db/queries/insert";
import { getUserById } from "@/db/queries/select";
import { deleteUser } from "@/db/queries/delete";
import { updatePost } from "@/db/queries/update";
import { createImage } from "@/db/queries/insert";
import type { SelectPost } from "@/db/schema";
import { createPost } from "@/db/queries/insert";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { Hono } from "hono";
import { handle } from "hono/vercel";

type Bindings = {
  MY_BUCKET: R2Bucket;
};

const app = new Hono<{ Bindings: Bindings }>().basePath("/api");
const { env } = await getCloudflareContext({ async: true });

app.post("/user", async (c) => {
  try {
    const data: InsertUser = await c.req.json();
    await createUser(data);
    return c.json({ message: "User created successfully" }, { status: 201 });
  } catch (error) {
    return c.json({ error: "Failed to create user" }, { status: 500 });
  }
});

app.get("/user/:id", async (c) => {
  try {
    const { id } = c.req.param();
    const user = await getUserById(Number(id));
    return c.json(user);
  } catch (error) {
    return c.json({ error: "Failed to fetch user" }, { status: 500 });
  }
});

app.delete("/user/:id", async (c) => {
  try {
    const { id } = c.req.param();
    await deleteUser(Number(id));
    return c.json({ message: 'User deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return c.json({ error: 'Internal Server Error' }, { status: 500 });
  }
});

app.post("/post", async (c) => {
  try {
    const data: InsertPost = await c.req.json();
    await createPost(data);
    return c.json({ message: "Post created successfully" }, { status: 201 });
  } catch (error) {
    return c.json({ error: "Failed to create post" }, { status: 500 });
  }
});

app.put("/post/:id", async (c) => {
  try {
    const { id } = c.req.param();
    const body: Partial<Omit<SelectPost, 'id'>> = await c.req.json();
    await updatePost(Number(id), body);
    return c.json({ message: 'Post updated successfully' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return c.json({ error: 'Internal Server Error' }, { status: 500 });
  }
});

app.post("/upload", async (c) => {
  const body = await c.req.parseBody();
  const file = body.file as File;

  if (!file) {
    return c.json({ error: "file is required" }, 400);
  }

  const key = `${Date.now()}-${file.name}`;

  await env.MY_BUCKET.put(
    key,
    await file.arrayBuffer(),
    {
      httpMetadata: {
        contentType: file.type,
      },
    }
  );

  const imagePath = `/api/images/${key}`;
  const url = `${c.req.url.split("/api")[0]}${imagePath}`

  try {
    const data: InsertImage = { url: url };
    await createImage(data);
    return c.json({ message: "Image saved successfully" }, { status: 201 });
  } catch (error) {
    return c.json({ error: "Failed to save image" }, { status: 500 });
  }
});

app.get("/images/:key", async (c) => {
  try {
    const key  = c.req.param("key");
    const image = await env.MY_BUCKET.get(key);
    if (!image) {
      return c.json({ error: "Image not found" }, 404);
    }
    return c.body(image.body, 200, {
      "Content-Type": image.httpMetadata?.contentType ?? "image/png",
    });
  } catch (error) {
    return c.json({ error: "Failed to fetch image" }, { status: 500 });
  }
});

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)
