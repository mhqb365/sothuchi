<template>
  <CNavbar expand="lg" colorScheme="light" class="bg-light d-none d-md-block">
    <CContainer fluid>
      <router-link class="navbar-brand" to="/">Sổ Thu Chi</router-link>
      <CNavbarToggler @click="visible = !visible" />
      <CCollapse class="navbar-collapse" :visible="visible">
        <CNavbarNav>
          <CNavItem>
            <router-link
              class="nav-link"
              to="/"
              active-class="active"
              @click="visible = false"
            >
              Tổng Quan
            </router-link>
          </CNavItem>
          <CNavItem>
            <router-link
              class="nav-link"
              to="/accounts"
              active-class="active"
              @click="visible = false"
            >
              Tài Khoản
            </router-link>
          </CNavItem>
          <CNavItem>
            <router-link
              class="nav-link"
              to="/transactions"
              active-class="active"
              @click="visible = false"
            >
              Giao Dịch
            </router-link>
          </CNavItem>
          <CNavItem>
            <router-link
              class="nav-link"
              to="/categories"
              active-class="active"
              @click="visible = false"
            >
              Danh Mục
            </router-link>
          </CNavItem>
          <CNavItem>
            <router-link
              class="nav-link"
              to="/backup"
              active-class="active"
              @click="visible = false"
            >
              Sao lưu & Khôi phục
            </router-link>
          </CNavItem>
        </CNavbarNav>
      </CCollapse>
    </CContainer>
  </CNavbar>
</template>

<script setup>
import { ref } from "vue";
const visible = ref(false);
</script>

<style scoped>
.router-link-active {
  color: var(--cui-navbar-active-color);
  background-color: var(--cui-navbar-active-bg);
}
</style>
