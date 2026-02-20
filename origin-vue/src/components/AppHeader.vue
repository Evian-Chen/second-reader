<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { SignedIn, SignedOut, SignInButton, useUser } from '@clerk/vue'
import logoDark from '@/assets/logoDark.png'

const router = useRouter()
const { user } = useUser()
const showUserMenu = ref(false)
const userMenuRef = ref<HTMLElement | null>(null)

const handleCartClick = () => {
  // 未登入時導航到登入頁
  router.push('/login')
}

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

// 點擊外部關閉選單
const handleClickOutside = (event: MouseEvent) => {
  if (userMenuRef.value && !userMenuRef.value.contains(event.target as Node)) {
    showUserMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <header class="sticky top-0 z-50 bg-gray-900 border-b border-gray-800 backdrop-blur-sm bg-opacity-95 shadow-lg">
    <div class="container-custom">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <div class="flex items-center">
          <router-link to="/" class="flex items-center hover:opacity-80 transition-opacity">
            <img 
              :src="logoDark" 
              alt="Second Reader Logo" 
              class="w-24 h-16 object-contain"
            />
          </router-link>
        </div>

        <!-- 右側功能區 -->
        <div class="flex items-center gap-4">
          <!-- 購物車 -->
          <SignedOut>
            <button
              @click="handleCartClick"
              class="relative p-2 rounded-lg hover:bg-gray-800 transition-colors"
              aria-label="購物車"
            >
              <svg
                class="w-6 h-6 text-gray-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </button>
          </SignedOut>

          <SignedIn>
            <button
              class="relative p-2 rounded-lg hover:bg-gray-800 transition-colors"
              aria-label="購物車"
            >
              <svg
                class="w-6 h-6 text-gray-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <!-- 購物車數量徽章（可選） -->
              <span
                v-if="false"
                class="absolute top-0 right-0 w-4 h-4 bg-accent text-white text-xs rounded-full flex items-center justify-center"
              >
                3
              </span>
            </button>
          </SignedIn>

          <!-- 使用者區塊 -->
          <SignedOut>
            <div class="flex items-center gap-2">
              <SignInButton mode="modal">
                <button
                  class="px-4 py-2 text-sm font-medium text-gray-200 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  登入
                </button>
              </SignInButton>
              <SignInButton mode="modal">
                <button
                  class="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                >
                  註冊
                </button>
              </SignInButton>
            </div>
          </SignedOut>

          <SignedIn>
            <div ref="userMenuRef" class="user-menu-container relative">
              <button
                @click.stop="toggleUserMenu"
                class="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-800 transition-colors"
                aria-label="使用者選單"
              >
                <div class="w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md">
                  <span class="text-white text-sm font-medium">
                    {{ user?.firstName?.charAt(0) || 'U' }}
                  </span>
                </div>
                <svg
                  class="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              <!-- 下拉選單 -->
              <div
                v-if="showUserMenu"
                @click.stop
                class="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl border border-gray-700 py-2 z-50 backdrop-blur-sm"
              >
                <router-link
                  to="/profile"
                  class="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 transition-colors"
                  @click="showUserMenu = false"
                >
                  個人資料
                </router-link>
                <router-link
                  to="/orders"
                  class="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 transition-colors"
                  @click="showUserMenu = false"
                >
                  我的訂單
                </router-link>
                <router-link
                  to="/my-books"
                  class="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 transition-colors"
                  @click="showUserMenu = false"
                >
                  我的書籍
                </router-link>
                <hr class="my-2 border-gray-700" />
                <button
                  class="w-full text-left px-4 py-2 text-sm text-gray-400 hover:bg-gray-700 hover:text-gray-200 transition-colors"
                  @click="showUserMenu = false"
                >
                  登出
                </button>
              </div>
            </div>
          </SignedIn>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.user-menu-container {
  position: relative;
}
</style>
