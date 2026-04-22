<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { ElMessage } from 'element-plus'
import { secondReaderService } from '@/services/secondReaderService'
import type { MyWaitlistEntryDto, OrderDto, OrderItemDto } from '@/api/types/secondReader'
import { isDemoMode } from '@/config/demoMode'
import { demoMyWaitingBooks, demoOrders, demoSales } from '@/data/demoMocks'
import { orderItemStatusLabel } from '@/utils/orderDisplay'
import { formatTimeAgo } from '@/utils/timeFormat'
import { encodeRouteGuid } from '@/utils/routeObfuscation'

const tab = ref<'buy' | 'sell' | 'queue'>('buy')
const orders = ref<OrderDto[]>([])
const sales = ref<OrderItemDto[]>([])
const waiting = ref<MyWaitlistEntryDto[]>([])
const loading = ref(false)
const error = ref('')

type FlatLine = {
  id: string
  orderId: string
  createdAt: string
  orderItem: OrderItemDto
}

const buyLines = ref<FlatLine[]>([])

function flattenOrders(ods: OrderDto[]) {
  const lines: FlatLine[] = []
  for (const o of ods) {
    for (const it of o.orderItems) {
      lines.push({ id: it.id, orderId: o.orderId, createdAt: o.createdAt, orderItem: it })
    }
  }
  lines.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  buyLines.value = lines
}

const fetchAll = async () => {
  if (isDemoMode) {
    orders.value = demoOrders
    sales.value = [...demoSales]
    waiting.value = [...demoMyWaitingBooks]
    flattenOrders(demoOrders)
    return
  }
  loading.value = true
  error.value = ''
  try {
    const [oRes, sRes, wRes] = await Promise.all([
      secondReaderService.getOrders(),
      secondReaderService.getSales(),
      secondReaderService.getMyWaitingBooks(),
    ])
    orders.value = oRes.data
    sales.value = sRes.data
    waiting.value = wRes.data
    flattenOrders(oRes.data)
  } catch {
    error.value = '載入失敗，請重新整理。'
  } finally {
    loading.value = false
  }
}

const confirmReceive = async (orderItemId: string) => {
  if (isDemoMode) {
    ElMessage.success('DEMO：已確認收貨')
    return
  }
  try {
    await secondReaderService.completePurchaseOrderItem(orderItemId)
    ElMessage.success('已確認收貨')
    await fetchAll()
  } catch {
    ElMessage.error('操作失敗')
  }
}

const viewDetail = (line: FlatLine) => {
  const it = line.orderItem
  ElMessage.info(`訂單 ${line.orderId.slice(0, 8)}… · ${it.bookTitle} · ${orderItemStatusLabel(it.orderItemStatus)}`)
}

const updateSale = async (id: string, action: 'accept' | 'reject' | 'complete') => {
  if (isDemoMode) {
    ElMessage.info(`DEMO：已模擬 ${action}`)
    return
  }
  try {
    if (action === 'accept') await secondReaderService.acceptSaleItem(id)
    if (action === 'reject') await secondReaderService.rejectSaleItem(id)
    if (action === 'complete') await secondReaderService.completeSaleItem(id)
    await fetchAll()
  } catch {
    ElMessage.error('操作失敗')
  }
}

const formatDate = (iso: string) => {
  try {
    return iso.slice(0, 10)
  } catch {
    return iso
  }
}

onMounted(fetchAll)
</script>

