<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { secondReaderService } from '@/services/secondReaderService'
import type { NotificationDto } from '@/api/types/secondReader'
import { isDemoMode } from '@/config/demoMode'
import { demoNotifications } from '@/data/demoMocks'

const notifications = ref<NotificationDto[]>([])
const unReadOnly = ref(false)
const loading = ref(false)
const error = ref('')

const fetchNotifications = async () => {
  if (isDemoMode) {
    notifications.value = unReadOnly.value ? demoNotifications.filter((n) => n.unRead) : [...demoNotifications]
    return
  }
  loading.value = true
  error.value = ''
  try {
    const { data } = await secondReaderService.getNotifications(unReadOnly.value)
    notifications.value = data
  } catch {
    error.value = '載入通知失敗'
  } finally {
    loading.value = false
  }
}

const readAll = async () => {
  if (isDemoMode) {
    alert('DEMO：已模擬全部已讀')
    unReadOnly.value = false
    await fetchNotifications()
    return
  }
  try {
    await secondReaderService.readAllNotifications()
    await fetchNotifications()
  } catch {
    alert('全部已讀失敗')
  }
}

onMounted(fetchNotifications)
</script>

<template>
  <section class="page">
    <h1>Notifications</h1>
    <div class="toolbar">
      <label><input v-model="unReadOnly" type="checkbox" /> 只看未讀</label>
      <button @click="fetchNotifications">查詢</button>
      <button @click="readAll">全部已讀</button>
    </div>
    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="loading && !isDemoMode">載入中...</p>
    <ul v-else class="list">
      <li v-for="n in notifications" :key="n.id" class="card">
        <h3>{{ n.title }}</h3>
        <p>{{ n.content }}</p>
        <p>{{ n.notificationType }} | {{ n.unRead ? '未讀' : '已讀' }}</p>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.page { padding: 1rem; }
.toolbar { display: flex; gap: 0.5rem; margin-bottom: 1rem; align-items: center; }
.list { list-style: none; padding: 0; display: grid; gap: 0.75rem; }
.card { border: 1px solid #e5e7eb; border-radius: 8px; padding: 0.75rem; }
.error { color: #b91c1c; }
</style>
