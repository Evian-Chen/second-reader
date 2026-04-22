<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { secondReaderService } from '@/services/secondReaderService'
import type { UserBookSummaryDto } from '@/api/types/secondReader'
import { useAuthStore } from '@/stores/auth'
import { isDemoMode } from '@/config/demoMode'
import { demoMyListedBooks } from '@/data/demoMocks'

const authStore = useAuthStore()
const list = ref<UserBookSummaryDto[]>([])
const loading = ref(false)
const error = ref('')

const accountId = computed(() => authStore.userProfile?.accountId || '')

const load = async () => {
  if (!accountId.value) {
    return
  }
  if (isDemoMode) {
    list.value = demoMyListedBooks.filter((b) => b.sellerAccountId === accountId.value)
    return
  }
  loading.value = true
  error.value = ''
  try {
    const { data } = await secondReaderService.getBooksByAccountId(accountId.value)
    list.value = data
  } catch {
    list.value = []
    error.value = '無法載入你上架的書籍。'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  void load()
})
</script>

<template>
  <div>
    <p v-if="error" class="error">{{ error }}</p>
    <p v-else-if="loading && !isDemoMode" class="muted">載入中…</p>
    <p v-else-if="!list.length" class="empty">尚未上架任何書籍。點擊導覽列 ⊞ 即可上架二手書。</p>
    <ul v-else class="grid">
      <li v-for="(book, idx) in list" :key="book.userBookId" class="card">
        <div class="cover" :style="{ background: `hsl(${(idx * 47) % 360} 50% 90%)` }">
          <span class="title-short">{{ book.title.slice(0, 12) }}</span>
        </div>
        <h3>{{ book.title }}</h3>
        <p class="sub">{{ book.author }}</p>
        <p class="price">NT$ {{ book.price }} · {{ book.userBookStatus }}</p>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.error { color: #b91c1c; }
.muted, .empty { color: #6b7280; }
.grid { list-style: none; padding: 0; margin: 0; display: grid; gap: 1rem; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); }
.card { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 0.75rem; }
.cover { border-radius: 10px; aspect-ratio: 3/4; display: grid; place-items: center; text-align: center; padding: 6px; font-size: 12px; font-weight: 600; }
.title-short { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
h3 { font-weight: 700; font-size: 16px; margin-top: 8px; }
.sub { color: #525252; font-size: 14px; }
.price { font-weight: 600; margin-top: 4px; font-size: 14px; }
</style>
