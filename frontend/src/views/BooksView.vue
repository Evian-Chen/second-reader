<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { secondReaderService } from '@/services/secondReaderService'
import type { UserBookSummaryDto } from '@/api/types/secondReader'
import { useAuthStore } from '@/stores/auth'
import { isDemoMode } from '@/config/demoMode'
import { demoBooks } from '@/data/demoMocks'
import { encodeRouteGuid } from '@/utils/routeObfuscation'

const books = ref<UserBookSummaryDto[]>([])
const keyword = ref('')
const loading = ref(false)
const error = ref('')
const authStore = useAuthStore()

const fetchBooks = async () => {
  if (isDemoMode) {
    books.value = [...demoBooks]
    return
  }
  loading.value = true
  error.value = ''
  try {
    const { data } = await secondReaderService.getBooks()
    books.value = data
  } catch {
    error.value = '取得書籍失敗，請檢查 API 或 token。'
  } finally {
    loading.value = false
  }
}

const searchBooks = async () => {
  if (isDemoMode) {
    if (!keyword.value.trim()) {
      books.value = [...demoBooks]
      return
    }
    const k = keyword.value.trim().toLowerCase()
    books.value = demoBooks.filter(
      (b) => b.title.toLowerCase().includes(k) || b.author.toLowerCase().includes(k) || b.isbn.includes(k)
    )
    return
  }
  if (!keyword.value.trim()) {
    await fetchBooks()
    return
  }
  loading.value = true
  error.value = ''
  try {
    const { data } = await secondReaderService.searchBooks(keyword.value.trim())
    books.value = data
  } catch {
    error.value = '搜尋失敗，請稍後再試。'
  } finally {
    loading.value = false
  }
}

onMounted(fetchBooks)
</script>

<template>
  <section class="page">
    <div class="search-bar">
      <input v-model="keyword" placeholder="搜尋書名、作者..." @keyup.enter="searchBooks" />
      <button type="button" @click="searchBooks">篩選</button>
    </div>
    <p v-if="!isDemoMode && !authStore.isLoggedIn" class="hint">訪客可瀏覽市集，點進書籍可加入購物車、排隊或收藏（需先登入）。</p>
    <p v-else-if="isDemoMode" class="demo-hint">DEMO 模式：點擊卡片進入書籍頁。</p>
    <div class="toolbar">
      <button type="button" class="secondary" @click="fetchBooks">重設</button>
    </div>
    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="loading && !isDemoMode">載入中...</p>
    <ul v-else class="list">
      <li v-for="(book, idx) in books" :key="book.userBookId" class="card">
        <RouterLink
          class="card-link"
          :to="{ name: 'book-detail', params: { userBookId: encodeRouteGuid(book.userBookId) } }"
        >
          <div class="cover" :style="{ background: `hsl(${(idx * 47) % 360} 65% 88%)` }">
            <span>{{ book.title.slice(0, 14) }}</span>
          </div>
          <div class="meta">
            <h3>{{ book.title }}</h3>
            <p class="sub">{{ book.author }}</p>
            <p class="price">NT$ {{ book.price }}</p>
            <p class="status">{{ book.userBookStatus }}</p>
            <p class="open">點擊檢視詳情 →</p>
          </div>
        </RouterLink>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.page { padding: 1rem; }
.search-bar { display: flex; gap: 0.5rem; margin-bottom: 1rem; }
.toolbar { display: flex; justify-content: flex-end; margin-bottom: 0.75rem; }
input { flex: 1; padding: 0.75rem; border: 1px solid #e5e7eb; border-radius: 999px; }
button { padding: 0.6rem 0.9rem; border: 1px solid #ddd; background: #fff; border-radius: 8px; }
.secondary { background: #f3f4f6; }
.error { color: #b91c1c; }
.hint { color: #1d4ed8; margin-bottom: 0.75rem; }
.demo-hint { color: #047857; margin-bottom: 0.75rem; }
.list { list-style: none; padding: 0; display: grid; gap: 1rem; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); }
.card { border: 1px solid #e5e7eb; border-radius: 12px; padding: 0; background: #fff; overflow: hidden; }
.card-link { display: block; text-decoration: none; color: inherit; padding: 0.75rem; }
.card-link:hover .open { color: #5b21b6; }
.cover { border-radius: 10px; aspect-ratio: 3/4; display: grid; place-items: center; color: #111; font-weight: 700; text-align: center; padding: 8px; }
.meta h3 { font-weight: 700; font-size: 18px; }
.sub { color: #525252; }
.price { font-weight: 700; margin-top: 4px; }
.status { color: #737373; font-size: 13px; }
.open { color: #6b7280; font-size: 12px; margin-top: 0.4rem; }
</style>
