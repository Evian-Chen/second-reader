<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { secondReaderService } from '@/services/secondReaderService'
import type { OrderItemDto, UserBookSummaryDto } from '@/api/types/secondReader'
import { isDemoMode } from '@/config/demoMode'
import { demoMyListedBooks, demoSales, demoStoreStats } from '@/data/demoMocks'
import { useAuthStore } from '@/stores/auth'
import { useUiStore } from '@/stores/ui'
import { bookConditionLabel } from '@/utils/orderDisplay'

const authStore = useAuthStore()
const uiStore = useUiStore()

const books = ref<UserBookSummaryDto[]>([])
const sales = ref<OrderItemDto[]>([])
const loading = ref(false)
const error = ref('')

const listed = computed(() => books.value.filter((b) => b.userBookStatus === 'Listed').length)
const completedSales = computed(() => sales.value.filter((s) => s.orderItemStatus === 'Completed'))
const totalRevenue = computed(() => completedSales.value.reduce((a, s) => a + s.price, 0))

const listedForUi = computed(() => {
  const row = books.value.filter((b) => b.userBookStatus === 'Listed')
  if (isDemoMode) {
    return row.length ? row : demoMyListedBooks
  }
  return row
})

const fetchData = async () => {
  const me = authStore.userProfile?.accountId
  if (!me && !isDemoMode) {
    error.value = '請先登入。'
    return
  }
  if (isDemoMode) {
    books.value = [...demoMyListedBooks]
    sales.value = [...demoSales]
    return
  }
  loading.value = true
  error.value = ''
  try {
    const [bRes, sRes] = await Promise.all([
      secondReaderService.getBooksByAccountId(me!, 'Listed'),
      secondReaderService.getSales('Completed'),
    ])
    books.value = bRes.data
    sales.value = sRes.data
  } catch {
    error.value = '載入賣場資料失敗。'
  } finally {
    loading.value = false
  }
}

const listBook = () => {
  if (!isDemoMode && !authStore.isLoggedIn) return
  uiStore.openBookUpload()
}

onMounted(fetchData)
</script>

<template>
  <section class="page">
    <div class="top">
      <div>
        <h1>我的賣場</h1>
        <p class="sub">管理你的二手書上架</p>
      </div>
      <button type="button" class="cta" @click="listBook">+ 上架書籍</button>
    </div>

    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="loading && !isDemoMode" class="muted">載入中…</p>

    <div v-else class="stats">
      <div class="stat">
        <p class="label">上架書籍</p>
        <p class="num">{{ isDemoMode ? demoStoreStats.listed : listed }}</p>
      </div>
      <div class="stat">
        <p class="label">已售出</p>
        <p class="num">{{ isDemoMode ? demoStoreStats.sold : completedSales.length }}</p>
      </div>
      <div class="stat">
        <p class="label">總收益</p>
        <p class="revenue">NT$ {{ isDemoMode ? demoStoreStats.revenue : totalRevenue }}</p>
      </div>
    </div>

    <h2 class="h2">已上架書籍</h2>
    <div class="grid">
      <article v-for="b in listedForUi" :key="b.userBookId" class="card">
        <div class="cover" aria-hidden="true">{{ b.title.slice(0, 4) }}</div>
        <p v-if="b.bookCondition" class="tag">{{ bookConditionLabel(b.bookCondition) }}</p>
        <h3 class="title">{{ b.title }}</h3>
        <p class="author">{{ b.author }}</p>
        <p class="price">NT$ {{ b.price }}</p>
      </article>
    </div>
    <p v-if="!listedForUi.length" class="empty">尚無上架中的書籍，點右上方「上架書籍」開始吧！</p>
  </section>
</template>

<style scoped>
.page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 1.5rem 1.25rem 2.5rem;
}
.top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.5rem;
}
h1 {
  font-size: 1.5rem;
  font-weight: 800;
  margin: 0;
}
.sub {
  color: #6b7280;
  font-size: 0.95rem;
  margin: 0.35rem 0 0;
}
.cta {
  flex-shrink: 0;
  background: #111827;
  color: #fff;
  border: 1px solid #111827;
  border-radius: 999px;
  padding: 0.5rem 1.1rem;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
}
.error {
  color: #b91c1c;
}
.muted {
  color: #6b7280;
}
.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1rem 0;
  border-top: 1px solid #f3f4f4;
  border-bottom: 1px solid #f3f4f4;
}
.stat {
  text-align: center;
}
.label {
  font-size: 0.85rem;
  color: #6b7280;
  margin: 0 0 0.35rem;
}
.num {
  font-size: 1.5rem;
  font-weight: 800;
  margin: 0;
  color: #111827;
}
.revenue {
  font-size: 1.4rem;
  font-weight: 800;
  margin: 0;
  color: #111827;
}
.h2 {
  font-size: 1.1rem;
  font-weight: 800;
  margin: 0 0 0.9rem;
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.25rem;
}
.card {
  position: relative;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 0.75rem;
  background: #fff;
}
.cover {
  aspect-ratio: 3 / 4;
  max-height: 180px;
  border-radius: 8px;
  background: #f3f4f6;
  display: grid;
  place-items: center;
  font-weight: 800;
  color: #374151;
  font-size: 0.9rem;
  text-align: center;
  margin-bottom: 0.5rem;
}
.tag {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 999px;
  padding: 0.1rem 0.45rem;
  font-size: 0.7rem;
  color: #374151;
}
.title {
  font-size: 0.95rem;
  font-weight: 800;
  margin: 0 0 0.2rem;
  line-height: 1.3;
}
.author {
  font-size: 0.8rem;
  color: #6b7280;
  margin: 0 0 0.4rem;
}
.price {
  font-size: 0.95rem;
  font-weight: 800;
  margin: 0;
  color: #111827;
}
.empty {
  color: #6b7280;
  padding: 0.5rem 0 1.5rem;
  font-size: 0.95rem;
}
@media (max-width: 600px) {
  .stats {
    grid-template-columns: 1fr;
    text-align: left;
  }
  .stat {
    text-align: left;
  }
  .top {
    flex-direction: column;
  }
}
</style>
