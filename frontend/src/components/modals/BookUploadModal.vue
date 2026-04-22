<script setup lang="ts">
import { reactive, ref, useTemplateRef, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { secondReaderService } from '@/services/secondReaderService'
import { useAuthStore } from '@/stores/auth'
import { useUiStore } from '@/stores/ui'
import { isDemoMode } from '@/config/demoMode'
import type { GoogleBookResultDto, UploadUserBookPayload } from '@/api/types/secondReader'

const props = defineProps<{ open: boolean }>()

const emit = defineEmits<{ (e: 'close'): void; (e: 'submitted'): void }>()

const authStore = useAuthStore()
const uiStore = useUiStore()
const loading = ref(false)
const ocrLoading = ref(false)
const fileInputRef = useTemplateRef<HTMLInputElement>('fileInput')
const lastPreviewUrl = ref<string | null>(null)
const selectedFileName = ref('')

const form = reactive({
  title: '',
  author: '',
  isbn: '',
  description: '',
  price: 200,
  bookCondition: 'Good' as UploadUserBookPayload['bookCondition'],
  category: 'Mandarin',
  payMethods: ['Cash'] as UploadUserBookPayload['sellerPayMethods'],
  deliveryMethods: ['FaceToFace'] as UploadUserBookPayload['sellerDeliveryMethods'],
})

function clearPreview() {
  if (lastPreviewUrl.value) {
    URL.revokeObjectURL(lastPreviewUrl.value)
    lastPreviewUrl.value = null
  }
}

function normalizeGooglePayload(raw: unknown): GoogleBookResultDto {
  const o = raw as Record<string, unknown> & { Title?: string; Authors?: string[]; ISBN?: string; PreviewLink?: string }
  const authors = (o.authors ?? o.Authors ?? []) as string[]
  return {
    title: String(o.title ?? o.Title ?? ''),
    authors: Array.isArray(authors) ? authors : [],
    isbn: String(o.isbn ?? o.ISBN ?? ''),
    previewLink: String(o.previewLink ?? o.PreviewLink ?? ''),
  }
}

function applyGoogleResult(data: GoogleBookResultDto) {
  form.title = data.title || form.title
  const authors = data.authors?.length ? data.authors.join('、') : ''
  if (authors) form.author = authors
  if (data.isbn) form.isbn = data.isbn.replace(/[-\s]/g, '')
  if (data.previewLink) {
    const line = `參考（Google Books）：${data.previewLink}`
    if (!form.description.trim()) {
      form.description = line
    } else {
      form.description = `${form.description.trim()}\n\n${line}`
    }
  }
}

const toggleValue = <T extends string>(arr: T[], value: T) => {
  const idx = arr.indexOf(value)
  if (idx >= 0) arr.splice(idx, 1)
  else arr.push(value)
}

const triggerPickImage = () => {
  if (ocrLoading.value || loading.value) return
  fileInputRef.value?.click()
}

const onFileInputChange = (ev: Event) => {
  const input = ev.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  if (!file.type.startsWith('image/')) {
    ElMessage.warning('請選擇圖片檔案。')
    return
  }
  selectedFileName.value = file.name
  clearPreview()
  lastPreviewUrl.value = URL.createObjectURL(file)
  void runPrefillFromImage(file, input)
}

const runPrefillFromImage = async (file: File, input: HTMLInputElement) => {
  ocrLoading.value = true
  try {
    if (isDemoMode) {
      await new Promise((r) => setTimeout(r, 700))
      applyGoogleResult({
        title: 'DEMO《自動填寫的書名》',
        authors: ['示範作者甲', '示範作者乙'],
        isbn: '9789570000000',
        previewLink: 'https://books.google.com/',
      })
      ElMessage.success('DEMO：已模擬辨識並帶入欄位')
    } else {
      const { data } = await secondReaderService.prefillBookFromIsbnImage(file)
      applyGoogleResult(normalizeGooglePayload(data))
      ElMessage.success('已從圖片辨識 ISBN 並帶入書目，請再檢查後上架')
    }
  } catch (e) {
    ElMessage.error(
      isDemoMode
        ? 'DEMO 預填失敗'
        : '無法從圖片辨識 ISBN 或查無書目，可改用手動輸入。'
    )
  } finally {
    ocrLoading.value = false
    input.value = ''
  }
}

watch(
  () => props.open,
  (open) => {
    if (!open) {
      clearPreview()
      selectedFileName.value = ''
    }
  }
)

const submit = async () => {
  if (isDemoMode) {
    ElMessage.success('DEMO：已模擬上架（未連後端）')
    uiStore.closeBookUpload()
    emit('submitted')
    return
  }
  if (!authStore.userProfile) return
  if (!form.title.trim() || !form.author.trim()) {
    ElMessage.warning('請填寫書名與作者。')
    return
  }
  loading.value = true
  try {
    const payload: UploadUserBookPayload = {
      bookCondition: form.bookCondition,
      sellerPayMethods: form.payMethods.length ? form.payMethods : ['Cash'],
      sellerDeliveryMethods: form.deliveryMethods.length ? form.deliveryMethods : ['FaceToFace'],
      price: form.price,
      userBookStatus: 'Listed',
      createdAt: new Date().toISOString(),
      book: {
        isbn: form.isbn,
        title: form.title,
        author: form.author,
        description: form.description,
        bookCategory: form.category,
        userBookStatus: 'Listed',
        sellerAccountId: authStore.userProfile.accountId,
        price: form.price,
      },
    }
    await secondReaderService.uploadBooks([payload])
    ElMessage.success('上架成功')
    emit('submitted')
    uiStore.closeBookUpload()
  } catch {
    ElMessage.error('上架失敗，請稍後再試。')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div v-if="open" class="overlay" @click.self="uiStore.closeBookUpload()">
    <section class="modal" role="dialog" aria-modal="true" aria-labelledby="book-upload-title">
      <div class="head">
        <h3 id="book-upload-title">上架二手書</h3>
        <button type="button" class="x" aria-label="關閉" @click="uiStore.closeBookUpload()">✕</button>
      </div>
      <div class="body">
        <div class="scan">
          <p class="scan-title">從照片自動填寫</p>
          <p class="scan-desc">
            上傳含 <strong>ISBN 條碼</strong> 的書背、封底或條碼特寫。後端會以 OCR
            讀出 ISBN，再向 Google Books 查回書名與作者（需登入）。
          </p>
          <input
            ref="fileInput"
            type="file"
            class="sr-only"
            accept="image/*"
            capture="environment"
            :disabled="ocrLoading || loading"
            @change="onFileInputChange"
          />
          <div class="scan-row">
            <button
              type="button"
              class="scan-btn"
              :disabled="ocrLoading || loading"
              @click="triggerPickImage"
            >
              <span v-if="ocrLoading" class="spin" aria-hidden="true" />
              <span v-else class="icon" aria-hidden="true">📷</span>
              {{ ocrLoading ? '辨識中…' : '選擇照片' }}
            </button>
            <span v-if="selectedFileName" class="fn">{{ selectedFileName }}</span>
          </div>
          <div v-if="lastPreviewUrl" class="thumb">
            <img :src="lastPreviewUrl" alt="預覽" />
          </div>
        </div>

        <p class="divider">或手動填寫</p>

        <div class="grid">
          <input v-model="form.title" placeholder="書名 *" :disabled="loading" />
          <input v-model="form.author" placeholder="作者 *" :disabled="loading" />
          <input v-model="form.isbn" placeholder="ISBN" :disabled="loading" />
          <input v-model.number="form.price" type="number" min="1" placeholder="價格 (NT$) *" :disabled="loading" />
        </div>
        <textarea
          v-model="form.description"
          placeholder="書籍描述（可含品相、版本說明等）"
          :disabled="loading"
        />
        <div class="grid">
          <select v-model="form.bookCondition" :disabled="loading">
            <option value="New">全新</option>
            <option value="LikelyNew">近全新</option>
            <option value="Good">良好</option>
            <option value="Fair">普通</option>
            <option value="Poor">差</option>
            <option value="Bad">很差</option>
          </select>
          <input
            v-model="form.category"
            placeholder="分類（Mandarin / World …）"
            :disabled="loading"
          />
        </div>
        <div class="group">
          <p>出貨方式</p>
          <label
            ><input
              type="checkbox"
              :disabled="loading"
              :checked="form.deliveryMethods.includes('Mail')"
              @change="toggleValue(form.deliveryMethods, 'Mail')"
            />
            郵寄</label
          >
          <label
            ><input
              type="checkbox"
              :disabled="loading"
              :checked="form.deliveryMethods.includes('FaceToFace')"
              @change="toggleValue(form.deliveryMethods, 'FaceToFace')"
            />
            面交</label
          >
          <label
            ><input
              type="checkbox"
              :disabled="loading"
              :checked="form.deliveryMethods.includes('ConvenienceStore')"
              @change="toggleValue(form.deliveryMethods, 'ConvenienceStore')"
            />
            超商取貨</label
          >
        </div>
        <div class="group">
          <p>付款方式</p>
          <label
            ><input
              type="checkbox"
              :disabled="loading"
              :checked="form.payMethods.includes('Cash')"
              @change="toggleValue(form.payMethods, 'Cash')"
            />
            現金</label
          >
          <label
            ><input
              type="checkbox"
              :disabled="loading"
              :checked="form.payMethods.includes('BankTransfer')"
              @change="toggleValue(form.payMethods, 'BankTransfer')"
            />
            銀行轉帳</label
          >
          <label
            ><input
              type="checkbox"
              :disabled="loading"
              :checked="form.payMethods.includes('Other')"
              @change="toggleValue(form.payMethods, 'Other')"
            />
            其他</label
          >
        </div>
      </div>
      <div class="footer">
        <button type="button" class="ghost" :disabled="loading || ocrLoading" @click="uiStore.closeBookUpload()">
          取消
        </button>
        <button type="button" class="primary" :disabled="loading || ocrLoading" @click="submit">
          {{ loading ? '上架中...' : '上架書籍' }}
        </button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: grid;
  place-items: center;
  z-index: 1200;
  padding: 12px;
}
.modal {
  width: min(820px, 100%);
  background: #fff;
  border-radius: 14px;
  border: 1px solid #e5e7eb;
  max-height: 92vh;
  overflow: auto;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.12);
}
.head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  border-bottom: 1px solid #eee;
  position: sticky;
  top: 0;
  background: #fff;
  z-index: 1;
}
.head h3 {
  font-weight: 800;
  font-size: 1.1rem;
  margin: 0;
  color: #111827;
}
.x {
  border: 0;
  background: transparent;
  cursor: pointer;
  font-size: 1.2rem;
  line-height: 1;
  color: #6b7280;
  padding: 4px 8px;
  border-radius: 8px;
}
.x:hover {
  background: #f3f4f6;
  color: #111827;
}
.body {
  padding: 16px;
  display: grid;
  gap: 12px;
}
.scan {
  border: 1px dashed #c4c4c4;
  border-radius: 12px;
  padding: 14px 14px 12px;
  background: #fafafa;
}
.scan-title {
  font-weight: 800;
  font-size: 0.95rem;
  margin: 0 0 0.4rem;
  color: #111827;
}
.scan-desc {
  font-size: 0.86rem;
  line-height: 1.5;
  color: #4b5563;
  margin: 0 0 0.75rem;
}
.scan-desc strong {
  color: #111827;
}
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
.scan-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem 1rem;
}
.scan-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  border: 1px solid #111827;
  background: #111827;
  color: #fff;
  border-radius: 999px;
  padding: 0.5rem 1.1rem;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
}
.scan-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.icon {
  font-size: 1rem;
}
.fn {
  font-size: 0.82rem;
  color: #6b7280;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.thumb {
  margin-top: 10px;
  max-width: 200px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
}
.thumb img {
  display: block;
  width: 100%;
  height: auto;
  vertical-align: middle;
}
.spin {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: sp 0.7s linear infinite;
}
@keyframes sp {
  to {
    transform: rotate(360deg);
  }
}
.divider {
  text-align: center;
  font-size: 0.8rem;
  color: #9ca3af;
  margin: 0.1rem 0 0.2rem;
  position: relative;
}
.divider::before,
.divider::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 38%;
  height: 1px;
  background: #e5e7eb;
}
.divider::before {
  left: 0;
}
.divider::after {
  right: 0;
}
.grid {
  display: grid;
  gap: 10px;
  grid-template-columns: 1fr 1fr;
}
input,
textarea,
select {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  font: inherit;
}
textarea {
  min-height: 90px;
  resize: vertical;
  line-height: 1.55;
}
.group {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}
.group p {
  font-weight: 700;
  margin-right: 6px;
  min-width: 4rem;
  font-size: 0.9rem;
}
.footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 0 16px 16px;
  position: sticky;
  bottom: 0;
  background: linear-gradient(180deg, transparent, #fff 12px);
  padding-top: 8px;
}
.footer button {
  border-radius: 8px;
  padding: 9px 16px;
  cursor: pointer;
  border: 1px solid #ddd;
  background: #fff;
  font-weight: 600;
}
.footer .primary {
  background: #111827;
  color: #fff;
  border-color: #111827;
}
@media (max-width: 720px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
