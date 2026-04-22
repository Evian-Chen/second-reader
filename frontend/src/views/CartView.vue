<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { secondReaderService } from '@/services/secondReaderService'
import type { CartDto, PayMethod, DeliveryMethod, CartItemListingDto } from '@/api/types/secondReader'
import { isDemoMode } from '@/config/demoMode'
import { demoCart } from '@/data/demoMocks'
import {
  payMethodOptions,
  deliveryMethodOptions,
  bookConditionLabel,
} from '@/utils/orderDisplay'

const router = useRouter()

const cart = ref<CartDto | null>(null)
const loading = ref(false)
const error = ref('')
const orderNote = ref('')
const itemSelections = ref<
  Record<string, { payment: '' | PayMethod; delivery: '' | DeliveryMethod }>
>({})
const submitting = ref(false)

const isPay = (m: string): m is PayMethod => m === 'Cash' || m === 'BankTransfer' || m === 'Other'
const isDel = (m: string): m is DeliveryMethod =>
  m === 'FaceToFace' || m === 'Mail' || m === 'ConvenienceStore' || m === 'Other'

function buildEmptySelection() {
  return { payment: '' as const, delivery: '' as const }
}

function initSelections(items: CartItemListingDto[]) {
  const next: typeof itemSelections.value = {}
  for (const it of items) {
    const bp = it.buyerPayMethod
    const bd = it.buyerDeliveryMethod
    const pay = bp && isPay(String(bp)) ? bp : ('' as const)
    const del = bd && isDel(String(bd)) ? bd : ('' as const)
    next[it.userBookId] = { payment: pay, delivery: del }
  }
  itemSelections.value = next
}

const fetchCart = async () => {
  if (isDemoMode) {
    cart.value = { ...demoCart, cartItems: [...demoCart.cartItems] }
    initSelections(cart.value.cartItems)
    return
  }
  loading.value = true
  error.value = ''
  try {
    const { data } = await secondReaderService.getCart()
    cart.value = data
    initSelections(data.cartItems)
  } catch {
    error.value = '取得購物車失敗。'
  } finally {
    loading.value = false
  }
}

const payOptsFor = (item: CartItemListingDto) => {
  const set = item.sellerPayMethods?.filter(isPay)
  if (set?.length) {
    return payMethodOptions.filter((o) => set.includes(o.value))
  }
  return payMethodOptions
}

const delOptsFor = (item: CartItemListingDto) => {
  const set = item.sellerDeliveryMethods?.filter(isDel)
  if (set?.length) {
    return deliveryMethodOptions.filter((o) => set.includes(o.value))
  }
  return deliveryMethodOptions
}

const remove = async (userBookId: string) => {
  if (isDemoMode) {
    if (!cart.value) return
    cart.value = {
      ...cart.value,
      cartItems: cart.value.cartItems.filter((i) => i.userBookId !== userBookId),
    }
    const rest = { ...itemSelections.value }
    delete rest[userBookId]
    itemSelections.value = rest
    return
  }
  try {
    await secondReaderService.removeCartItem(userBookId)
    await fetchCart()
  } catch {
    ElMessage.error('移除失敗')
  }
}

const subtotal = () =>
  (cart.value?.cartItems || []).reduce((acc, item) => acc + item.price, 0)

