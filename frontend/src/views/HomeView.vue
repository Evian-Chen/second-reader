<template>
  <main class="min-h-screen bg-background flex flex-col gap-8 md:gap-12">
    <!-- 搜尋區塊 -->
    <section
      class="relative py-16 md:py-24 bg-linear-to-b from-background to-background-secondary overflow-hidden"
    >
      <!-- 裝飾性背景元素 -->
      <div class="absolute inset-0 opacity-5">
        <div
          class="absolute top-20 left-10 w-72 h-72 bg-accent rounded-full blur-3xl"
        ></div>
        <div
          class="absolute bottom-20 right-10 w-96 h-96 bg-primary rounded-full blur-3xl"
        ></div>
      </div>

      <div class="container-custom relative z-10">
        <div class="max-w-3xl mx-auto flex flex-col items-center">
          <!-- 標題區 -->
          <div class="text-center mb-10 md:mb-12 w-full">
            <h1
              class="text-3xl md:text-5xl font-bold text-text-primary mb-3 tracking-tight"
            >
              尋找你的下一本好書
            </h1>
            <p class="text-base md:text-lg text-text-secondary">
              探索二手書的無限可能
            </p>
          </div>

          <!-- 搜尋輸入框 -->
          <BookSearchBar />
        </div>
      </div>
    </section>

    <!-- 書籍展示區 -->
    <section class="py-8 md:py-12 flex-1">
      <div class="container-custom">
        <!-- 分類標籤 -->
        <div class="mb-6">
          <BookCategoryFilter />
        </div>

        <!-- Loading 狀態 -->
        <div
          v-if="bookStore.loading"
          class="flex items-center justify-center py-12"
        >
          <div class="flex flex-col items-center gap-4">
            <svg
              class="animate-spin h-8 w-8 text-accent"
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
            <p class="text-text-secondary">搜尋中...</p>
          </div>
        </div>

        <!-- 錯誤狀態 -->
        <div
          v-else-if="bookStore.error"
          class="flex flex-col items-center justify-center py-12 px-4"
        >
          <div
            class="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full"
          >
            <div class="flex items-center gap-3 mb-4">
              <svg
                class="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 class="text-lg font-semibold text-red-800">搜尋失敗</h3>
            </div>
            <p class="text-red-700 mb-4">
              {{ bookStore.error.message || '發生錯誤，請稍後再試' }}
            </p>
            <button
              @click="handleRetry"
              class="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              重試
            </button>
          </div>
        </div>

        <!-- 空結果狀態 -->
        <div
          v-else-if="bookStore.isEmpty"
          class="flex flex-col items-center justify-center py-12 px-4"
        >
          <svg
            class="w-16 h-16 text-text-tertiary mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 class="text-xl font-semibold text-text-primary mb-2">
            找不到相關書籍
          </h3>
          <p class="text-text-secondary text-center mb-4">
            請嘗試其他關鍵字或分類
          </p>
          <button
            @click="bookStore.clearSearch"
            class="px-4 py-2 bg-white border border-border rounded-lg hover:bg-surface-hover transition-colors"
          >
            清除搜尋條件
          </button>
        </div>

        <!-- 書籍網格 -->
        <div
          v-else-if="bookStore.hasResults"
          class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6"
        >
          <BookCard
            v-for="book in bookStore.books"
            :key="book.userBookId"
            :book="book"
          />
        </div>

        <!-- 初始狀態（沒有搜尋時顯示所有書籍或提示） -->
        <div
          v-else
          class="flex flex-col items-center justify-center py-12 px-4"
        >
          <p class="text-text-secondary text-center">
            請輸入關鍵字或選擇分類開始搜尋
          </p>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import BookCard from '../components/BookCard.vue'
import BookSearchBar from '../components/BookSearchBar.vue'
import BookCategoryFilter from '../components/BookCategoryFilter.vue'
import { useBookStore } from '@/stores/book'

const bookStore = useBookStore()

/**
 * 重試搜尋
 */
const handleRetry = () => {
  if (bookStore.lastSearchParams) {
    bookStore.searchBooks(bookStore.lastSearchParams)
  }
}

// 初始化時載入所有書籍
onMounted(() => {
  if (!bookStore.searchQuery && !bookStore.selectedCategory) {
    bookStore.getBooks()
  }
})
</script>
