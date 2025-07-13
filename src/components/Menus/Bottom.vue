<template>
  <div class="bottom-menu d-md-none">
    <router-link to="/" class="menu-item">
      <CIcon name="cil-home" />
      <span class="fw-bold">Tổng Quan</span>
    </router-link>
    <router-link to="/accounts" class="menu-item">
      <CIcon name="cil-wallet" />
      <span class="fw-bold">Tài Khoản</span>
    </router-link>
    <div class="menu-item add-btn" @click="$emit('show-create-transaction')">
      <CIcon name="cil-plus" size="xl" />
    </div>
    <router-link to="/transactions" class="menu-item">
      <CIcon name="cil-list" />
      <span class="fw-bold">Giao Dịch</span>
    </router-link>
    <router-link to="/categories" class="menu-item">
      <CIcon name="cil-tags" />
      <span class="fw-bold">Danh Mục</span>
    </router-link>
  </div>
</template>

<script setup>
defineEmits(["show-create-transaction"]);
</script>

<style scoped>
.bottom-menu {
  display: flex;
  justify-content: space-around;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  padding: 20px 0;
  z-index: 1000;
  box-shadow: 0 -1px 10px rgba(0, 0, 0, 0.05);
}

.menu-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: #777;
  font-size: 0.7rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.menu-item i,
.menu-item svg {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-bottom: 4px;
}

.menu-item::after {
  content: "";
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%) scaleX(0);
  width: 25px;
  height: 5px;
  background-color: #4169e1;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.menu-item.router-link-active::after {
  transform: translateX(-50%) scaleX(1);
}

.menu-item.router-link-active i,
.menu-item.router-link-active svg {
  transform: translateY(-2px);
  color: #4169e1;
}

.menu-item span {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.menu-item.router-link-active span {
  color: #4169e1;
  transform: translateY(-2px);
}

.add-btn {
  color: white;
  background: #4169e1;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: -35px;
  box-shadow: 0 2px 10px rgba(65, 105, 225, 0.3);
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.add-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 15px rgba(65, 105, 225, 0.4);
}

.add-btn:active {
  transform: scale(0.95);
}

.menu-item:hover,
.menu-item.router-link-active {
  color: #4169e1;
}

.menu-item.router-link-active i {
  transform: scale(1.1);
}
</style>
