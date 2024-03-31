import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import Components from "unplugin-vue-components/vite";
import { VantResolver } from "@vant/auto-import-resolver";

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  build: {
    outDir: "docs",
    target: "es2022"
  },
  plugins: [
    vue(),
    Components({
      resolvers: [
        //
        VantResolver(),
        (componentName: any) => {
          // where `componentName` is always CapitalCase
          if (componentName.startsWith("Aurora")) return { name: componentName, from: "@aurora-design/vue" };
        },
      ],
    }),
  ],
});
