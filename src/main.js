import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "@/App.vue";
import router from "@/router";

import "@coreui/coreui/dist/css/coreui.min.css";
import "@/assets/css/custom.css";

const app = createApp(App);

app.use(createPinia());
app.use(router);

import CoreUIComponents from "@/plugins/coreui-components";
import CoreUIIcons from "@/plugins/coreui-icons";

app.use(CoreUIComponents);
app.use(CoreUIIcons);

app.mount("#app");
