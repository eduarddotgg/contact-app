import { type Options, defineConfig } from "tsup";

export const tsupConfig: Options = {
  entry: ["./src/index.ts"],
  format: ["esm"],
  target: "esnext",
  outExtension() {
    return {
      js: ".mjs",
    };
  },
  silent: true,
  clean: true,
  treeshake: true,
  bundle: true,
  keepNames: true,
  splitting: false,
  noExternal: ["@contact-app/core"],
};

export default defineConfig(tsupConfig);
