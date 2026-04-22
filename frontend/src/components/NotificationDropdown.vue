<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { secondReaderService } from '@/services/secondReaderService'
import type { NotificationDto } from '@/api/types/secondReader'
import { isDemoMode } from '@/config/demoMode'
import { demoNotifications } from '@/data/demoMocks'

const props = defineProps<{ open: boolean }>()

const notifications = ref<NotificationDto[]>([])
const unReadOnly = ref(false)
const loading = ref(false)

const displayList = computed(() => {
  if (isDemoMode) {
    return unReadOnly.value ? demoNotifications.filter((n) => n.unRead) : demoNotifications
  }
  return notifications.value
})

const fetchRemote = async () => {
  loading.value = true
  try {
    const { data } = await secondReaderService.getNotifications(unReadOnly.value)
    notifications.value = data
  } finally {
    loading.value = false
  }
}

const readAll = async () => {
  if (isDemoMode) {
    return
  }
  await secondReaderService.readAllNotifications()
  await fetchRemote()
}

const setUnReadTab = (value: boolean) => {
  unReadOnly.value = value
  if (!isDemoMode) {
    void fetchRemote()
  }
}

watch(
  () => props.open,
  (open) => {
    if (!open) {
      return
    }
    if (isDemoMode) {
      return
    }
    void fetchRemote()
  }
)
</script>

<template>
  <div v-if="open" class="panel">
    <div class="head">
      <h4>通知</h4>
      <button type="button" @click="readAll" :disabled="isDemoMode">全部已讀</button>
    </div>
    <div class="tabs">
      <button type="button" :class="{ active: !unReadOnly }" @click="setUnReadTab(false)">全部</button>
      <button type="button" :class="{ active: unReadOnly }" @click="setUnReadTab(true)">未讀</button>
    </div>
    <p v-if="loading && !isDemoMode" class="loading">載入中...</p>
    <ul v-else>
      <li v-for="n in displayList" :key="n.id">
        <p class="title">{{ n.title }}</p>
        <p class="content">{{ n.content }}</p>
        <p class="time">{{ new Date(n.createdAt).toLocaleString() }}</p>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.panel { position: fixed; right: 12px; top: 58px; left: auto; width: min(360px, calc(100vw - 24px)); max-height: min(70vh, 480px); display: flex; flex-direction: column; background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; box-shadow: 0 10px 28px rgba(0,0,0,.12); z-index: 1205; overflow: hidden; }
@media (min-width: 769px) {
  .panel { position: absolute; right: 70px; left: auto; top: 56px; width: 320px; max-height: none; }
}
.head { display: flex; justify-content: space-between; align-items: center; padding: 12px; border-bottom: 1px solid #eee; }
.head h4 { font-weight: 700; }
.head button { border: 0; background: transparent; color: #4b5563; cursor: pointer; }
.head button:disabled { opacity: 0.4; cursor: not-allowed; }
.tabs { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; padding: 10px 12px; border-bottom: 1px solid #eee; }
.tabs button { border: 1px solid #ddd; background: #fff; border-radius: 999px; padding: 6px; cursor: pointer; }
.tabs .active { background: #111827; color: #fff; border-color: #111827; }
ul { list-style: none; margin: 0; padding: 0; flex: 1; min-height: 0; max-height: 100%; overflow: auto; }
li { padding: 10px 12px; border-bottom: 1px solid #f1f1f1; }
.title { font-weight: 700; }
.content { color: #4b5563; }
.time { color: #9ca3af; font-size: 12px; margin-top: 4px; }
.loading { padding: 10px 12px; color: #4b5563; }
</style>
