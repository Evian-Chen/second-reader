<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { ElMessage } from 'element-plus'
import { secondReaderService } from '@/services/secondReaderService'
import type { CartDto, UserBookListinDetailDto, UserBookSummaryDto, WaitlistDto } from '@/api/types/secondReader'
import { useAuthStore } from '@/stores/auth'
import { isDemoMode } from '@/config/demoMode'
import { buildDemoBookDetail, demoBooks, demoSavedBooks } from '@/data/demoMocks'
import { formatTimeAgo } from '@/utils/timeFormat'
import { decodeRouteGuid, encodeRouteGuid } from '@/utils/routeObfuscation'

const conditionLabels: Record<string, string> = {
  New: '全新',
  LikelyNew: '近全新',
  Good: '良好',
  Fair: '普通',
  Poor: '尚可',
  Bad: '不佳',
}

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const routeBookId = computed(() => String(route.params.userBookId ?? ''))
const userBookId = computed(() => decodeRouteGuid(routeBookId.value) ?? '')

const detail = ref<UserBookListinDetailDto | null>(null)
const waitlist = ref<WaitlistDto[]>([])
const cart = ref<CartDto | null>(null)
const savedIds = ref<Set<string>>(new Set())
const relatedBooks = ref<UserBookSummaryDto[]>([])
const loading = ref(true)
const error = ref('')
const actionBusy = ref(false)

const canAct = computed(() => isDemoMode || authStore.isLoggedIn)
const meId = computed(() => authStore.userProfile?.accountId ?? '')

const isOwner = computed(
  () => !!(detail.value && meId.value && detail.value.sellerAccountId === meId.value)
)

const waitingCount = computed(
  () => waitlist.value.filter((w) => w.waitlistStatus === 'Waiting').length
)

const imInQueue = computed(() =>
  waitlist.value.some((w) => w.waiterAccountId === meId.value && w.waitlistStatus === 'Waiting')
)

const inMyCart = computed(() => {
  const id = userBookId.value
  return !!cart.value?.cartItems.some((c) => c.userBookId === id)
})

const isSaved = computed(() => savedIds.value.has(userBookId.value))

const canAddToCart = computed(() => {
  if (!detail.value || !canAct.value || isOwner.value) return false
  if (detail.value.userBookStatus !== 'Listed') return false
  if (inMyCart.value || imInQueue.value) return false
  if (waitingCount.value > 0) return false
  return true
})

const canUseQueue = computed(() => {
  if (!detail.value || !canAct.value || isOwner.value) return false
  if (detail.value.userBookStatus !== 'Listed') return false
  if (inMyCart.value) return false
  return true
})

const queueButtonLabel = computed(() => (imInQueue.value ? '取消排隊' : `加入排隊${waitingCount ? `（${waitingCount}）` : ''}`))

function conditionLabel(code: string) {
  return conditionLabels[code] ?? code
}

async function loadSaved() {
  if (!canAct.value) return
  if (isDemoMode) {
    savedIds.value = new Set(demoSavedBooks.map((s) => s.book.userBookId))
    return
  }
  try {
    const { data } = await secondReaderService.getSavedBooks()
    savedIds.value = new Set(data.map((s) => s.book.userBookId))
  } catch {
    savedIds.value = new Set()
  }
}

async function loadCart() {
  if (!canAct.value) return
  if (isDemoMode) {
    const { demoCart } = await import('@/data/demoMocks')
    cart.value = demoCart
    return
  }
  try {
    const { data } = await secondReaderService.getCart()
    cart.value = data
  } catch {
    cart.value = null
  }
}

async function loadWaitlist() {
  const id = userBookId.value
  if (isDemoMode) {
    if (id.endsWith('1')) {
      waitlist.value = []
    } else {
      waitlist.value = [
        {
          userBookId: id,
          waiterAccountId: 'demo_waiter_1',
          createdAt: new Date().toISOString(),
          waitlistStatus: 'Waiting',
        },
        {
          userBookId: id,
          waiterAccountId: 'demo_waiter_2',
          createdAt: new Date().toISOString(),
          waitlistStatus: 'Waiting',
        },
      ]
    }
    return
  }
  try {
    const { data } = await secondReaderService.getWaitlist(id)
    waitlist.value = data
  } catch {
    waitlist.value = []
  }
}