const validateAndCheckout = async () => {
  const items = cart.value?.cartItems || []
  if (items.length === 0) {
    ElMessage.warning('購物車是空的')
    return
  }
  for (const it of items) {
    const s = itemSelections.value[it.userBookId] || buildEmptySelection()
    if (!s.payment) {
      ElMessage.warning(`請為《${it.book.title}》選擇付款方式。`)
      return
    }
    if (!s.delivery) {
      ElMessage.warning(`請為《${it.book.title}》選擇出貨方式。`)
      return
    }
  }

  const bookMethodsPair: Record<string, { paymentMethod: PayMethod; deliveryMethod: DeliveryMethod }> = {}
  for (const it of items) {
    const s = itemSelections.value[it.userBookId]!
    const p = s.payment
    const d = s.delivery
    if (!p || !d) continue
    bookMethodsPair[it.userBookId] = {
      paymentMethod: p,
      deliveryMethod: d,
    }
  }

  if (isDemoMode) {
    ElMessage.success('DEMO：訂單已送出（未連後端）')
    cart.value = { ...cart.value!, cartItems: [] }
    itemSelections.value = {}
    void router.push({ name: 'orders' })
    return
  }

  submitting.value = true
  try {
    await secondReaderService.checkoutCart({ bookMethodsPair })
    ElMessage.success('訂單已建立')
    orderNote.value = ''
    await fetchCart()
    void router.push({ name: 'orders' })
  } catch {
    ElMessage.error('結帳失敗，請稍後再試。')
  } finally {
    submitting.value = false
  }
}

onMounted(fetchCart)
watch(
  () => cart.value?.cartItems,
  (items) => {
    if (items?.length) initSelections(items)
  },
  { deep: true }
)
</script>

<template>
  <section class="page">
    <button type="button" class="back" @click="router.back()">← 購物車</button>
    <h1>
      購物車 <span class="count">({{ cart?.cartItems?.length || 0 }} 件商品)</span>
    </h1>
    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="loading && !isDemoMode">載入中...</p>
    <div v-else class="layout">
      <div class="main">
        <ul class="list">
          <li v-for="item in cart?.cartItems || []" :key="item.userBookId" class="card">
            <button type="button" class="remove" title="移除此商品" @click="remove(item.userBookId)">🗑</button>
            <div class="book-cover">{{ item.book.title.slice(0, 6) }}</div>
            <div class="body">
              <h3>{{ item.book.title }}</h3>
              <p class="meta">
                {{ item.book.author }} · {{ bookConditionLabel(item.bookCondition || '') }} ·
                賣家：{{ item.sellerAccountId }}
              </p>
              <div class="fields">
                <label class="field"
                  >出貨方式<span class="req">*</span>
                  <select
                    v-model="itemSelections[item.userBookId]!.delivery"
                    class="sel"
                    required
                  >
                    <option value="" disabled>選擇出貨方式</option>
                    <option v-for="o in delOptsFor(item)" :key="o.value" :value="o.value">
                      {{ o.label }}
                    </option>
                  </select>
                </label>
                <label class="field"
                  >付款方式<span class="req">*</span>
                  <select
                    v-model="itemSelections[item.userBookId]!.payment"
                    class="sel"
                  >
                    <option value="" disabled>選擇付款方式</option>
                    <option v-for="o in payOptsFor(item)" :key="o.value" :value="o.value">
                      {{ o.label }}
                    </option>
                  </select>
                </label>
              </div>
            </div>
            <div class="right">
              <p class="price">NT$ {{ item.price }}</p>
            </div>
          </li>
        </ul>
        <div class="note-block">
          <label for="orderNote">訂單備註（選填）</label>
          <textarea
            id="orderNote"
            v-model="orderNote"
            rows="3"
            class="note"
            placeholder="如有特殊需求請在此說明…"
          />
        </div>
      </div>
      <aside class="summary">
        <h3>訂單摘要</h3>
        <p class="line">
          <span>商品小計</span><strong>NT$ {{ subtotal() }}</strong>
        </p>
        <p class="line"><span>運費</span><span class="hint">依出貨方式而定</span></p>
        <hr class="hr" />
        <p class="line total">
          <span>總計</span><strong>NT$ {{ subtotal() }}</strong>
        </p>
        <button
          class="checkout"
          type="button"
          :disabled="!!submitting"
          @click="validateAndCheckout"
        >
          確認下單
        </button>
        <p class="tips-title">💡 小提醒</p>
        <ul class="tips">
          <li>每本書的出貨、付款方式可與賣家約定內容分開填寫。</li>
          <li>下單後尚須待賣家確認，確認後再進行付款與取貨。</li>
          <li>實際運費以您選擇的出貨方式與賣家說明為準。</li>
        </ul>
      </aside>
    </div>
    <p v-if="!loading && (!cart || cart.cartItems.length === 0)">目前購物車沒有商品。</p>
  </section>
