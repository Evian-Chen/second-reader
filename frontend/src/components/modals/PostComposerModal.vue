<script setup lang="ts">
import { ref, watch } from 'vue'
import { secondReaderService } from '@/services/secondReaderService'
import { isDemoMode } from '@/config/demoMode'
import { useDemoDataStore } from '@/stores/demoData'
import { useUiStore } from '@/stores/ui'

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submitted'): void
}>()

const demoData = useDemoDataStore()
const uiStore = useUiStore()
const title = ref('')
const content = ref('')
const rating = ref(5)
const loading = ref(false)

watch(
  () => props.open,
  (value) => {
    if (value) {
      title.value = ''
      content.value = ''
      rating.value = 5
    }
  }
)

const submit = async () => {
  if (!title.value.trim() || !content.value.trim()) return
  loading.value = true
  try {
    if (isDemoMode) {
      demoData.addPostFromComposer(title.value.trim(), content.value.trim(), rating.value)
      uiStore.bumpPostFeed()
      uiStore.closePostComposer()
      emit('submitted')
      return
    }
    await secondReaderService.createPost({
      title: title.value.trim(),
      content: content.value.trim(),
      rating: rating.value,
    })
    uiStore.bumpPostFeed()
    uiStore.closePostComposer()
    emit('submitted')
  } catch {
    alert('發文失敗')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div v-if="open" class="overlay" @click.self="uiStore.closePostComposer()">
    <section class="modal">
      <div class="head">
        <h3>發布閱讀心得</h3>
        <button @click="uiStore.closePostComposer()">✕</button>
      </div>
      <div class="body">
        <input v-model="title" placeholder="標題" />
        <textarea v-model="content" placeholder="分享你的閱讀心得或推薦..." />
        <input v-model.number="rating" type="number" min="1" max="10" />
      </div>
      <div class="footer">
        <button class="ghost" @click="uiStore.closePostComposer()">取消</button>
        <button class="primary" :disabled="loading" @click="submit">{{ loading ? '發布中...' : '發布貼文' }}</button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.overlay { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.35); display: grid; place-items: center; z-index: 1200; }
.modal { width: min(700px, 92vw); background: #fff; border-radius: 14px; border: 1px solid #e5e7eb; }
.head { display: flex; justify-content: space-between; align-items: center; padding: 14px 16px; border-bottom: 1px solid #eee; }
.head h3 { font-weight: 700; }
.head button { border: 0; background: transparent; cursor: pointer; }
.body { display: grid; gap: 10px; padding: 16px; }
input, textarea { border: 1px solid #ddd; border-radius: 8px; padding: 10px; }
textarea { min-height: 120px; resize: vertical; }
.footer { display: flex; justify-content: flex-end; gap: 8px; padding: 0 16px 16px; }
.footer button { border-radius: 8px; padding: 9px 14px; cursor: pointer; border: 1px solid #ddd; background: #fff; }
.footer .primary { background: #111827; color: #fff; border-color: #111827; }
</style>
