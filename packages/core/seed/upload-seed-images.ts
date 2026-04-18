import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

import { S3 } from "../src/s3/s3";

const IMAGES_DIR = path.join(import.meta.dirname, "images");
const EXT_TO_MIME: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

export const uploadSeedImages = async (): Promise<string[]> => {
  await S3.ensureBucket();

  const files = await readdir(IMAGES_DIR);
  const keys: string[] = [];

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    const contentType = EXT_TO_MIME[ext];
    if (!contentType) continue;

    const key = `seed/${file.toLowerCase()}`;
    const body = await readFile(path.join(IMAGES_DIR, file));

    await S3.put(key, body, contentType);
    keys.push(key);
    console.log(`Uploaded seed image: ${key}`);
  }

  return keys;
};