async function load() {
  const id = userBookId.value
  if (!id) {
    error.value = '無效的書籍'
    loading.value = false
    return
  }
  loading.value = true
  error.value = ''
  try {
    if (isDemoMode) {
      const summary = demoBooks.find((b) => b.userBookId === id)
      if (!summary) {
        error.value = '找不到此書籍'
        detail.value = null
        return
      }
      detail.value = buildDemoBookDetail(summary)
      relatedBooks.value = demoBooks.filter((b) => b.userBookId !== id).slice(0, 6)
    } else {
      const { data } = await secondReaderService.getBookById(id)
      detail.value = data
      const booksRes = await secondReaderService.getBooks(1, 16)
      relatedBooks.value = booksRes.data.filter((b) => b.userBookId !== id).slice(0, 6)
    }
    await Promise.all([loadWaitlist(), loadCart(), loadSaved()])
  } catch {
    error.value = '無法載入書籍'
    detail.value = null
  } finally {
    loading.value = false
  }
}

async function onAddToCart() {
  if (!canAddToCart.value) return
  actionBusy.value = true
  try {
    if (isDemoMode) {
      ElMessage.success('DEMO：已加入購物車')
      return
    }
    await secondReaderService.addToCart(userBookId.value)
    ElMessage.success('已加入購物車')
    await loadCart()
  } catch {
    ElMessage.error('加入購物車失敗（可能已有其他人排隊，或書籍已下架）')
  } finally {
    actionBusy.value = false
  }
}

async function onToggleQueue() {
  if (!imInQueue.value && !canUseQueue.value) return
  actionBusy.value = true
  const add = !imInQueue.value
  try {
    if (isDemoMode) {
      if (add) {
        waitlist.value = [
          ...waitlist.value,
          {
            userBookId: userBookId.value,
            waiterAccountId: meId.value,
            createdAt: new Date().toISOString(),
            waitlistStatus: 'Waiting',
          },
        ]
      } else {
        waitlist.value = waitlist.value.filter(
          (w) => !(w.waiterAccountId === meId.value && w.waitlistStatus === 'Waiting')
        )
      }
      ElMessage.success(add ? 'DEMO：已加入排隊' : 'DEMO：已取消排隊')
      return
    }
    await secondReaderService.toggleWaitlist(userBookId.value, add)
    ElMessage.success(add ? '已加入排隊' : '已取消排隊')
    await Promise.all([loadWaitlist(), loadCart()])
  } catch {
    ElMessage.error('排隊操作失敗')
  } finally {
    actionBusy.value = false
  }
}

async function onToggleSave() {
  if (!canAct.value) {
    ElMessage.warning('請先登入')
    return
  }
  actionBusy.value = true
  const id = userBookId.value
  try {
    if (isDemoMode) {
      if (savedIds.value.has(id)) savedIds.value.delete(id)
      else savedIds.value.add(id)
      ElMessage.success('DEMO：已更新收藏狀態')
      return
    }
    if (savedIds.value.has(id)) {
      await secondReaderService.unsaveBook(id)
      savedIds.value.delete(id)
      ElMessage.success('已取消收藏')
    } else {
      await secondReaderService.saveBook(id)
      savedIds.value.add(id)
      ElMessage.success('已加入收藏')
    }
  } catch {
    ElMessage.error('操作失敗')
  } finally {
    actionBusy.value = false
  }
}

function goStore() {
  if (!detail.value) return
  void router.push({ name: 'user-profile', params: { accountId: detail.value.sellerAccountId } })
}

async function sharePage() {
  const url = window.location.href
  try {
    await navigator.clipboard.writeText(url)
    ElMessage.success('已複製頁面連結')
  } catch {
    ElMessage.info('無法複製，請手動複製網址')
  }
}

onMounted(() => {
  void load()
})
watch(userBookId, () => {
  void load()
})
</script>

