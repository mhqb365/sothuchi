import { CIcon } from "@coreui/icons-vue";
import { cilHome, cilWallet, cilPlus, cilList, cilTags } from "@coreui/icons";

export const icons = {
  cilHome,
  cilWallet,
  cilPlus,
  cilList,
  cilTags,
};

export default {
  install: (app) => {
    app.provide("icons", icons);
    app.component("CIcon", CIcon);
  },
};
