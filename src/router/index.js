import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/",
    component: () => {
      const component = import("@/views/Overview.vue");
      component.displayName = "Overview";
      return component;
    },
  },
  {
    path: "/accounts",
    component: () => {
      const component = import("@/views/Accounts.vue");
      component.displayName = "AccountsView";
      return component;
    },
  },
  {
    path: "/categories",
    component: () => {
      const component = import("@/views/Categories.vue");
      component.displayName = "CategoriesView";
      return component;
    },
  },
  {
    path: "/transactions",
    component: () => {
      const component = import("@/views/Transactions.vue");
      component.displayName = "TransactionsView";
      return component;
    },
  },
  {
    path: "/backup",
    name: "backup",
    component: () => {
      const component = import("@/views/Backup.vue");
      component.displayName = "BackupView";
      return component;
    },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
