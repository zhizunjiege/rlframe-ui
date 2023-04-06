import { resolve } from "path";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { quasar, transformAssetUrls } from "@quasar/vite-plugin";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { QuasarResolver } from "unplugin-vue-components/resolvers";
import Pages from "vite-plugin-pages";
import Layouts from "vite-plugin-vue-layouts";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: { transformAssetUrls },
    }),
    quasar({
      sassVariables: "src/styles/variables.scss",
    }),
    AutoImport({
      imports: ["vue", "quasar", "vue-router", "pinia"],
      dts: "src/types/auto-imports.d.ts",
    }),
    Components({
      dirs: ["src/comps"],
      dts: "src/types/components.d.ts",
      resolvers: [QuasarResolver()],
      deep: true,
    }),
    Pages({
      dirs: "src/pages",
    }),
    Layouts({
      layoutsDirs: ["src/layouts"],
      defaultLayout: "home",
    }),
  ],
  resolve: {
    alias: {
      "~": resolve(__dirname, "src"),
      api: resolve(__dirname, "src/api/index"),
    },
  },
  server: {
    open: true,
    cors: true,
    fs: {
      strict: true,
    },
    proxy: {
      "^/(?:api)": {
        target: "http://127.0.0.1:5000",
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("/node_modules/")) {
            const modules = ["vue", "quasar"];
            const chunk = modules.find((module) =>
              id.includes(`/node_modules/${module}`)
            );
            return chunk ? `vendor-${chunk}` : "vendor";
          }
        },
      },
    },
  },
});
