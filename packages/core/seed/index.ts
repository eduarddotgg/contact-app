import { contactTable } from "../src/contact/contact.schema";
import { db } from "../src/drizzle";
import { generateContact } from "./contact";
import { insertWithLogging } from "./helpers";
import { uploadSeedImages } from "./upload-seed-images";

const COUNTS = {
  CONTACTS: 1000,
} as const;

const seedData = async () => {
  console.log("Seed start ⏳\n");

  const photoKeys = await uploadSeedImages();

  if (photoKeys.length === 0) {
    throw new Error("No seed images found to upload");
  }

  const contacts = Array.from({ length: COUNTS.CONTACTS }, (_, i) =>
    generateContact(photoKeys[i % photoKeys.length]!, i),
  );

  await db.transaction(async (tx) => {
    await insertWithLogging(tx, contactTable, contacts);
  });
};

seedData()
  .then(() => {
    console.log("\nSeed complete ✅");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\nSeed failed ❌", error);
    process.exit(1);
  });