<template>
  <section class="page">
    <button type="button" class="back" @click="router.back()">← 返回</button>

    <p v-if="error" class="error">{{ error }}</p>
    <p v-else-if="loading" class="muted">載入中…</p>

    <template v-else-if="detail">
      <div class="grid">
        <div class="visual">
          <div class="cover" aria-hidden="true">
            <span class="cover-text">{{ detail.book.title.slice(0, 20) }}</span>
          </div>
        </div>

        <div class="content">
          <div class="title-row">
            <h1 class="title">{{ detail.book.title }}</h1>
            <button
              type="button"
              class="save-btn"
              :disabled="!canAct"
              :aria-pressed="isSaved"
              :title="!canAct ? '登入以收藏' : isSaved ? '取消收藏' : '收藏'"
              @click="onToggleSave"
            >
              <span v-if="isSaved" class="heart on">♥</span>
              <span v-else class="heart">♡</span>
            </button>
          </div>
          <p class="author">{{ detail.book.author }}</p>
          <div class="tags">
            <span class="tag cond">{{ conditionLabel(detail.bookCondition) }}</span>
            <span class="tag cat">{{ detail.book.bookCategory }}</span>
          </div>
          <p class="price">NT$ {{ detail.price }}</p>

          <div class="seller-card">
            <div class="seller-meta">
              <div class="avatar" aria-hidden="true">{{ detail.sellerAccountId.slice(0, 1) }}</div>
              <div>
                <p class="seller-name">@{{ detail.sellerAccountId }}</p>
                <p class="listed">上架於 {{ formatTimeAgo(detail.createdAt) }}</p>
              </div>
            </div>
            <button type="button" class="btn outline sm" @click="goStore">查看賣場</button>
          </div>

          <h2 class="h2">書籍描述</h2>
          <p class="desc">{{ detail.book.description || '（無補充描述）' }}</p>

          <p class="queue-line">
            <span class="q-icon" aria-hidden="true">≡</span>
            目前 <strong>{{ waitingCount }}</strong> 人排隊中
            <span v-if="inMyCart" class="inline-note">· 你已在購物車保留此書</span>
            <span v-else-if="imInQueue" class="inline-note">· 你正在排隊</span>
          </p>

          <div class="cta-row">
            <button
              type="button"
              class="btn primary wide"
              :disabled="!canAddToCart || actionBusy"
              :title="
                isOwner
                  ? '此為你在賣的書'
                  : waitingCount > 0
                    ? '有人排隊時不可加入購物車'
                    : imInQueue
                      ? '已排隊，請先取消排隊才能加購物車'
                      : ''
              "
              @click="onAddToCart"
            >
              加入購物車
            </button>
            <button
              type="button"
              class="btn primary wide"
              :disabled="!canUseQueue || actionBusy"
              :title="!canAct ? '請先登入' : inMyCart ? '已在購物車' : ''"
              @click="onToggleQueue"
            >
              {{ queueButtonLabel }}
            </button>
            <button type="button" class="btn ghost share" :disabled="actionBusy" @click="sharePage">⎘</button>
          </div>

          <div class="info-banner" role="status">
            <strong>排隊機制</strong>：當此書正被暫訂在他人購物車時，你可以排隊。有人放棄或訂單變更釋出空位時，會依排隊次序遞補。有人排隊期間，其他人無法直接加入購物車。加入購物車與排隊只能擇一。
          </div>
        </div>
      </div>

      <h2 class="h2 section-rec">相關書籍推薦</h2>
      <ul class="rec-grid">
        <li v-for="(b, idx) in relatedBooks" :key="b.userBookId" class="rec-card">
          <RouterLink :to="{ name: 'book-detail', params: { userBookId: encodeRouteGuid(b.userBookId) } }" class="rec-link">
            <div
              class="rec-cover"
              :style="{ background: `hsl(${(idx * 53) % 360} 50% 90%)` }"
            >
              <span class="t">{{ b.title.slice(0, 10) }}</span>
            </div>
            <p class="rec-title">{{ b.title }}</p>
            <p class="rec-price">NT$ {{ b.price }}</p>
          </RouterLink>
        </li>
      </ul>
    </template>
  </section>
</template>

