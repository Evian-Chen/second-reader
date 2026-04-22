<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { ElMessage } from 'element-plus'
import { secondReaderService } from '@/services/secondReaderService'
import type { ReadingPostDto, UserBookSummaryDto, UserDto } from '@/api/types/secondReader'
import { useAuthStore } from '@/stores/auth'
import { useDemoDataStore } from '@/stores/demoData'
import { isDemoMode } from '@/config/demoMode'
import { demoPublicProfiles, demoProfileFollowStats, demoBooks, demoMyListedBooks } from '@/data/demoMocks'
import { formatTimeAgo } from '@/utils/timeFormat'
import { encodeRouteGuid } from '@/utils/routeObfuscation'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const demoData = useDemoDataStore()
const { posts: demoPosts } = storeToRefs(demoData)

const accountId = computed(() => String(route.params.accountId ?? ''))

const user = ref<UserDto | null>(null)
const posts = ref<ReadingPostDto[]>([])
const books = ref<UserBookSummaryDto[]>([])
const followerCount = ref(0)
const followingCount = ref(0)
const loading = ref(true)
const error = ref('')
const tab = ref<'posts' | 'books'>('posts')
const isFollowing = ref(false)
const followBusy = ref(false)

const isSelf = computed(
  () => authStore.userProfile && accountId.value === authStore.userProfile.accountId
)

const displayName = computed(() => {
  if (isDemoMode) {
    return demoPublicProfiles[accountId.value]?.displayName ?? accountId.value
  }
  return user.value?.userProfile?.displayName || user.value?.accountId || accountId.value
})

const bio = computed(() => {
  if (isDemoMode) {
    return demoPublicProfiles[accountId.value]?.bio ?? ''
  }
  return user.value?.userProfile?.bio ?? ''
})

const load = async () => {
  const id = accountId.value
  if (!id) {
    error.value = '無效的使用者'
    loading.value = false
    return
  }
  loading.value = true
  error.value = ''
  try {
    if (isDemoMode) {
      user.value = {
        accountId: id,
        email: '',
        isSuspicious: false,
        createdAt: new Date().toISOString(),
        instagramAccount: '',
        threadsAccount: '',
        userProfile: {
          displayName: demoPublicProfiles[id]?.displayName ?? id,
          bio: demoPublicProfiles[id]?.bio ?? '',
        },
      }
      posts.value = demoPosts.value.filter((p) => p.accountId === id)
      books.value = demoBooks.filter((b) => b.sellerAccountId === id)
      if (books.value.length === 0 && id === 'bookworm_ming') {
        books.value = [...demoMyListedBooks]
      }
      const st = demoProfileFollowStats[id]
      followerCount.value = st?.followers ?? 0
      followingCount.value = st?.following ?? 0
      isFollowing.value = true
    } else {
      const [uRes, pRes, bRes, fol, fing] = await Promise.all([
        secondReaderService.getUserByAccountId(id),
        secondReaderService.getPostsByAccountId(id),
        secondReaderService.getBooksByAccountId(id, 'Listed'),
        secondReaderService.getUserFollowers(id),
        secondReaderService.getUserFollowings(id),
      ])
      user.value = uRes.data
      posts.value = pRes.data
      books.value = bRes.data
      followerCount.value = fol.data.length
      followingCount.value = fing.data.length
      await refreshFollow()
    }
  } catch {
    error.value = '無法載入使用者頁面'
  } finally {
    loading.value = false
  }
}

async function refreshFollow() {
  if (isDemoMode || isSelf.value || !authStore.userProfile) {
    isFollowing.value = isDemoMode && !isSelf.value
    return
  }
  try {
    const { data } = await secondReaderService.getUserFollowings(authStore.userProfile.accountId)
    isFollowing.value = data.some((f) => f.followedAccountId === accountId.value)
  } catch {
    isFollowing.value = false
  }
}

