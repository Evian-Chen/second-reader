<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useRoute, useRouter } from 'vue-router'
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import PostComposerModal from '@/components/modals/PostComposerModal.vue'
import BookUploadModal from '@/components/modals/BookUploadModal.vue'
import NotificationDropdown from '@/components/NotificationDropdown.vue'
import { useUiStore } from '@/stores/ui'
import { isDemoMode } from '@/config/demoMode'

const authStore = useAuthStore()
const uiStore = useUiStore()
const { showNotificationDropdown } = storeToRefs(uiStore)
const router = useRouter()
const route = useRoute()

const isSidebarOpen = ref(false)
const showProfileMenu = ref(false)

const navLinks = computed(() => {
  const mainRoute = router.options.routes.find((r) => r.path === '/')
  if (!mainRoute || !mainRoute.children) return []
  return mainRoute.children
    .filter((route) => route.meta?.showInNav)
    .filter(
      (route) => isDemoMode || !route.meta?.requiresAuth || authStore.isLoggedIn
    )
    .map((route) => ({
      name: (route.meta?.title as string) || route.name,
      path: route.path === '' ? '/' : `/${route.path}`,
    }))
})

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const closeSidebar = () => {
  isSidebarOpen.value = false
}

const navigateTo = (path: string) => {
  uiStore.setNotificationDropdown(false)
  router.push(path)
  closeSidebar()
  showProfileMenu.value = false
}

const handleLogout = () => {
  closeSidebar()
  uiStore.setNotificationDropdown(false)
  authStore.logout()
  void router.push('/login')
}

const displayName = computed(() => {
  return authStore.userProfile?.userProfile?.displayName || authStore.userProfile?.accountId || 'User'
})

const marketTabs = computed(() => [
  { label: '閱讀分享', path: '/posts' },
  { label: '二手書市集', path: '/books' },
])

const openPostModal = () => {
  if (!isDemoMode && !authStore.isLoggedIn) return navigateTo('/login')
  uiStore.openPostComposer()
}

const openUploadModal = () => {
  if (!isDemoMode && !authStore.isLoggedIn) return navigateTo('/login')
  uiStore.openBookUpload()
}

const toggleNotification = () => {
  if (!isDemoMode && !authStore.isLoggedIn) return navigateTo('/login')
  uiStore.toggleNotificationDropdown()
}

const openFromSidebar = (fn: () => void) => {
  closeSidebar()
  showProfileMenu.value = false
  fn()
}

const openNotifAndClose = () => {
  if (!isDemoMode && !authStore.isLoggedIn) {
    void router.push('/login')
    return closeSidebar()
  }
  openFromSidebar(() => uiStore.setNotificationDropdown(true))
}

const navLabelByPath: Record<string, string> = {
  '/books': '二手書市集',
  '/posts': '閱讀分享',
  '/cart': '購物車',
  '/me': '個人頁面',
  '/orders': '訂單管理',
  '/sales': '我的賣場',
  '/notifications': '通知',
}

const navLinksDisplay = computed(() =>
  navLinks.value.map((l) => ({
    ...l,
    label: navLabelByPath[l.path] ?? l.name,
  }))
)

const browseOrder = ['/posts', '/books', '/cart', '/notifications'] as const
const accountOrder = ['/me', '/sales', '/orders'] as const

const sidebarBrowseLinks = computed(() => {
  const map = new Map(navLinksDisplay.value.map((l) => [l.path, l] as const))
  return browseOrder.map((p) => map.get(p)).filter((x): x is NonNullable<typeof x> => Boolean(x))
})
const sidebarAccountLinks = computed(() => {
  const map = new Map(navLinksDisplay.value.map((l) => [l.path, l] as const))
  return accountOrder.map((p) => map.get(p)).filter((x): x is NonNullable<typeof x> => Boolean(x))
})

const sidebarOpenComposer = () => {
  if (!isDemoMode && !authStore.isLoggedIn) {
    openFromSidebar(() => void router.push('/login'))
    return
  }
  openFromSidebar(() => uiStore.openPostComposer())
}

const sidebarOpenUpload = () => {
  if (!isDemoMode && !authStore.isLoggedIn) {
    openFromSidebar(() => void router.push('/login'))
    return
  }
  openFromSidebar(() => uiStore.openBookUpload())
}

const goCart = () => openFromSidebar(() => void router.push('/cart'))

watch(
  isSidebarOpen,
  (open) => {
    if (typeof document === 'undefined') return
    document.body.style.overflow = open ? 'hidden' : ''
    if (open) {
      showProfileMenu.value = false
      uiStore.setNotificationDropdown(false)
    }
  },
  { immediate: true }
)

watch(
  () => showProfileMenu.value,
  (open) => {
    if (open) uiStore.setNotificationDropdown(false)
  }
)

