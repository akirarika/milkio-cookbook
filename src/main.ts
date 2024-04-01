// eruda console
import eruda from "eruda";
eruda.init({
  useShadowDom: true,
});

// clarity

if (location.href.startsWith('https://southern-aurora.github.io/')) eval(`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y)})(window,document,"clarity","script","lpkggmj4ib");`);

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