const toggleFollow = async () => {
  if (isSelf.value) return
  if (isDemoMode) {
    isFollowing.value = !isFollowing.value
    followerCount.value += isFollowing.value ? 1 : -1
    ElMessage.success(isFollowing.value ? 'DEMO：已追蹤' : 'DEMO：已取消追蹤')
    return
  }
  if (!authStore.isLoggedIn) {
    void router.push('/login')
    return
  }
  followBusy.value = true
  try {
    if (isFollowing.value) {
      await secondReaderService.unfollowUser(accountId.value)
      isFollowing.value = false
      followerCount.value = Math.max(0, followerCount.value - 1)
    } else {
      await secondReaderService.followUser(accountId.value)
      isFollowing.value = true
      followerCount.value += 1
    }
  } catch {
    ElMessage.error('操作失敗')
  } finally {
    followBusy.value = false
  }
}

const goPost = (p: ReadingPostDto) => {
  void router.push({ name: 'post-detail', params: { postId: encodeRouteGuid(p.id) } })
}

const goBook = (bookId: string) => {
  void router.push({ name: 'book-detail', params: { userBookId: encodeRouteGuid(bookId) } })
}

watch(
  () => route.params.accountId,
  () => {
    void load()
  }
)

onMounted(() => {
  void load()
})
</script>

<template>
  <div class="page">
    <button type="button" class="back" @click="router.back()">← 返回</button>

    <p v-if="error" class="err">{{ error }}</p>
    <p v-else-if="loading" class="muted">載入中…</p>

    <template v-else-if="user || isDemoMode">
      <header class="hero">
        <div class="big-av" aria-hidden="true">{{ (displayName || accountId).slice(0, 1) }}</div>
        <div class="hero-text">
          <h1 class="h1">{{ displayName }}</h1>
          <p class="handle">@{{ accountId }}</p>
          <p v-if="bio" class="bio">{{ bio }}</p>
          <div class="stats">
            <span class="s">{{ posts.length }} 貼文</span>
            <span class="s">{{ followerCount }} 粉絲</span>
            <span class="s">{{ followingCount }} 追蹤中</span>
          </div>
        </div>
        <div class="actions">
          <button
            v-if="!isSelf"
            type="button"
            class="follow"
            :disabled="followBusy"
            @click="toggleFollow"
          >
            {{ isFollowing ? (isDemoMode ? '取消追蹤' : '取消追蹤') : '追蹤' }}
          </button>
        </div>
      </header>

      <div class="tabs">
        <button
          type="button"
          :class="['tab', { on: tab === 'posts' }]"
          @click="tab = 'posts'"
        >
          貼文
        </button>
        <button
          type="button"
          :class="['tab', { on: tab === 'books' }]"
          @click="tab = 'books'"
        >
          書籍
        </button>
      </div>

      <ul v-show="tab === 'posts'" class="feed">
        <li
          v-for="p in posts"
          :key="p.id"
          class="pcard"
          @click="goPost(p)"
        >
          <div class="p-row" @click.stop>
            <button
              type="button"
              class="s-av"
              @click="router.push({ name: 'user-profile', params: { accountId: p.accountId } })"
            >
              {{ p.accountId.slice(0, 1).toUpperCase() }}
            </button>
            <div>
              <p class="p-meta">
                <span class="n">{{ displayName }}</span> · {{ formatTimeAgo(p.updatedAt) }}
              </p>
            </div>
          </div>
          <p class="pex">{{ p.content.slice(0, 180) }}{{ p.content.length > 180 ? '…' : '' }}</p>
          <div class="p-foot">
            <span>♥ {{ p.likes }}</span>
            <span>💬 {{ p.commentCount }}</span>
          </div>
        </li>
      </ul>
      <p v-show="tab === 'posts' && !posts.length" class="empty">尚無貼文</p>

      <div v-show="tab === 'books'" class="book-grid">
        <article v-for="b in books" :key="b.userBookId" class="b-card" @click="goBook(b.userBookId)">
          <div class="bc">📕</div>
          <h3 class="bt">{{ b.title }}</h3>
          <p class="ba">{{ b.author }}</p>
          <p class="bp">NT$ {{ b.price }}</p>
        </article>
      </div>
      <p v-show="tab === 'books' && !books.length" class="empty">尚無上架書籍</p>
    </template>
  </div>
