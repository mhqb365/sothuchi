<template>
  <div class="bottom-menu">
    <router-link to="/" class="menu-item">
      <CIcon name="cil-home" />
      <span>Tổng quan</span>
    </router-link>
    <router-link to="/accounts" class="menu-item">
      <CIcon name="cil-wallet" />
      <span>Tài khoản</span>
    </router-link>
    <div class="menu-item add-btn" @click="$emit('show-create-transaction')">
      <CIcon name="cil-plus" />
    </div>
    <router-link to="/transactions" class="menu-item">
      <CIcon name="cil-list" />
      <span>Giao dịch</span>
    </router-link>
    <router-link to="/categories" class="menu-item">
      <CIcon name="cil-tags" />
      <span>Danh mục</span>
    </router-link>
  </div>
</template>

<script setup>
defineEmits(["show-create-transaction"]);
</script>

<style scoped>
.bottom-menu {
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  padding: 22px 0;
  z-index: 1000;
  box-shadow: 0 -1px 10px rgba(0, 0, 0, 0.05);
  border-radius: 20px 20px 0 0;
}

.menu-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: #777;
  font-size: 0.7rem;
  transition: all 0.2s ease;
  cursor: pointer;
}

.menu-item i {
  font-size: 1.3rem;
  margin-bottom: 4px;
}

.add-btn {
  color: #4169e1;
}

.menu-item:hover,
.menu-item.router-link-active {
  color: #4169e1;
}

.menu-item.router-link-active i {
  transform: scale(1.1);
}

@media (max-width: 768px) {
  .bottom-menu {
    display: flex;
    justify-content: space-around;
  }
}
</style>