onBeforeUnmount(() => {
  if (typeof document !== 'undefined') document.body.style.overflow = ''
})
</script>

<template>
  <nav class="top-navbar">
    <div class="nav-container">
      <div class="brand" @click="router.push('/posts')">
        <span class="brand-logo">📚</span>
        <div>
          <p class="brand-title">黑白冊</p>
          <p class="brand-sub">0. Phil Check</p>
        </div>
      </div>

      <div class="actions desktop-only">
        <button class="icon-btn" title="發布貼文" @click="openPostModal">✎</button>
        <button class="icon-btn" title="上架書籍" @click="openUploadModal">⊞</button>
        <button class="icon-btn" title="購物車" @click="navigateTo('/cart')">🛒</button>
        <button class="icon-btn" title="通知" @click="toggleNotification">🔔</button>
        <button class="avatar-btn" @click="showProfileMenu = !showProfileMenu">{{ displayName.slice(0, 1) }}</button>
      </div>

      <div v-if="showProfileMenu" class="profile-menu desktop-only">
        <p class="profile-name">{{ displayName }}</p>
        <p class="profile-account">@{{ authStore.userProfile?.accountId || 'guest' }}</p>
        <button @click="navigateTo('/me')">個人頁面</button>
        <button @click="navigateTo('/sales')">我的賣場</button>
        <button @click="navigateTo('/orders')">訂單管理</button>
        <button v-if="authStore.isLoggedIn" class="danger" @click="handleLogout">登出</button>
        <button v-else class="primary" @click="navigateTo('/login')">登入</button>
      </div>

      <button class="hamburger-btn mobile-only" @click="toggleSidebar">
        ☰
      </button>
    </div>
    <div class="market-tabs">
      <button
        v-for="tab in marketTabs"
        :key="tab.path"
        :class="['tab-btn', { active: route.path.startsWith(tab.path) }]"
        @click="navigateTo(tab.path)"
      >
        {{ tab.label }}
      </button>
    </div>
  </nav>
  <PostComposerModal :open="uiStore.showPostModal" @close="uiStore.closePostComposer" />
  <BookUploadModal :open="uiStore.showUploadModal" @close="uiStore.closeBookUpload" />
  <NotificationDropdown :open="showNotificationDropdown" />

  <div v-if="isSidebarOpen" class="sidebar-overlay" @click="closeSidebar"></div>

  <aside :class="['sidebar', { 'is-open': isSidebarOpen }]">
    <div class="sidebar-header">
      <span class="sb-title">選單</span>
      <button class="close-btn" type="button" aria-label="關閉" @click="closeSidebar">✕</button>
    </div>

    <div class="sidebar-content">
      <div class="sb-profile">
        <div class="sb-avatar">{{ displayName.slice(0, 1) }}</div>
        <div class="sb-id">
          <p class="sb-name">{{ displayName }}</p>
          <p class="sb-handle">@{{ authStore.userProfile?.accountId || (isDemoMode ? 'demo' : 'guest') }}</p>
        </div>
      </div>

      <p class="sb-section">快捷</p>
      <div class="sb-quick">
        <button type="button" class="sb-quick-btn" @click="sidebarOpenComposer">✎ 發文</button>
        <button type="button" class="sb-quick-btn" @click="sidebarOpenUpload">⊞ 上架</button>
        <button type="button" class="sb-quick-btn" @click="goCart">🛒 購物車</button>
        <button type="button" class="sb-quick-btn" @click="openNotifAndClose">🔔 通知</button>
      </div>

      <p class="sb-section">帳戶</p>
      <div class="sidebar-links">
        <a
          v-for="link in sidebarAccountLinks"
          :key="`acc-${link.path}`"
          class="sidebar-nav-item"
          @click.prevent="navigateTo(link.path)"
        >
          {{ link.label }}
        </a>
      </div>

      <p class="sb-section">瀏覽</p>
      <div class="sidebar-links">
        <a
          v-for="link in sidebarBrowseLinks"
          :key="`br-${link.path}`"
          class="sidebar-nav-item"
          @click.prevent="navigateTo(link.path)"
        >
          {{ link.label }}
        </a>
      </div>

      <div class="sb-footer">
        <button
          v-if="authStore.isLoggedIn"
          type="button"
          class="btn-logout w-full"
          @click="handleLogout"
        >
          登出
        </button>
        <button
          v-else
          type="button"
          class="btn-login w-full"
          @click="openFromSidebar(() => void router.push('/login'))"
        >
          登入
        </button>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.top-navbar {
  position: sticky;
  top: 0;
  z-index: 1000;
  width: 100%;
  background-color: #ffffff;
  border-bottom: 1px solid #ececec;
}

