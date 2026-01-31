<script setup lang="ts">
interface Book {
  id: string
  title: string
  author: string
  price: number
  originalPrice?: number
  image: string
  condition: string
  rating?: number
}

defineProps<{
  book: Book
}>()
</script>

<template>
  <div class="group bg-white rounded-lg overflow-hidden border border-border hover:shadow-md transition-all duration-200 cursor-pointer">
    <!-- 書籍圖片 -->
    <div class="aspect-3/4 bg-background-secondary relative overflow-hidden">
      <img
        :src="book.image"
        :alt="book.title"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
      />
      <!-- 書籍狀態標籤 -->
      <div class="absolute top-2 left-2">
        <span
          class="px-2 py-1 text-xs font-medium bg-white/90 backdrop-blur-sm rounded text-text-primary"
        >
          {{ book.condition }}
        </span>
      </div>
    </div>

    <!-- 書籍資訊 -->
    <div class="p-4">
      <h3 class="text-sm font-medium text-text-primary line-clamp-2 mb-1 group-hover:text-accent transition-colors">
        {{ book.title }}
      </h3>
      <p class="text-xs text-text-secondary mb-2">
        {{ book.author }}
      </p>

      <!-- 評分（可選） -->
      <div v-if="book.rating" class="flex items-center mb-2">
        <div class="flex items-center">
          <svg
            v-for="i in 5"
            :key="i"
            class="w-3 h-3"
            :class="i <= book.rating! ? 'text-yellow-400' : 'text-gray-300'"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
            />
          </svg>
        </div>
        <span class="text-xs text-text-tertiary ml-1">
          {{ book.rating }}
        </span>
      </div>

      <!-- 價格 -->
      <div class="flex items-baseline justify-between">
        <div>
          <span class="text-lg font-semibold text-text-primary">
            NT$ {{ book.price.toLocaleString() }}
          </span>
          <span
            v-if="book.originalPrice"
            class="text-xs text-text-tertiary line-through ml-2"
          >
            NT$ {{ book.originalPrice.toLocaleString() }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
