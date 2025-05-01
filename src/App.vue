<template>
  <HeadMenu />
  <div>
    <router-view></router-view>
    <BottomMenu @show-create-transaction="showTransactionModal = true" />
    <CreateTransaction v-model="showTransactionModal" />
  </div>
  <Toast />
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useStore } from "@/stores";
import Toast from "@/components/Toast.vue";
import BottomMenu from "@/components/BottomMenu.vue";
import CreateTransaction from "@/components/CreateTransaction.vue";
import HeadMenu from "@/components/HeadMenu.vue";

const store = useStore();
const showTransactionModal = ref(false);

onMounted(async () => {
  await store.initialize();
});
</script>

<style>
.router-link-active {
  color: var(--cui-navbar-active-color);
  background-color: var(--cui-navbar-active-bg);
}
</style>
