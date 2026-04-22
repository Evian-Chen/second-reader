<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { ElMessage } from 'element-plus'
import { secondReaderService } from '@/services/secondReaderService'
import type { ReadingPostDto } from '@/api/types/secondReader'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { useUiStore } from '@/stores/ui'
import { useDemoDataStore } from '@/stores/demoData'
import { isDemoMode } from '@/config/demoMode'
import { demoPublicProfiles } from '@/data/demoMocks'
import { formatTimeAgo } from '@/utils/timeFormat'
import { encodeRouteGuid } from '@/utils/routeObfuscation'

const serverPosts = ref<ReadingPostDto[]>([])

const loading = ref(false)
const error = ref('')
const searchQuery = ref('')

const authStore = useAuthStore()
const router = useRouter()
const uiStore = useUiStore()
const demoData = useDemoDataStore()
const { posts: demoPosts } = storeToRefs(demoData)

const canAct = computed(() => isDemoMode || authStore.isLoggedIn)
const displayPosts = computed(() => (isDemoMode ? demoPosts.value : serverPosts.value))

const filteredPosts = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return displayPosts.value
  return displayPosts.value.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.content.toLowerCase().includes(q) ||
      p.accountId.toLowerCase().includes(q)
  )
})

function displayAuthorName(accountId: string) {
  if (isDemoMode) return demoPublicProfiles[accountId]?.displayName || accountId
  return accountId
}

const fetchPosts = async () => {
  if (isDemoMode) {
    return
  }
  loading.value = true
  error.value = ''
  try {
    const { data } = await secondReaderService.getPosts()
    serverPosts.value = data
  } catch {
    error.value = '無法載入貼文。'
  } finally {
    loading.value = false
  }
}

const like = async (e: Event, postId: string, delta: 1 | -1) => {
  e.stopPropagation()
  if (isDemoMode) {
    demoData.bumpPostLike(postId, delta)
    return
  }
  try {
    await secondReaderService.likePost(postId, delta)
    await fetchPosts()
  } catch {
    ElMessage.error('操作失敗')
  }
}

const goPost = (postId: string) => {
  void router.push({ name: 'post-detail', params: { postId: encodeRouteGuid(postId) } })
}

const goProfile = (e: Event, accountId: string) => {
  e.stopPropagation()
  void router.push({ name: 'user-profile', params: { accountId } })
}

watch(
  () => uiStore.postFeedTick,
  () => {
    if (!isDemoMode) {
      void fetchPosts()
    }
  }
)

const openCompose = () => {
  if (!isDemoMode && !authStore.isLoggedIn) {
    void router.push('/login')
    return
  }
  uiStore.openPostComposer()
}

onMounted(() => {
  void fetchPosts()
})
</script>

<template>
  <div class="feed-page">
    <header class="feed-hero">
      <h1>閱讀分享</h1>
      <p class="tagline">寫下心得、交換觀點，與同好一起讀</p>
    </header>

    <div v-if="!isDemoMode && !authStore.isLoggedIn" class="banner soft">
      訪客可瀏覽貼文；點大頭照進入使用者主頁，點貼文內文進入貼文與留言。按讚與發文需登入。
    </div>
    <p v-else-if="isDemoMode" class="banner demo">DEMO 模式：留言與回覆在「開啟貼文」後查看。</p>

    <div class="toolbar">
      <div class="search">
        <span class="search-ico" aria-hidden="true">🔍</span>
        <input
          v-model="searchQuery"
          type="search"
          class="search-input"
          placeholder="搜尋貼文、作者、內文…"
          aria-label="搜尋貼文"
        />
      </div>
    </div>

    <button type="button" class="composer-stub" @click="openCompose">
      <div class="stub-av">{{ (authStore.userProfile?.accountId || '?').slice(0, 1).toUpperCase() }}</div>
      <span class="stub-ph">分享你的閱讀心得…</span>
    </button>

    <p v-if="error" class="err">{{ error }}</p>
    <p v-else-if="loading && !isDemoMode" class="muted">載入中…</p>

    <ul v-else class="feed">
      <li
        v-for="post in filteredPosts"
        :key="post.id"
        class="post"
        @click="goPost(post.id)"
      >
        <div class="post-head" @click.stop>
          <button
            type="button"
            class="av"
            :aria-label="`查看 ${post.accountId} 的主頁`"
            @click="goProfile($event, post.accountId)"
          >
            {{ post.accountId.slice(0, 1).toUpperCase() }}
          </button>
          <div class="post-meta">
            <p class="name" @click="goProfile($event, post.accountId)">
              {{ displayAuthorName(post.accountId) }}
            </p>
            <p class="time">@{{ post.accountId }} · {{ formatTimeAgo(post.updatedAt) }}</p>
          </div>
        </div>
        <h2 class="post-title">{{ post.title }}</h2>
        <p class="post-body">{{ post.content }}</p>
        <div class="chips">
          <span class="chip">⭐ {{ post.rating }} / 10</span>
          <span class="chip">讚 {{ post.likes }}</span>
          <span class="chip">留言 {{ post.commentCount }}</span>
        </div>
        <div class="post-tools" @click.stop>
          <button
            type="button"
            class="tool"
            :disabled="!canAct"
            :title="!canAct ? '此操作需登入' : '按讚'"
            @click="like($event, post.id, 1)"
          >
            讚
          </button>
          <button
            type="button"
            class="tool ghost"
            :disabled="!canAct"
            :title="!canAct ? '此操作需登入' : '收回讚'"
            @click="like($event, post.id, -1)"
          >
            收回
          </button>
          <button type="button" class="tool primary" @click="goPost(post.id)">
            查看貼文與留言
            <span v-if="post.commentCount" class="cc">({{ post.commentCount }})</span>
          </button>
        </div>
      </li>
    </ul>

    <p v-if="!loading && filteredPosts.length === 0" class="empty">沒有符合的貼文。</p>
  </div>