<template>
  <section class="page">
    <header class="head">
      <h1>訂單管理</h1>
      <p class="sub">管理你的購買與銷售訂單</p>
    </header>

    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="loading && !isDemoMode" class="muted">載入中…</p>

    <div v-else class="tabs">
      <button
        type="button"
        :class="['tab', { active: tab === 'buy' }]"
        @click="tab = 'buy'"
      >
        我的購買
      </button>
      <button
        type="button"
        :class="['tab', { active: tab === 'sell' }]"
        @click="tab = 'sell'"
      >
        我的銷售
      </button>
      <button
        type="button"
        :class="['tab', { active: tab === 'queue' }]"
        @click="tab = 'queue'"
      >
        排隊中
      </button>
    </div>

    <ul v-show="tab === 'buy'" class="order-list">
      <li v-for="line in buyLines" :key="line.id" class="row">
        <div class="thumb" aria-hidden="true">📖</div>
        <div class="mid">
          <h3 class="title">{{ line.orderItem.bookTitle }}</h3>
          <p class="muted">賣家：{{ line.orderItem.sellerAccountId }}</p>
          <p class="muted">日期：{{ formatDate(line.createdAt) }} · NT$ {{ line.orderItem.price }}</p>
        </div>
        <div class="right">
          <p class="status">{{ orderItemStatusLabel(line.orderItem.orderItemStatus) }}</p>
          <button
            v-if="line.orderItem.orderItemStatus === 'SellerSent'"
            type="button"
            class="btn primary"
            @click="confirmReceive(line.orderItem.id)"
          >
            確認收貨
          </button>
          <button
            v-else-if="line.orderItem.orderItemStatus === 'Completed'"
            type="button"
            class="btn ghost"
            @click="viewDetail(line)"
          >
            查看詳情
          </button>
        </div>
      </li>
    </ul>

    <p v-show="tab === 'buy' && !buyLines.length" class="empty">目前沒有購買訂單。</p>

    <ul v-show="tab === 'sell'" class="order-list">
      <li v-for="item in sales" :key="item.id" class="row">
        <div class="thumb" aria-hidden="true">📦</div>
        <div class="mid">
          <h3 class="title">{{ item.bookTitle }}</h3>
          <p class="muted">NT$ {{ item.price }} · {{ orderItemStatusLabel(item.orderItemStatus) }}</p>
          <p class="muted">買家選擇：{{ item.buyerPayMethod }} / {{ item.buyerDeliveryMethod }}</p>
        </div>
        <div class="right actions">
          <button
            v-if="item.orderItemStatus === 'Pending'"
            type="button"
            class="btn primary sm"
            @click="updateSale(item.id, 'accept')"
          >
            接受
          </button>
          <button
            v-if="item.orderItemStatus === 'Pending'"
            type="button"
            class="btn ghost sm"
            @click="updateSale(item.id, 'reject')"
          >
            拒絕
          </button>
          <button
            v-if="item.orderItemStatus === 'Accepted' || item.orderItemStatus === 'SellerSent'"
            type="button"
            class="btn primary sm"
            @click="updateSale(item.id, 'complete')"
          >
            標記完成
          </button>
        </div>
      </li>
    </ul>

    <p v-show="tab === 'sell' && !sales.length" class="empty">目前沒有銷售訂單。</p>

    <ul v-show="tab === 'queue'" class="order-list">
      <li v-for="row in waiting" :key="row.userBookId" class="row">
        <div class="thumb" aria-hidden="true">⏱</div>
        <div class="mid">
          <RouterLink
            :to="{ name: 'book-detail', params: { userBookId: encodeRouteGuid(row.userBookId) } }"
            class="book-link"
          >
            <h3 class="title">{{ row.book.title }}</h3>
          </RouterLink>
          <p class="muted">賣家：@{{ row.book.sellerAccountId }}</p>
          <p class="muted">排隊登記：{{ formatTimeAgo(row.queuedAt) }} · NT$ {{ row.book.price }}</p>
        </div>
        <div class="right">
          <p class="status">等待釋出</p>
        </div>
      </li>
    </ul>

    <p v-show="tab === 'queue' && !waiting.length" class="empty">沒有正在排隊的書籍。</p>
  </section>
</template>

<style scoped>
.page {
  max-width: 900px;
  margin: 0 auto;
  padding: 1.5rem 1.25rem 2.5rem;
}
.head h1 {
  font-size: 1.5rem;
  font-weight: 800;
  margin: 0;
}
.sub {
  color: #6b7280;
  font-size: 0.95rem;
  margin: 0.35rem 0 0;
}
.error {
  color: #b91c1c;
  margin: 0.5rem 0;
}
.muted {
  color: #6b7280;
  font-size: 0.9rem;
  margin: 0.2rem 0 0;
}
.empty {
  color: #6b7280;
  padding: 1rem 0;
}
.tabs {
  display: flex;
  gap: 0.5rem;
  margin: 1.25rem 0 1rem;
}
.tab {
  border: 1px solid #d1d5db;
  background: #fff;
  border-radius: 999px;
  padding: 0.45rem 1.1rem;
  font-size: 0.95rem;
  cursor: pointer;
}
.tab.active {
  border-color: #111827;
  color: #111827;
  font-weight: 700;
}
.order-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
}
.row {
  display: grid;
  grid-template-columns: 56px 1fr auto;
  gap: 1rem;
  padding: 1rem 1.1rem;
  align-items: center;
  border-bottom: 1px solid #f3f4f6;
}
.row:last-child {
  border-bottom: none;
}
.thumb {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  background: #f3f4f6;
  display: grid;
  place-items: center;
  font-size: 1.25rem;
}
.title {
  font-size: 1rem;
  font-weight: 700;
  margin: 0 0 0.2rem;
}
.status {
  font-weight: 600;
  font-size: 0.95rem;
  margin: 0 0 0.4rem;
  text-align: right;
  color: #111827;
}
.right {
  text-align: right;
  min-width: 120px;
}
.btn {
  border-radius: 8px;
  padding: 0.45rem 0.9rem;
  font-size: 0.9rem;
  cursor: pointer;
  font-weight: 600;
  border: 1px solid transparent;
}
.btn.sm {
  padding: 0.3rem 0.6rem;
  font-size: 0.8rem;
}
.btn.primary {
  background: #111827;
  color: #fff;
  border-color: #111827;
}
.btn.ghost {
  background: #fff;
  color: #111827;
  border-color: #d1d5db;
}
.actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.4rem;
}
.book-link {
  text-decoration: none;
  color: inherit;
}
.book-link:hover .title {
  color: #5b21b6;
}
</style>
