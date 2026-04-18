import { AppError } from "@contact-app/core/errors";
import { S3 } from "@contact-app/core/s3/s3";
import { Hono } from "hono";
import { nanoid } from "nanoid";

import { ALLOWED_MIME, MAX_SIZE_BYTES } from "../constants";

const isSafeKey = (key: string) =>
  !key.includes("..") && !key.includes("\\") && !key.startsWith("/");

export const uploadsRoutes = new Hono();

uploadsRoutes.post("/uploads", async (c) => {
  const body = await c.req.parseBody();
  const file = body.file;

  if (!(file instanceof File)) {
    return c.json({ error: "Missing 'file' field" }, 400);
  }

  const ext = ALLOWED_MIME.get(file.type);

  if (!ext) {
    return c.json({ error: `Unsupported type: ${file.type}` }, 400);
  }

  if (file.size > MAX_SIZE_BYTES) {
    return c.json({ error: "File too large (max 5MB)" }, 400);
  }

  const filename = `${nanoid()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await S3.put(filename, buffer, file.type);

  return c.json({ filename });
});

uploadsRoutes.get("/uploads/:key{.+}", async (c) => {
  const key = c.req.param("key");

  if (!isSafeKey(key)) {
    return c.json({ error: "Invalid key" }, 400);
  }

  try {
    const { body, contentType } = await S3.get(key);
    return new Response(body as unknown as ReadableStream, {
      headers: { "content-type": contentType },
    });
  } catch (error) {
    if (error instanceof AppError && error.code === "NOT_FOUND") {
      return c.json({ error: "Not found" }, 404);
    }
    throw error;
  }
});