</template>

<style scoped>
.feed-page {
  max-width: 640px;
  margin: 0 auto;
  padding: 0 0 2.5rem;
}
.feed-hero h1 {
  font-size: 1.75rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: #111827;
  margin: 0 0 0.25rem;
}
.tagline {
  color: #6b7280;
  font-size: 0.95rem;
  margin: 0 0 1.25rem;
}
.banner {
  font-size: 0.9rem;
  padding: 0.65rem 0.9rem;
  border-radius: 10px;
  margin-bottom: 1rem;
}
.banner.soft {
  background: #eff6ff;
  color: #1d4ed8;
  border: 1px solid #bfdbfe;
}
.banner.demo {
  background: #ecfdf5;
  color: #047857;
  border: 1px solid #a7f3d0;
}
.toolbar {
  margin-bottom: 0.9rem;
}
.search {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 999px;
  padding: 0.2rem 0.75rem 0.2rem 0.6rem;
}
.search-ico {
  opacity: 0.5;
  font-size: 0.95rem;
}
.search-input {
  flex: 1;
  min-width: 0;
  border: 0;
  background: transparent;
  padding: 0.5rem 0.2rem;
  font-size: 0.95rem;
  outline: none;
}
.composer-stub {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  text-align: left;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 0.75rem 0.9rem;
  margin-bottom: 1.1rem;
  cursor: pointer;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.composer-stub:hover {
  border-color: #111827;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
}
.stub-av {
  width: 40px;
  height: 40px;
  border-radius: 999px;
  background: #e5e7eb;
  color: #374151;
  font-weight: 800;
  display: grid;
  place-items: center;
  font-size: 0.9rem;
}
.stub-ph {
  color: #9ca3af;
  font-size: 0.95rem;
}
.err {
  color: #b91c1c;
  margin: 0.5rem 0;
}
.muted {
  color: #6b7280;
}
.feed {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.post {
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 16px;
  padding: 1.15rem 1.2rem 1rem;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.04);
  cursor: pointer;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.post:hover {
  border-color: #d1d5db;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.05);
}
.post-head {
  display: flex;
  gap: 0.7rem;
  align-items: center;
  margin-bottom: 0.75rem;
}
.av {
  width: 42px;
  height: 42px;
  border-radius: 999px;
  background: linear-gradient(145deg, #f3f4f6, #e5e7eb);
  color: #111827;
  font-weight: 800;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  font-size: 1.05rem;
  border: 0;
  cursor: pointer;
  padding: 0;
  font: inherit;
}
.post-meta {
  min-width: 0;
  text-align: left;
}
.post-meta .name {
  font-weight: 800;
  font-size: 0.95rem;
  margin: 0;
  color: #111827;
  cursor: pointer;
  text-align: left;
  display: block;
  background: none;
  border: 0;
  padding: 0;
  font: inherit;
}
.post-meta .time {
  font-size: 0.8rem;
  color: #9ca3af;
  margin: 0.1rem 0 0;
}
.post-title {
  font-size: 1.2rem;
  font-weight: 800;
  line-height: 1.35;
  margin: 0 0 0.5rem;
  color: #111827;
  letter-spacing: -0.02em;
}
.post-body {
  color: #374151;
  font-size: 0.95rem;
  line-height: 1.7;
  margin: 0 0 0.9rem;
  white-space: pre-wrap;
  word-break: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 6;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-bottom: 0.6rem;
}
.chip {
  background: #f3f4f6;
  color: #4b5563;
  font-size: 0.8rem;
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
}
.post-tools {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  border-top: 1px solid #f3f4f6;
  padding-top: 0.6rem;
}
.tool {
  border: 1px solid #e5e7eb;
  background: #fff;
  color: #374151;
  font-size: 0.88rem;
  font-weight: 600;
  border-radius: 999px;
  padding: 0.35rem 0.8rem;
  cursor: pointer;
  font: inherit;
}
.tool:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.tool.ghost {
  color: #6b7280;
}
.tool.primary {
  border-color: #111827;
  color: #111827;
}
.cc {
  font-weight: 500;
  opacity: 0.85;
}
.empty {
  text-align: center;
  color: #9ca3af;
  padding: 1.5rem 0.5rem;
  font-size: 0.95rem;
}
</style>
