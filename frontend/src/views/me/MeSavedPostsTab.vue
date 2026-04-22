<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { secondReaderService } from '@/services/secondReaderService'
import type { SavedPostDto } from '@/api/types/secondReader'
import { isDemoMode } from '@/config/demoMode'
import { demoSavedPosts } from '@/data/demoMocks'

const list = ref<SavedPostDto[]>([])
const loading = ref(false)
const error = ref('')

const load = async () => {
  if (isDemoMode) {
    list.value = [...demoSavedPosts]
    return
  }
  loading.value = true
  error.value = ''
  try {
    const { data } = await secondReaderService.getSavedPosts()
    list.value = data
  } catch {
    list.value = []
    error.value = '無法載入收藏的貼文。'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  void load()
})
</script>

<template>
  <div>
    <p v-if="error" class="error">{{ error }}</p>
    <p v-else-if="loading && !isDemoMode" class="muted">載入中…</p>
    <p v-else-if="!list.length" class="empty">還沒有收藏的貼文。</p>
    <ul v-else class="list">
      <li v-for="(item, i) in list" :key="`${item.post.id}-${i}`" class="card">
        <p class="author">@{{ item.post.accountId }}</p>
        <h3>{{ item.post.title }}</h3>
        <p class="excerpt">{{ item.post.content }}</p>
        <p class="meta">讚 {{ item.post.likes }} · 留言 {{ item.post.commentCount }}</p>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.error { color: #b91c1c; }
.muted, .empty { color: #6b7280; }
.list { list-style: none; padding: 0; margin: 0; display: grid; gap: 0.75rem; }
.card { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 14px; }
.author { color: #6b7280; font-size: 13px; margin-bottom: 4px; }
h3 { font-weight: 700; margin-bottom: 6px; }
.excerpt { color: #374151; font-size: 14px; }
.meta { color: #9ca3af; font-size: 12px; margin-top: 8px; }
</style>