<style scoped>
.page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 1rem 1.1rem 2.5rem;
}
.back {
  border: none;
  background: none;
  color: #4b5563;
  font-size: 0.95rem;
  cursor: pointer;
  margin-bottom: 0.75rem;
  padding: 0.25rem 0;
}
.back:hover {
  color: #111827;
}
.error {
  color: #b91c1c;
}
.muted {
  color: #6b7280;
}
.grid {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: 1fr 1.2fr;
  align-items: start;
}
@media (max-width: 800px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
.visual {
  position: relative;
}
.cover {
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  aspect-ratio: 3/4;
  background: #f9fafb;
  display: grid;
  place-items: center;
  padding: 1rem;
}
.cover-text {
  font-weight: 800;
  text-align: center;
  line-height: 1.3;
  color: #1f2937;
}
.content {
  min-width: 0;
}
.title-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.5rem;
}
.title {
  font-size: 1.5rem;
  font-weight: 800;
  margin: 0;
  line-height: 1.25;
  color: #0f172a;
}
.save-btn {
  border: none;
  background: none;
  cursor: pointer;
  font-size: 1.5rem;
  line-height: 1;
  padding: 0.1rem 0.25rem;
}
.save-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
.heart {
  color: #9ca3af;
}
.heart.on {
  color: #b91c1c;
}
.author {
  color: #52525b;
  margin: 0.35rem 0 0.75rem;
  font-size: 1.05rem;
}
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-bottom: 0.75rem;
}
.tag {
  display: inline-block;
  font-size: 0.8rem;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
}
.tag.cond {
  background: #fef9c3;
  color: #854d0e;
}
.tag.cat {
  background: #f3f4f6;
  color: #374151;
}
.price {
  font-size: 1.75rem;
  font-weight: 800;
  color: #5b21b6;
  margin: 0.25rem 0 1rem;
}
.seller-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 0.75rem 0.9rem;
  background: #fafafa;
  margin-bottom: 1.25rem;
}
.seller-meta {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  min-width: 0;
}
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 999px;
  background: #e5e7eb;
  display: grid;
  place-items: center;
  font-weight: 700;
  color: #374151;
}
.seller-name {
  margin: 0;
  font-weight: 600;
  font-size: 0.95rem;
  word-break: break-all;
}
.listed {
  margin: 0.15rem 0 0;
  font-size: 0.8rem;
  color: #6b7280;
}
.h2 {
  font-size: 1rem;
  font-weight: 700;
  margin: 0 0 0.5rem;
  color: #111827;
}
.desc {
  color: #4b5563;
  line-height: 1.6;
  font-size: 0.95rem;
  margin: 0 0 1rem;
  white-space: pre-wrap;
}
.queue-line {
  color: #374151;
  font-size: 0.9rem;
  margin: 0 0 0.9rem;
}
.q-icon {
  margin-right: 0.25rem;
  opacity: 0.5;
}
.inline-note {
  color: #6b7280;
  font-size: 0.85rem;
}
.cta-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.9rem;
}
.btn {
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid transparent;
}
.btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
.btn.primary {
  background: #111827;
  color: #fff;
  border-color: #111827;
  padding: 0.6rem 1rem;
  font-size: 0.95rem;
}
.btn.wide {
  flex: 1 1 180px;
  min-width: 0;
}
.btn.outline {
  background: #fff;
  color: #111827;
  border-color: #d1d5db;
}
.btn.sm {
  font-size: 0.8rem;
  padding: 0.35rem 0.7rem;
  white-space: nowrap;
}
.btn.ghost {
  background: #fff;
  border-color: #d1d5db;
  color: #111827;
  padding: 0.5rem 0.65rem;
  font-size: 1.1rem;
  line-height: 1;
}
.info-banner {
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 8px;
  padding: 0.65rem 0.8rem;
  font-size: 0.8rem;
  line-height: 1.5;
  color: #57534e;
}
.section-rec {
  margin: 1.75rem 0 0.75rem;
  font-size: 1.05rem;
  font-weight: 700;
  color: #0f172a;
}
.rec-grid {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 0.75rem;
}
.rec-card {
  min-width: 0;
}
.rec-link {
  text-decoration: none;
  color: inherit;
  display: block;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  overflow: hidden;
  background: #fff;
  transition: box-shadow 0.12s;
}
.rec-link:hover {
  box-shadow: 0 2px 10px rgba(15, 23, 42, 0.08);
}
.rec-cover {
  aspect-ratio: 3/4;
  display: grid;
  place-items: center;
  font-size: 11px;
  font-weight: 700;
  text-align: center;
  padding: 4px;
}
.rec-title {
  font-size: 0.8rem;
  font-weight: 600;
  margin: 0.4rem 0.45rem 0.1rem;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.rec-price {
  margin: 0 0.45rem 0.5rem;
  font-size: 0.8rem;
  color: #5b21b6;
  font-weight: 700;
}
</style>
