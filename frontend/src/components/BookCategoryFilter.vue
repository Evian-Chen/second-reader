<script setup lang="ts">
import { computed } from 'vue'
import { useBookStore } from '@/stores/book'
import { BookCategory } from '@/types/book'
import { useBookCategories } from '@/composables/useBookCategories'

const bookStore = useBookStore()
const { categoryTags } = useBookCategories()

/**
 * 處理分類選擇
 */
const handleCategoryClick = async (category: BookCategory | null) => {
  await bookStore.setCategory(category)
}

/**
 * 檢查分類是否為當前選中
 */
const isActive = (category: BookCategory | null): boolean => {
  return bookStore.selectedCategory === category
}
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <button
      v-for="tag in categoryTags"
      :key="tag.value ?? 'all'"
      @click="handleCategoryClick(tag.value)"
      :class="[
        'px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200',
        isActive(tag.value)
          ? 'bg-primary text-white shadow-md'
          : 'bg-white text-text-primary border border-border hover:bg-surface-hover hover:border-accent/30',
      ]"
      :aria-pressed="isActive(tag.value)"
      :aria-label="`${tag.label}分類`"
    >
      {{ tag.label }}
    </button>
  </div>
</template>
