// eruda console
import eruda from "eruda";
eruda.init({
  useShadowDom: true,
});

// scripts
import { createApp } from "vue";
import App from "./app.vue";
import "@vant/touch-emulator";

// css
import "vant/lib/index.css";
import "remixicon/fonts/remixicon.css";
import "@aurora-design/vue/dist/style.css";
import "@kangc/v-md-editor/lib/style/preview.css";
import "@kangc/v-md-editor/lib/theme/style/github.css";

// vue init
const app = createApp(App);

import hljs from "highlight.js";
// @ts-ignore
import VMdPreview from "@kangc/v-md-editor/lib/preview";
// @ts-ignore
import githubTheme from "@kangc/v-md-editor/lib/theme/github.js";

VMdPreview.use(githubTheme, {
  Hljs: hljs,
});

app.use(VMdPreview);

app.mount("#app");
