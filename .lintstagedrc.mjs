export default {
  "*.{ts,tsx}": ["biome check --write --no-errors-on-unmatched", "biome format --write"],
};
