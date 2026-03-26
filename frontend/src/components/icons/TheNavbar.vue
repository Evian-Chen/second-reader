<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useRoute, useRouter } from 'vue-router'
import { onMounted, ref, computed } from 'vue'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const isSidebarOpen = ref(false)
const currentTab = ref('')

const navLinks = computed(() => {
  const mainRoute = router.options.routes.find((r) => r.path === '/')
  if (!mainRoute || !mainRoute.children) return []
  return mainRoute.children
    .filter((route) => route.meta?.showInNav)
    .map((route) => ({
      name: (route.meta?.title as string) || route.name,
      path: route.path === '' ? '/' : `/${route.path}`,
    }))
})

onMounted(() => {
  console.log('current tab:', currentTab.value)
  currentTab.value = route.path
})

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const closeSidebar = () => {
  isSidebarOpen.value = false
}

const navigateTo = (path: string) => {
  router.push(path)
  closeSidebar()
  currentTab.value = path
}

const handleLogout = () => {
  closeSidebar()
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <nav class="custom-navbar">
    <div class="nav-container">
      <div class="logo-wrapper" @click="router.push('/')">
        <span class="logo-text">Tiramisu</span>
      </div>

      <div class="nav-action desktop-only">
        <div class="nav-links">
          <a
            v-for="link in navLinks"
            :key="link.path"
            @click.prevent="navigateTo(link.path)"
            :class="{
              'nav-item-selected': currentTab === link.path,
              'nav-item': currentTab !== link.path,
            }"
          >
            {{ link.name }}
          </a>
        </div>
        <div v-if="authStore.isLoggedIn" class="user-info">
          <span>{{ authStore.userProfile?.name }}</span>
        </div>

        <button v-if="authStore.isLoggedIn" class="btn-logout" @click="handleLogout">Logout</button>
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
      <div v-if="authStore.isLoggedIn" class="sidebar-user-info">
        <span>Hi~Hi~ {{ authStore.userProfile?.name }}</span>
      </div>
      <div class="sidebar-links">
        <a
          v-for="link in navLinks"
          :key="link.path"
          @click.prevent="navigateTo(link.path)"
          class="sidebar-nav-item"
        >
          {{ link.name }}
        </a>
      </div>
      <button v-if="authStore.isLoggedIn" class="btn-logout w-full" @click="handleLogout">
        Logout
      </button>
    </div>
  </aside>
</template>

<style scoped>
.custom-navbar {
  position: sticky;
  top: 0;
  z-index: 1000;
  width: 100%;
  background-color: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
  height: 64px;
  display: flex;
  align-items: center;
}

.nav-container {
  width: 100%;
  max-width: 1500px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo-wrapper {
  cursor: pointer;
}

.logo-text {
  font-size: 1.25rem;
  font-weight: 700;
  color: #4a3728;
  letter-spacing: 1px;
}

.nav-action {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
  margin-right: 1rem;
}

.nav-item {
  color: #4a3728;
  font-weight: 500;
  cursor: pointer;
  padding: 4px 8px;
}

.nav-item:hover {
  background-color: rgba(73, 101, 91, 0.2);
  border-radius: 4px;
}

.nav-item-selected {
  color: #4a3728;
  font-weight: 500;
  cursor: pointer;
  padding: 4px 8px;
  background-color: rgba(73, 101, 91, 0.2);
  border-radius: 4px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding-right: 1rem;
  border-right: 1px solid #e2e8f0;
}

.btn-logout {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #ef4444;
  background-color: transparent;
  border: 1px solid #fee2e2;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-logout:hover {
  background-color: #fef2f2;
  border-color: #fecaca;
}

.btn-logout.w-full {
  width: 100%;
  margin-top: 1rem;
}

.hamburger-btn,
.close-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  color: #4a3728;
  display: flex;
  align-items: center;
  justify-content: center;
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
  box-shadow: -4px 0 15px rgba(0, 0, 0, 0.1);
  z-index: 50;
  transition: right 0.3s ease-in-out;
  display: flex;
  flex-direction: column;
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
  display: flex;
  flex-direction: column;
  flex: 1;
}

.sidebar-user-info {
  font-weight: 500;
  color: #4a3728;
  padding-bottom: 1rem;
}

.sidebar-nav-item {
  display: block;
  width: 100%;
  color: #4a3728;
  font-weight: 500;
  cursor: pointer;
  padding: 1rem 0.5rem;
  text-decoration: none;
  transition: background-color 0.2s;
}

.sidebar-nav-item:hover {
  background-color: #f8fafc;
  border-radius: 4px;
}

.mobile-only {
  display: none;
}

@media (max-width: 768px) {
  .nav-container {
    padding: 0 1rem;
  }

  .desktop-only {
    display: none;
  }

  .mobile-only {
    display: block;
  }
}
</style>
