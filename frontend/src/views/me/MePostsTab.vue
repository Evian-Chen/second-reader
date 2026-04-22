<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { secondReaderService } from '@/services/secondReaderService'
import type { ReadingPostDto } from '@/api/types/secondReader'
import { useAuthStore } from '@/stores/auth'
import { useUiStore } from '@/stores/ui'
import { useDemoDataStore } from '@/stores/demoData'
import { isDemoMode } from '@/config/demoMode'

const authStore = useAuthStore()
const uiStore = useUiStore()
const demoData = useDemoDataStore()
const { posts: demoPosts } = storeToRefs(demoData)

const list = ref<ReadingPostDto[]>([])
const loading = ref(false)
const error = ref('')

const accountId = computed(() => authStore.userProfile?.accountId || '')

const load = async () => {
  if (!accountId.value) {
    return
  }
  if (isDemoMode) {
    list.value = demoPosts.value.filter((p) => p.accountId === accountId.value)
    return
  }
  loading.value = true
  error.value = ''
  try {
    const { data } = await secondReaderService.getPostsByAccountId(accountId.value)
    list.value = data
  } catch {
    list.value = []
    error.value = '無法載入你的貼文。'
  } finally {
    loading.value = false
  }
}

watch(
  () => [uiStore.postFeedTick, accountId],
  () => {
    void load()
  }
)

watch(
  () => demoPosts.value,
  () => {
    if (isDemoMode) {
      void load()
    }
  },
  { deep: true }
)

onMounted(() => {
  void load()
})
</script>

<template>
  <div>
    <p v-if="error" class="error">{{ error }}</p>
    <p v-else-if="loading && !isDemoMode" class="muted">載入中…</p>
    <p v-else-if="!list.length" class="empty">還沒有貼文，點擊上方 ✎ 發表第一篇心得吧。</p>
    <ul v-else class="post-list">
      <li v-for="post in list" :key="post.id" class="post-card">
        <h3>{{ post.title }}</h3>
        <p class="excerpt">{{ post.content }}</p>
        <p class="meta">評分 {{ post.rating }} / 10 · 讚 {{ post.likes }} · 留言 {{ post.commentCount }}</p>
        <p class="time">{{ new Date(post.updatedAt).toLocaleString() }}</p>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.error { color: #b91c1c; }
.muted, .empty { color: #6b7280; }
.post-list { list-style: none; padding: 0; margin: 0; display: grid; gap: 0.75rem; }
.post-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 14px; }
.post-card h3 { font-weight: 700; margin-bottom: 8px; }
.excerpt { color: #374151; }
.meta { color: #6b7280; font-size: 13px; margin-top: 6px; }
.time { color: #9ca3af; font-size: 12px; margin-top: 4px; }
</style>
