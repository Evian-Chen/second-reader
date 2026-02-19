<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useBookStore } from '@/stores/book'
import { useBookSearch } from '@/composables/useBookSearch'

const bookStore = useBookStore()
const { buildSearchQuery, debounce } = useBookSearch()
const { searchQuery: storeSearchQuery } = storeToRefs(bookStore)

const searchQuery = ref('')
const isFocused = ref(false)

// 同步 store 的搜尋關鍵字到本地狀態
onMounted(() => {
  searchQuery.value = storeSearchQuery.value
})

// 監聽 store 的搜尋關鍵字變化
watch(storeSearchQuery, (newValue) => {
  if (searchQuery.value !== newValue) {
    searchQuery.value = newValue
  }
})

/**
 * 執行搜尋
 */
const performSearch = () => {
  const trimmedQuery = searchQuery.value.trim()

  // 如果輸入為空，清除搜尋
  if (!trimmedQuery) {
    bookStore.clearSearch()
    return
  }

  // 更新 store 的搜尋關鍵字
  bookStore.searchQuery = trimmedQuery

  // 建立搜尋查詢物件
  const query = buildSearchQuery(trimmedQuery, bookStore.selectedCategory)

  // 執行搜尋
  bookStore.searchBooks(query)
}

/**
 * 防抖的搜尋函數（300ms）
 */
const debouncedSearch = debounce(performSearch, 300)

/**
 * 處理搜尋（立即執行，不防抖）
 */
const handleSearch = () => {
  performSearch()
}

/**
 * 清除搜尋輸入
 */
const handleClear = () => {
  searchQuery.value = ''
  bookStore.clearSearch()
}

// 監聽搜尋關鍵字變化，實作防抖搜尋
watch(searchQuery, () => {
  // 如果輸入為空，清除搜尋
  if (!searchQuery.value.trim()) {
    bookStore.clearSearch()
  } else {
    // 有輸入時，使用防抖搜尋
    debouncedSearch()
  }
})
</script>

<template>
  <div class="relative group w-full">
    <div
      class="absolute inset-0 bg-white rounded-2xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"
    ></div>
    <div
      class="relative bg-white rounded-2xl shadow-md border border-border/50 overflow-hidden transition-all duration-300 hover:shadow-xl focus-within:shadow-xl focus-within:border-accent/30"
    >
      <div class="flex items-center">
        <!-- 搜尋圖示 -->
        <div class="pl-6 pr-4 shrink-0">
          <svg
            class="w-5 h-5 text-text-tertiary transition-colors duration-200 group-focus-within:text-accent"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <!-- 輸入框 -->
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜尋書名、作者、ISBN..."
          maxlength="100"
          class="flex-1 py-5 pr-6 text-base md:text-lg bg-transparent border-0 focus:outline-none placeholder:text-text-tertiary text-text-primary"
          @keyup.enter="handleSearch"
          @focus="isFocused = true"
          @blur="isFocused = false"
          aria-label="搜尋書籍"
        />

        <!-- 清除按鈕（當有輸入時顯示） -->
        <button
          v-if="searchQuery"
          @click="handleClear"
          class="mr-2 p-2 text-text-tertiary hover:text-text-primary transition-colors"
          aria-label="清除搜尋"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <!-- 搜尋按鈕 -->
        <button
          @click="handleSearch"
          :disabled="bookStore.loading"
          class="mr-4 px-6 py-3 bg-accent text-white rounded-xl font-medium hover:bg-accent/90 active:scale-95 transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="搜尋"
        >
          <span v-if="!bookStore.loading">搜尋</span>
          <span v-else class="flex items-center gap-2">
            <svg
              class="animate-spin h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            搜尋中...
          </span>
        </button>
      </div>
    </div>
  </div>
</template>
