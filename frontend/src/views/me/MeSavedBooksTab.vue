<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { secondReaderService } from '@/services/secondReaderService'
import type { SavedBookDto } from '@/api/types/secondReader'
import { isDemoMode } from '@/config/demoMode'
import { demoSavedBooks } from '@/data/demoMocks'
import { encodeRouteGuid } from '@/utils/routeObfuscation'

const list = ref<SavedBookDto[]>([])
const loading = ref(false)
const error = ref('')

const load = async () => {
  if (isDemoMode) {
    list.value = [...demoSavedBooks]
    return
  }
  loading.value = true
  error.value = ''
  try {
    const { data } = await secondReaderService.getSavedBooks()
    list.value = data
  } catch {
    list.value = []
    error.value = '無法載入收藏的書籍。'
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
    <p v-else-if="!list.length" class="empty">還沒有收藏的書籍。</p>
    <ul v-else class="grid">
      <li v-for="(item, idx) in list" :key="item.book.userBookId" class="card">
        <RouterLink
          class="card-link"
          :to="{ name: 'book-detail', params: { userBookId: encodeRouteGuid(item.book.userBookId) } }"
        >
          <div class="cover" :style="{ background: `hsl(${(idx * 41) % 360} 45% 88%)` }">
            {{ item.book.title.slice(0, 8) }}
          </div>
          <h3>{{ item.book.title }}</h3>
          <p class="sub">{{ item.book.author }}</p>
          <p class="price">NT$ {{ item.book.price }}</p>
          <p class="seller">賣家：@{{ item.book.sellerAccountId }}</p>
        </RouterLink>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.error { color: #b91c1c; }
.muted, .empty { color: #6b7280; }
.grid { list-style: none; padding: 0; margin: 0; display: grid; gap: 1rem; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); }
.card { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 0; overflow: hidden; }
.card-link { display: block; text-decoration: none; color: inherit; padding: 0.75rem; }
.card-link:hover h3 { color: #5b21b6; }
.cover { border-radius: 10px; aspect-ratio: 3/4; display: grid; place-items: center; font-size: 11px; font-weight: 700; text-align: center; padding: 6px; }
h3 { font-weight: 700; font-size: 16px; margin-top: 8px; }
.sub { color: #525252; font-size: 14px; }
.price { font-weight: 600; margin-top: 4px; }
.seller { color: #6b7280; font-size: 12px; margin-top: 4px; }
</style>
