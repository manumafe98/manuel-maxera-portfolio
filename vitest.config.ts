import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config";

export default defineConfig((configEnv) =>
  mergeConfig(
    viteConfig(configEnv),
    defineConfig({
      test: {
        include: ["src/**/*.test.{ts,tsx}", "*.test.ts"],
        passWithNoTests: true,
      },
    }),
  ),
);
