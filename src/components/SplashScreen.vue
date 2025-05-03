<template>
  <div class="splash-screen">
    <div class="loader">
      <img :src="splash" alt="splash" width="100px" class="logo" />
    </div>
  </div>
</template>

<script setup>
import splash from "@/assets/logo.png";
</script>

<style scoped>
.splash-screen {
  position: fixed;
  inset: 0;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.logo {
  border-radius: 20%;
}
</style>
