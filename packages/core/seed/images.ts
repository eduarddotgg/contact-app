import { uploadSeedImages } from "./upload-seed-images";

const seedImages = async () => {
  console.log("Seed image upload start ⏳\n");

  const keys = await uploadSeedImages();

  if (keys.length === 0) {
    throw new Error("No seed images found to upload");
  }
};

seedImages()
  .then(() => {
    console.log("\nSeed image upload complete ✅");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\nSeed image upload failed ❌", error);
    process.exit(1);
  });
