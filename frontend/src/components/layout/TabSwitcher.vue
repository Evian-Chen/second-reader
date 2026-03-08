<script setup lang="ts">
import { ref } from 'vue'
const activeTab = ref('reading')
</script>

<template>
  <div class="flex border-b border-[var(--color-border)] w-full">
    <button
      class="flex-1 py-5 text-center font-medium transition-colors relative"
      :class="activeTab === 'reading'
        ? 'text-[var(--color-text)]'
        : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'"
      @click="activeTab = 'reading'"
    >
      閱讀分享
      <span
        v-if="activeTab === 'reading'"
        class="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--color-text)]"
      ></span>
    </button>

    <button
      class="flex-1 py-4 text-center font-medium transition-colors relative"
      :class="activeTab === 'market'
        ? 'text-[var(--color-text)]'
        : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'"
      @click="activeTab = 'market'"
    >
      二手書市集
      <span
        v-if="activeTab === 'market'"
        class="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--color-text)]"
      ></span>
    </button>
  </div>
</template>
