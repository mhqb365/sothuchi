import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "@/App.vue";
import router from "@/router";

import CoreUIComponents from "@/plugins/coreui-components";
import CoreUIIcons from "@/plugins/coreui-icons";
import { registerSW } from "virtual:pwa-register";

import PullToRefresh from "pulltorefreshjs";

import "@coreui/coreui/dist/css/coreui.min.css";
import "@/assets/css/custom.css";

const app = createApp(App);

app.use(createPinia());
app.use(router);

PullToRefresh.init({
  mainElement: "body",
  instructionsPullToRefresh: "Kéo xuống để làm mới",
  instructionsReleaseToRefresh: "Thả ra để làm mới",
  instructionsRefreshing: "Đang làm mới",
  distThreshold: 60,
  distMax: 80,
  distReload: 50,
  onRefresh() {
    location.reload(); // hoặc load lại data
  },
});

app.use(CoreUIComponents);
app.use(CoreUIIcons);

app.mount("#app");

registerSW();