</template>

<style scoped>
.page {
  max-width: 720px;
  margin: 0 auto;
  padding: 0 0 2rem;
}
.back {
  border: 0;
  background: none;
  color: #374151;
  font-size: 0.95rem;
  margin-bottom: 0.6rem;
  cursor: pointer;
  padding: 0;
}
.err {
  color: #b91c1c;
}
.muted {
  color: #6b7280;
}
.hero {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem 1.25rem;
  align-items: flex-start;
  margin-bottom: 1rem;
  padding: 0.2rem 0 1rem;
  border-bottom: 1px solid #eee;
}
.big-av {
  width: 80px;
  height: 80px;
  border-radius: 999px;
  background: #e5e7eb;
  display: grid;
  place-items: center;
  font-size: 1.6rem;
  font-weight: 800;
  color: #111827;
  flex-shrink: 0;
}
.hero-text {
  flex: 1;
  min-width: 0;
}
.h1 {
  margin: 0 0 0.15rem;
  font-size: 1.4rem;
  font-weight: 800;
  color: #111827;
}
.handle {
  margin: 0 0 0.35rem;
  color: #9ca3af;
  font-size: 0.9rem;
}
.bio {
  color: #4b5563;
  font-size: 0.92rem;
  line-height: 1.5;
  margin: 0 0 0.5rem;
}
.stats {
  display: flex;
  gap: 1rem;
  font-size: 0.88rem;
  color: #4b5563;
}
.s {
  font-weight: 600;
}
.actions {
  margin-left: auto;
}
.follow {
  border: 1px solid #111827;
  background: #fff;
  color: #111827;
  border-radius: 999px;
  padding: 0.4rem 1rem;
  font-size: 0.88rem;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
}
.tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.9rem;
}
.tab {
  border: 1px solid #e5e7eb;
  background: #fff;
  border-radius: 10px;
  padding: 0.45rem 1rem;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  color: #6b7280;
}
.tab.on {
  border-color: #111827;
  color: #111827;
}
.feed {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.pcard {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 0.9rem 1rem;
  cursor: pointer;
  text-align: left;
}
.p-row {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  margin-bottom: 0.4rem;
}
.s-av {
  width: 32px;
  height: 32px;
  border-radius: 999px;
  background: #f3f4f6;
  font-size: 0.75rem;
  font-weight: 800;
  border: 0;
  cursor: pointer;
  flex-shrink: 0;
}
.p-meta {
  font-size: 0.8rem;
  color: #9ca3af;
  margin: 0;
}
.n {
  color: #111827;
  font-weight: 700;
}
.pex {
  color: #374151;
  font-size: 0.92rem;
  line-height: 1.5;
  margin: 0 0 0.4rem;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.p-foot {
  display: flex;
  gap: 0.8rem;
  font-size: 0.8rem;
  color: #6b7280;
}
.empty {
  color: #9ca3af;
  padding: 0.5rem 0 1rem;
  font-size: 0.92rem;
}
.book-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 0.75rem;
}
.b-card {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 0.65rem;
  background: #fff;
  cursor: pointer;
  text-align: left;
}
.bc {
  height: 100px;
  background: #f3f4f6;
  border-radius: 8px;
  display: grid;
  place-items: center;
  font-size: 1.5rem;
  margin-bottom: 0.4rem;
}
.bt {
  font-size: 0.88rem;
  font-weight: 800;
  margin: 0 0 0.2rem;
  line-height: 1.25;
  color: #111827;
}
.ba {
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0 0 0.2rem;
}
.bp {
  font-size: 0.88rem;
  font-weight: 800;
  margin: 0;
  color: #111827;
}
</style>
