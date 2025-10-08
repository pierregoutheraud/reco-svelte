import { paraglideVitePlugin } from "@inlang/paraglide-js";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig, type UserConfig } from "vitest/config";

export default defineConfig(async () => {
  const paraglidePlugins = await paraglideVitePlugin({
    project: "./project.inlang",
    outdir: "./src/lib/paraglide",
    strategy: ["cookie", "globalVariable", "baseLocale"]
  });

  const pluginsArray = Array.isArray(paraglidePlugins)
    ? paraglidePlugins
    : [paraglidePlugins];

  return {
    plugins: [sveltekit(), ...pluginsArray],
    test: { include: ["src/**/*.{test,spec}.{js,ts}"] }
  } as UserConfig;
});