.nav-container {
  width: 100%;
  max-width: 1220px;
  margin: 0 auto;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}

.brand {
  display: flex;
  gap: 8px;
  align-items: center;
  cursor: pointer;
}

.brand-logo {
  font-size: 22px;
}

.brand-title {
  font-size: 16px;
  line-height: 1;
  font-weight: 700;
}

.brand-sub {
  color: #7a7a7a;
  font-size: 11px;
}

.actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.icon-btn,
.avatar-btn {
  border: 1px solid transparent;
  background: transparent;
  width: 34px;
  height: 34px;
  border-radius: 999px;
  cursor: pointer;
}

.icon-btn:hover,
.avatar-btn:hover {
  background: #f1f1f1;
}

.avatar-btn {
  background: #111827;
  color: #fff;
  font-weight: 700;
}

.market-tabs {
  max-width: 1220px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  padding: 0 20px 10px;
}

.tab-btn {
  border: 1px solid #ddd;
  background: #fff;
  padding: 10px 12px;
  font-size: 16px;
  cursor: pointer;
}

.tab-btn.active {
  border-color: #111;
  font-weight: 700;
}

.profile-menu {
  position: absolute;
  right: 20px;
  top: 56px;
  width: 220px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  padding: 12px;
  display: grid;
  gap: 6px;
}

.profile-name {
  font-weight: 700;
}

.profile-account {
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 6px;
}

.profile-menu button {
  border: 1px solid #ececec;
  background: #fff;
  text-align: left;
  border-radius: 8px;
  padding: 8px;
  cursor: pointer;
}

.profile-menu .primary {
  text-align: center;
  background: #111827;
  color: #fff;
}

.profile-menu .danger {
  text-align: center;
  color: #b91c1c;
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
  z-index: 1100;
}

.sidebar {
  position: fixed;
  top: 0;
  right: -280px;
  width: 280px;
  max-width: min(280px, 100vw);
  height: 100vh;
  background-color: #ffffff;
  box-shadow: -4px 0 15px rgba(0, 0, 0, 0.1);
  z-index: 1101;
  transition: right 0.3s ease-in-out;
  display: flex;
  flex-direction: column;
}

.sidebar-links {
  display: grid;
}

.sidebar.is-open {
  right: 0;
}

.sb-title {
  font-size: 16px;
  font-weight: 700;
  color: #111827;
}

.sidebar-header {
  flex-shrink: 0;
  height: 56px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1.25rem;
  border-bottom: 1px solid #e2e8f0;
  background: #fff;
}

.sidebar-content {
  padding: 1rem 1rem 1.25rem;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.sb-profile {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f1f1f1;
}
.sb-avatar {
  width: 48px;
  height: 48px;
  border-radius: 999px;
  background: #111827;
  color: #fff;
  font-weight: 800;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  font-size: 1.1rem;
}
.sb-id {
  min-width: 0;
}
.sb-name {
  font-weight: 700;
  font-size: 0.95rem;
  color: #111827;
  margin: 0;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.sb-handle {
  font-size: 0.8rem;
  color: #6b7280;
  margin: 0.2rem 0 0;
}

.sb-section {
  font-size: 0.75rem;
  font-weight: 700;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin: 0.75rem 0 0.4rem;
}
.sb-section:first-of-type {
  margin-top: 0;
}

.sb-quick {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 0.25rem;
}
.sb-quick-btn {
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  border-radius: 10px;
  padding: 0.55rem 0.4rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: #111827;
  cursor: pointer;
  text-align: center;
}
.sb-quick-btn:hover {
  border-color: #111827;
  background: #fff;
}

.sb-footer {
  margin-top: auto;
  padding-top: 1.25rem;
  border-top: 1px solid #f1f1f1;
}

.sidebar-nav-item {
  display: block;
  width: 100%;
  color: #4a3728;
  font-weight: 500;
  cursor: pointer;
  padding: 0.75rem 0.5rem;
  text-decoration: none;
  transition: background-color 0.2s;
}

.sidebar-nav-item:hover {
  background-color: #f3f4f6;
  border-radius: 8px;
}

.btn-logout,
.btn-login {
  border-radius: 10px;
  padding: 0.6rem 1rem;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
}
.btn-logout {
  border: 1px solid #fecaca;
  background: #fff;
  color: #b91c1c;
}
.btn-login {
  border: 1px solid #111827;
  background: #111827;
  color: #fff;
}
.w-full {
  width: 100%;
}

.mobile-only {
  display: none;
}

@media (max-width: 768px) {
  .nav-container {
    padding: 0 1rem;
  }
  .market-tabs {
    padding: 0 10px 10px;
  }

  .desktop-only {
    display: none;
  }

  .mobile-only {
    display: block;
  }
}
</style>
