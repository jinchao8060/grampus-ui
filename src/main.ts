import "@/assets/icons/iconfont/iconfont.js";
import ChimeraDeptTree from "@/components/chimera-dept-tree";
import ChimeraRadioGroup from "src/components/chimera-radio-group";
import ChimeraRegionTree from "@/components/chimera-region-tree";
import ChimeraSelect from "@/components/chimera-select";
import ElementPlus from "element-plus";
import "element-plus/theme-chalk/display.css";
import "element-plus/theme-chalk/index.css";
import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import * as ElementPlusIcons from "@element-plus/icons-vue";

import axios from "axios";
import "virtual:svg-icons-register";

const app = createApp(App);
Object.keys(ElementPlusIcons).forEach((iconName) => {
  app.component(iconName, ElementPlusIcons[iconName as keyof typeof ElementPlusIcons]);
});

app
  .use(createPinia())
  .use(router)
  .use(ChimeraRadioGroup)
  .use(ChimeraSelect)
  .use(ChimeraDeptTree)
  .use(ChimeraRegionTree)
  .use(ElementPlus, { size: "default" })
  .mount("#app");

window.axios = axios;
