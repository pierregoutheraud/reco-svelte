import adapter from "@sveltejs/adapter-auto";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://svelte.dev/docs/kit/integrations
  // for more information about preprocessors
  preprocess: vitePreprocess(),

  onwarn: (warning, handler) => {
    if (warning.code.toLowerCase().startsWith("a11y-")) {
      return;
    }
    handler(warning);
  },

  kit: {
    adapter: adapter({
      runtime: "nodejs22.x",
      maxDuration: 60
    })
  }
};

export default config;