</template>

<style scoped>
.page {
  max-width: 1100px;
  margin: 0 auto;
  padding: 1rem 1.25rem 2rem;
}
.back {
  border: none;
  background: none;
  color: #374151;
  font-size: 15px;
  cursor: pointer;
  padding: 0 0 0.5rem;
}
.back:hover {
  text-decoration: underline;
}
h1 {
  font-size: 1.5rem;
  font-weight: 800;
  margin: 0 0 1rem;
}
.count {
  color: #737373;
  font-size: 1rem;
  font-weight: 600;
}
.layout {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 24px;
  align-items: start;
}
.list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 0.75rem;
}
.card {
  position: relative;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #fff;
  padding: 0.85rem 0.9rem 0.85rem 0.9rem;
  display: grid;
  grid-template-columns: 88px 1fr auto;
  gap: 12px;
  align-items: start;
}
.remove {
  position: absolute;
  top: 10px;
  right: 10px;
  border: none;
  background: transparent;
  font-size: 1rem;
  cursor: pointer;
  line-height: 1;
  opacity: 0.7;
}
.remove:hover {
  opacity: 1;
}
.book-cover {
  width: 88px;
  height: 110px;
  border-radius: 8px;
  background: #f3f4f6;
  display: grid;
  place-items: center;
  text-align: center;
  font-weight: 700;
  font-size: 12px;
  color: #374151;
}
.body h3 {
  font-weight: 700;
  font-size: 1rem;
  margin: 0 0 4px;
  padding-right: 2rem;
}
.meta {
  color: #4b5563;
  font-size: 13px;
  margin: 0 0 10px;
}
.fields {
  display: grid;
  gap: 8px;
  max-width: 360px;
}
.field {
  display: grid;
  gap: 4px;
  font-size: 13px;
  color: #111827;
  font-weight: 600;
}
.req {
  color: #b91c1c;
  margin-left: 2px;
}
.sel {
  font-weight: 500;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 8px 10px;
  background: #fff;
}
.right {
  text-align: right;
  padding-top: 0.2rem;
}
.price {
  font-weight: 800;
  font-size: 1.25rem;
  margin: 0;
}
.note-block {
  margin-top: 1rem;
}
.note-block label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 6px;
  color: #111827;
}
.note {
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 10px 12px;
  font: inherit;
  resize: vertical;
  min-height: 72px;
}
.summary {
  position: sticky;
  top: 100px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px 16px 20px;
}
.summary h3 {
  margin: 0 0 12px;
  font-size: 1.1rem;
}
.line {
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
  font-size: 15px;
}
.hint {
  color: #6b7280;
  font-size: 14px;
}
.hr {
  border: 0;
  border-top: 1px solid #e5e7eb;
  margin: 8px 0;
}
.total {
  font-size: 1.1rem;
  font-weight: 700;
}
.checkout {
  width: 100%;
  background: #111827;
  color: #fff;
  border: 1px solid #111827;
  border-radius: 10px;
  padding: 12px 16px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  margin-top: 4px;
}
.checkout:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.tips-title {
  margin: 1rem 0 0.4rem;
  font-size: 14px;
  font-weight: 600;
  color: #111827;
}
.tips {
  margin: 0;
  padding-left: 1.1rem;
  color: #6b7280;
  font-size: 12px;
  line-height: 1.5;
}
.error {
  color: #b91c1c;
}
@media (max-width: 960px) {
  .layout {
    grid-template-columns: 1fr;
  }
  .summary {
    position: static;
  }
  .card {
    grid-template-columns: 72px 1fr;
  }
  .right {
    grid-column: 1 / -1;
    text-align: left;
  }
  .book-cover {
    width: 72px;
    height: 92px;
  }
}
</style>
