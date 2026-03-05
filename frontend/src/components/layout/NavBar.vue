<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref } from 'vue'

const router = useRouter()
const isSidebarOpen = ref(false)

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const closeSidebar = () => {
  isSidebarOpen.value = false
}

const navigateTo = (path: string) => {
  router.push(path)
  closeSidebar()
}
</script>

<template>
  <nav class="custom-navbar">
    <div class="nav-container">
      <img src="../../assets/logo.png" alt="logo" class="logo-wrapper" @click="navigateTo('/')">

      <div class="nav-action">
        <div class="nav-links desktop-only">
          <div class="icon-actions">
            <i class="pi pi-pen-to-square icon-btn"></i>
            <i class="pi pi-file-plus icon-btn"></i>
            
            <div class="cart-container">
              <i class="pi pi-shopping-cart icon-btn"></i>
              <span class="notification-badge">3</span>
            </div>
            <div class="bell-container">
              <i class="pi pi-bell icon-btn"></i>
              <span class="notification-badge">3</span>
            </div>
          </div>
        </div>

        <button class="hamburger-btn mobile-only" @click="toggleSidebar">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>
  </nav>

  <div v-if="isSidebarOpen" class="sidebar-overlay" @click="closeSidebar"></div>

  <aside :class="['sidebar', { 'is-open': isSidebarOpen }]">
    <div class="sidebar-header">
      <span class="logo-text">側選單</span>
      <button class="close-btn" @click="closeSidebar">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
    <div class="sidebar-content">
      <span>Hi~Hi~ </span>
    </div>
  </aside>
</template>

<style scoped>
/* 核心修改：確保外層 nav 是 100% 寬度 */
.custom-navbar {
  width: 100%;
  background-color: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
  height: 64px;
  display: flex;
  align-items: center;
  position: relative;
  z-index: 30;
}

/* NavBar.vue 內的 style */
.nav-container {
  width: 100%;
  max-width: none;
  padding: 0 2rem; /* 你可以根據喜好調整這兩邊的留白 */
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo-wrapper {
  cursor: pointer;
  height: 40px; /* 改用高度控制較穩穩定 */
  width: auto;
}

.nav-action {
  display: flex;
  align-items: center;
}

.icon-actions {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.icon-btn {
  font-size: 1.25rem;
  color: #4a3728;
  cursor: pointer;
}

/* Badge 定位 */
.cart-container {
  position: relative;
  display: flex;
  align-items: center;
}

.bell-container {
  position: relative;
  display: flex;
  align-items: center;
}

.notification-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: #ef4444;
  color: white;
  font-size: 10px;
  min-width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
  font-weight: bold;
}

/* Sidebar 相關樣式 */
.logo-text {
  font-size: 1.25rem;
  font-weight: 700;
  color: #4a3728;
}

.hamburger-btn,
.close-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  color: #4a3728;
  padding: 0.5rem;
}

.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 40;
}

.sidebar {
  position: fixed;
  top: 0;
  right: -280px;
  width: 280px;
  height: 100vh;
  background-color: #ffffff;
  z-index: 50;
  transition: right 0.3s ease-in-out;
}

.sidebar.is-open {
  right: 0;
}

.sidebar-header {
  height: 64px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.sidebar-content {
  padding: 1.5rem;
}

/* 響應式切換 */
.mobile-only {
  display: none;
}

@media (max-width: 768px) {
  .desktop-only {
    display: none;
  }
  .mobile-only {
    display: block;
  }
  .nav-container {
    padding: 0 1rem;
  }
}
</style>