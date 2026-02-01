<script setup lang="ts">
import { watch } from 'vue'
import { RouterView } from 'vue-router'
import { useAuth as useClerkAuth } from '@clerk/vue'
import { useAuthStore } from './stores/auth'
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'

// 初始化認證 token 管理
const { isSignedIn } = useClerkAuth()
const authStore = useAuthStore()

// 監聽登入狀態變化，自動更新 token
watch(isSignedIn, async () => {
  await authStore.updateToken()
}, { immediate: true })
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <AppHeader />
    <main class="flex-1">
      <RouterView />
    </main>
    <AppFooter />
  </div>
</template>
