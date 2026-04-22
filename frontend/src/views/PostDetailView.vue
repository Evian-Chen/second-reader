<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { ElMessage } from 'element-plus'
import { secondReaderService } from '@/services/secondReaderService'
import type { CommentDto, ReadingPostDto, UserBookSummaryDto, UserDto } from '@/api/types/secondReader'
import { useAuthStore } from '@/stores/auth'
import { useDemoDataStore } from '@/stores/demoData'
import { isDemoMode } from '@/config/demoMode'
import { demoBooks, demoPublicProfiles } from '@/data/demoMocks'
import { formatTimeAgo } from '@/utils/timeFormat'
import { decodeRouteGuid, encodeRouteGuid } from '@/utils/routeObfuscation'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const demoData = useDemoDataStore()
const { posts: demoPosts, demoPostRoots, demoPostReplies } = storeToRefs(demoData)

const post = ref<ReadingPostDto | null>(null)
const authorProfile = ref<UserDto | null>(null)
const loading = ref(true)
const error = ref('')

const rootComments = ref<CommentDto[]>([])
const childComments = ref<CommentDto[]>([])
const expandedRepliesForRoot = ref<string | null>(null)
const newComment = ref('')
const replyOpenFor = ref<string | null>(null)
const replyText = ref('')

const isFollowing = ref(false)
const followBusy = ref(false)

const routePostId = computed(() => String(route.params.postId ?? ''))
const postId = computed(() => decodeRouteGuid(routePostId.value) ?? '')

const canAct = computed(() => isDemoMode || authStore.isLoggedIn)
const isSelf = computed(
  () => authStore.userProfile && post.value?.accountId === authStore.userProfile.accountId
)

const displayName = computed(() => {
  if (isDemoMode && post.value) {
    return demoPublicProfiles[post.value.accountId]?.displayName ?? post.value.accountId
  }
  return authorProfile.value?.userProfile?.displayName || post.value?.accountId || '—'
})

const embeddedBook = computed<UserBookSummaryDto | null>(() => {
  if (!post.value) return null
  const text = `${post.value.title} ${post.value.content}`.toLowerCase()
  return (
    demoBooks.find((b) => text.includes(b.title.toLowerCase()) || text.includes(b.author.toLowerCase())) ?? null
  )
})

const goEmbeddedBook = () => {
  const b = embeddedBook.value
  if (!b) {
    void router.push({ name: 'books' })
    return
  }
  void router.push({ name: 'book-detail', params: { userBookId: encodeRouteGuid(b.userBookId) } })
}

function makeComment(
  o: Pick<CommentDto, 'id' | 'content' | 'postId' | 'rootId'> & Partial<CommentDto>
): CommentDto {
  return {
    id: o.id,
    content: o.content,
    isDeleted: false,
    createdAt: o.createdAt ?? new Date().toISOString(),
    postId: o.postId,
    parentId: o.parentId ?? null,
    rootId: o.rootId,
    depth: o.depth ?? 0,
    childCommentCount: o.childCommentCount ?? 0,
    authorId: o.authorId ?? 'd',
    authorAccountId: o.authorAccountId ?? 'reader',
  }
}

const load = async () => {
  const id = postId.value
  if (!id) {
    error.value = '貼文不存在'
    loading.value = false
    return
  }
  loading.value = true
  error.value = ''
  try {
    if (isDemoMode) {
      const p = demoPosts.value.find((x) => x.id === id) ?? null
      post.value = p
      if (!p) {
        error.value = '找不到此貼文'
        return
      }
      authorProfile.value = null
      isFollowing.value = false
    } else {
      const { data: p } = await secondReaderService.getPostById(id)
      post.value = p
      try {
        const { data: u } = await secondReaderService.getUserByAccountId(p.accountId)
        authorProfile.value = u
      } catch {
        authorProfile.value = null
      }
      await refreshFollowState()
    }
    await loadRootComments(id)
    if (rootComments.value[0] && rootComments.value[0].childCommentCount > 0) {
      expandedRepliesForRoot.value = rootComments.value[0]!.id
      await loadChildComments(rootComments.value[0]!.id)
    }
  } catch {
    error.value = '無法載入貼文'
  } finally {
    loading.value = false
  }
}

async function refreshFollowState() {
  if (isDemoMode || !authStore.userProfile || !post.value) {
    isFollowing.value = isDemoMode
    return
  }
  if (post.value.accountId === authStore.userProfile.accountId) {
    isFollowing.value = false
    return
  }
  try {
    const { data } = await secondReaderService.getUserFollowings(authStore.userProfile.accountId)
    isFollowing.value = data.some((f) => f.followedAccountId === post.value!.accountId)
  } catch {
    isFollowing.value = false
  }
}

const loadRootComments = async (id: string) => {
  if (isDemoMode) {
    rootComments.value = demoPostRoots.value[id] ? [...demoPostRoots.value[id]!] : []
    return
  }
  const { data } = await secondReaderService.getPostComments(id)
  rootComments.value = data
}

const loadChildComments = async (rootId: string) => {
  if (isDemoMode) {
    childComments.value = demoPostReplies.value[rootId] ? [...demoPostReplies.value[rootId]!] : []
    return
  }
  const { data } = await secondReaderService.getChildComments(rootId)
  childComments.value = data
}

const expandReplies = async (root: CommentDto) => {
  if (expandedRepliesForRoot.value === root.id) {
    expandedRepliesForRoot.value = null
    childComments.value = []
  } else {
    expandedRepliesForRoot.value = root.id
    await loadChildComments(root.id)
  }
}

const like = async (delta: 1 | -1) => {
  if (!post.value) return
  if (isDemoMode) {
    demoData.bumpPostLike(post.value.id, delta)
    post.value = demoPosts.value.find((x) => x.id === post.value!.id) ?? post.value
    return
  }
  try {
    const { data } = await secondReaderService.likePost(post.value.id, delta)
    post.value = data
  } catch {
    ElMessage.error('操作失敗')
  }
}

const submitRootComment = async () => {
  if (!post.value || !newComment.value.trim()) {
    ElMessage.warning('請輸入留言')
    return
  }
  if (!canAct.value) {
    void router.push('/login')
    return
  }
  if (isDemoMode) {
    const id = crypto.randomUUID()
    const row = makeComment({
      id,
      postId: post.value.id,
      rootId: id,
      content: newComment.value.trim(),
      authorAccountId: authStore.userProfile?.accountId ?? 'guest',
    })
    const list = demoPostRoots.value[post.value.id] ?? []
    demoPostRoots.value[post.value.id] = [...list, row]
    demoData.incrementCommentCount(post.value.id)
    newComment.value = ''
    rootComments.value = [...(demoPostRoots.value[post.value.id] ?? [])]
    const p2 = demoPosts.value.find((x) => x.id === post.value!.id)
    if (p2) post.value = { ...p2 }
    return
  }
  try {
    await secondReaderService.createComment({ content: newComment.value.trim(), postId: post.value.id })
    newComment.value = ''
    const { data: p } = await secondReaderService.getPostById(post.value.id)
    post.value = p
    await loadRootComments(post.value.id)
  } catch {
    ElMessage.error('留言失敗')
  }
}

const submitReply = async (root: CommentDto) => {
  if (!replyText.value.trim() || !post.value || !canAct.value) {
    if (!canAct.value) void router.push('/login')
    return
  }
  if (isDemoMode) {
    const id = crypto.randomUUID()
    const row = makeComment({
      id,
      postId: post.value.id,
      parentId: root.id,
      rootId: root.id,
      content: replyText.value.trim(),
      authorAccountId: authStore.userProfile?.accountId ?? 'guest',
      depth: 1,
    })
    const list = demoPostReplies.value[root.id] ?? []
    demoPostReplies.value[root.id] = [...list, row]
    const roots = (demoPostRoots.value[post.value.id] ?? []).map((c) =>
      c.id === root.id ? { ...c, childCommentCount: c.childCommentCount + 1 } : c
    )
    demoPostRoots.value[post.value.id] = roots
    demoData.incrementCommentCount(post.value.id)
    replyText.value = ''
    replyOpenFor.value = null
    rootComments.value = [...(demoPostRoots.value[post.value.id] ?? [])]
    if (expandedRepliesForRoot.value === root.id) {
      childComments.value = [...(demoPostReplies.value[root.id] ?? [])]
    }
    const p2 = demoPosts.value.find((x) => x.id === post.value!.id)
    if (p2) post.value = { ...p2 }
    return
  }
  try {
    await secondReaderService.createComment({
      content: replyText.value.trim(),
      postId: post.value.id,
      parentId: root.id,
      rootId: root.id,
    })
    replyText.value = ''
    replyOpenFor.value = null
    const { data: p } = await secondReaderService.getPostById(post.value.id)
    post.value = p
    await loadRootComments(post.value.id)
    if (expandedRepliesForRoot.value === root.id) {
      await loadChildComments(root.id)
    }
  } catch {
    ElMessage.error('回覆失敗')
  }
}

const toggleFollow = async () => {
  if (isSelf.value || !post.value || isDemoMode) {
    if (isDemoMode) {
      isFollowing.value = !isFollowing.value
      ElMessage.success(isFollowing.value ? 'DEMO：已追蹤' : 'DEMO：已取消追蹤')
    }
    return
  }
  if (!authStore.isLoggedIn) {
    void router.push('/login')
    return
  }
  followBusy.value = true
  try {
    if (isFollowing.value) {
      await secondReaderService.unfollowUser(post.value.accountId)
      isFollowing.value = false
    } else {
      await secondReaderService.followUser(post.value.accountId)
      isFollowing.value = true
    }
  } catch {
    ElMessage.error('操作失敗')
  } finally {
    followBusy.value = false
  }
}

const goProfile = (accountId: string) => {
  void router.push({ name: 'user-profile', params: { accountId } })
}

function displayCommentAuthor(accountId: string) {
  if (isDemoMode) return demoPublicProfiles[accountId]?.displayName || accountId
  return accountId
}

const openReply = (root: CommentDto) => {
  if (!canAct.value) {
    void router.push('/login')
    return
  }
  replyOpenFor.value = replyOpenFor.value === root.id ? null : root.id
  replyText.value = ''
}

const repliesList = (c: CommentDto) => {
  if (expandedRepliesForRoot.value !== c.id) return []
  if (isDemoMode) return demoPostReplies.value[c.id] ?? []
  return childComments.value
}

watch(
  () => route.params.postId,
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

    <template v-else-if="post">
      <article class="card post-main">
        <div class="row top">
          <div class="who">
            <button
              type="button"
              class="av"
              :aria-label="`查看 ${post.accountId} 的主頁`"
              @click="goProfile(post.accountId)"
            >
              {{ post.accountId.slice(0, 1).toUpperCase() }}
            </button>
            <div class="idblock">
              <p class="dn">{{ displayName }}</p>
              <p class="handle">@{{ post.accountId }} · {{ formatTimeAgo(post.updatedAt) }}</p>
            </div>
          </div>
          <div class="right-actions">
            <button
              v-if="!isSelf && (isDemoMode || authStore.isLoggedIn)"
              type="button"
              class="follow"
              :disabled="followBusy"
              @click="toggleFollow"
            >
              {{ isFollowing ? (isDemoMode ? '已追蹤' : '取消追蹤') : '追蹤' }}
            </button>
            <span v-else-if="!authStore.isLoggedIn && !isDemoMode" class="hint"> </span>
          </div>
        </div>

        <h1 class="title">{{ post.title }}</h1>
        <p class="body-t">{{ post.content }}</p>

        <div class="embed" role="link" @click="goEmbeddedBook">
          <div class="e-thumb" aria-hidden="true">📕</div>
          <div class="e-text">
            <p class="e-t">{{ embeddedBook?.title ?? '尚未關聯書籍' }}</p>
            <p class="e-a">{{ embeddedBook?.author ?? '點擊查看全部書籍' }}</p>
          </div>
          <span class="e-btn">查看書籍</span>
        </div>

        <div class="inter" @click.stop>
          <span class="inter-i"
            ><button type="button" :disabled="!canAct" @click="like(1)">♥</button> {{ post.likes }}</span
          >
          <span class="inter-i">💬 {{ post.commentCount }}</span>
        </div>
      </article>

      <section class="card comment-section" aria-label="留言">
        <h2 class="c-head">留言 ({{ post.commentCount }})</h2>
        <div v-if="canAct" class="add">
          <div class="me-av">{{ (authStore.userProfile?.accountId || '?').slice(0, 1).toUpperCase() }}</div>
          <div class="add-col">
            <textarea v-model="newComment" class="t1" rows="2" placeholder="寫下你的想法…" />
            <button type="button" class="send-plane" :disabled="loading" @click="submitRootComment">
              送出留言 <span aria-hidden="true">➤</span>
            </button>
          </div>
        </div>
        <p v-else class="login-hint">
          <button type="button" class="link" @click="router.push('/login')">登入</button>
          後可留言
        </p>

        <ul v-if="rootComments.length" class="clist">
          <li v-for="c in rootComments" :key="c.id" class="citem">
            <div class="c-top">
              <button type="button" class="c-av" @click="goProfile(c.authorAccountId)">
                {{ c.authorAccountId.slice(0, 1).toUpperCase() }}
              </button>
              <div class="c-main">
                <p class="c-name" @click="goProfile(c.authorAccountId)">
                  {{ displayCommentAuthor(c.authorAccountId) }}
                </p>
                <div class="bubble">
                  <p class="c-txt">{{ c.content }}</p>
                </div>
                <p class="c-foot">
                  <span>{{ formatTimeAgo(c.createdAt) }} ·</span>
                  <button type="button" class="c-act" @click="openReply(c)">回覆</button>
                  <span class="c-dot">·</span>
                  <span class="c-act muted">讚</span>
                </p>
                <div v-if="c.childCommentCount > 0" class="c-subtoggle">
                  <button type="button" class="link" @click="expandReplies(c)">
                    {{ expandedRepliesForRoot === c.id ? '收合' : '查看' }}回覆
                  </button>
                </div>
                <ul v-if="expandedRepliesForRoot === c.id && repliesList(c).length" class="sublist">
                  <li v-for="ch in repliesList(c)" :key="ch.id" class="subli">
                    <p class="c-name sub">
                      {{ displayCommentAuthor(ch.authorAccountId) }} · {{ formatTimeAgo(ch.createdAt) }}
                    </p>
                    <div class="bubble sub">
                      <p class="c-txt">{{ ch.content }}</p>
                    </div>
                  </li>
                </ul>
                <div v-if="replyOpenFor === c.id" class="replybox">
                  <textarea v-model="replyText" rows="2" class="t1" placeholder="回覆…" />
                  <div class="r-actions">
                    <button type="button" class="btn-g" @click="replyOpenFor = null">取消</button>
                    <button type="button" class="btn-b" @click="submitReply(c)">送出</button>
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>
        <p v-else class="empty">還沒有留言，當第一個回應者吧！</p>
      </section>
    </template>
  </div>
</template>

<style scoped>
.page {
  max-width: 640px;
  margin: 0 auto;
  padding: 0 0 2rem;
}
.back {
  border: 0;
  background: none;
  color: #374151;
  font-size: 0.95rem;
  cursor: pointer;
  margin-bottom: 0.75rem;
  padding: 0;
}
.back:hover {
  text-decoration: underline;
}
.err {
  color: #b91c1c;
}
.muted {
  color: #6b7280;
}
.card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 1.1rem 1.2rem 1.2rem;
  margin-bottom: 1rem;
}
.post-main {
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.04);
}
.row.top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}
.who {
  display: flex;
  gap: 0.6rem;
  min-width: 0;
}
.av {
  width: 48px;
  height: 48px;
  border-radius: 999px;
  background: #e5e7eb;
  font-weight: 800;
  border: 0;
  cursor: pointer;
  color: #111827;
  flex-shrink: 0;
}
.dn {
  font-weight: 800;
  margin: 0;
  color: #111827;
  font-size: 1rem;
  cursor: default;
}
.handle {
  font-size: 0.8rem;
  color: #9ca3af;
  margin: 0.1rem 0 0;
}
.right-actions {
  flex-shrink: 0;
}
.follow {
  border: 1px solid #111827;
  background: #fff;
  color: #111827;
  border-radius: 999px;
  padding: 0.35rem 0.9rem;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
}
.title {
  font-size: 1.35rem;
  font-weight: 800;
  line-height: 1.3;
  margin: 0 0 0.5rem;
  color: #111827;
  letter-spacing: -0.02em;
}
.body-t {
  color: #374151;
  line-height: 1.75;
  margin: 0 0 1rem;
  white-space: pre-wrap;
  word-break: break-word;
  font-size: 0.98rem;
}
.embed {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 0.9rem;
  background: #f3f4f6;
  border-radius: 12px;
  cursor: pointer;
  border: 1px solid #e5e7eb;
  margin-bottom: 0.9rem;
}
.e-thumb {
  width: 48px;
  height: 60px;
  background: #e5e7eb;
  border-radius: 6px;
  display: grid;
  place-items: center;
  font-size: 1.4rem;
}
.e-text {
  flex: 1;
  min-width: 0;
}
.e-t {
  font-weight: 800;
  margin: 0;
  color: #111827;
  font-size: 0.95rem;
}
.e-a {
  font-size: 0.8rem;
  color: #6b7280;
  margin: 0.2rem 0 0;
}
.e-btn {
  font-size: 0.8rem;
  font-weight: 700;
  color: #111827;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 0.35rem 0.6rem;
  background: #fff;
}
.inter {
  display: flex;
  gap: 1.2rem;
  border-top: 1px solid #f3f4f6;
  padding-top: 0.6rem;
  color: #4b5563;
  font-size: 0.9rem;
}
.inter-i {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}
.inter-i button {
  border: 0;
  background: none;
  cursor: pointer;
  font-size: 1.1rem;
  padding: 0;
  line-height: 1;
}
.c-head {
  font-size: 1rem;
  font-weight: 800;
  margin: 0 0 0.75rem;
  color: #111827;
}
.add {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.me-av {
  width: 40px;
  height: 40px;
  border-radius: 999px;
  background: #111827;
  color: #fff;
  display: grid;
  place-items: center;
  font-size: 0.85rem;
  font-weight: 800;
  flex-shrink: 0;
}
.add-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}
.t1 {
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 0.55rem 0.7rem;
  font: inherit;
  resize: vertical;
}
.send-plane {
  align-self: flex-end;
  background: #111827;
  color: #fff;
  border: 0;
  border-radius: 999px;
  padding: 0.45rem 1rem;
  font-size: 0.88rem;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
}
.login-hint {
  font-size: 0.9rem;
  color: #6b7280;
  margin: 0 0 0.5rem;
}
.link {
  background: none;
  border: 0;
  color: #2563eb;
  font-weight: 700;
  cursor: pointer;
  padding: 0;
  text-decoration: underline;
}
.clist {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.c-top {
  display: flex;
  gap: 0.5rem;
  align-items: flex-start;
}
.c-av {
  width: 36px;
  height: 36px;
  border-radius: 999px;
  background: #e5e7eb;
  font-size: 0.75rem;
  font-weight: 800;
  border: 0;
  cursor: pointer;
  flex-shrink: 0;
}
.c-main {
  flex: 1;
  min-width: 0;
}
.c-name {
  font-size: 0.82rem;
  font-weight: 700;
  color: #4b5563;
  margin: 0 0 0.25rem;
  cursor: pointer;
  text-align: left;
}
.c-name.sub {
  margin-bottom: 0.2rem;
  cursor: default;
  font-size: 0.78rem;
}
.bubble {
  background: #f3f4f6;
  border-radius: 12px;
  padding: 0.55rem 0.75rem;
}
.bubble.sub {
  margin-top: 0.2rem;
}
.c-txt {
  margin: 0;
  color: #111827;
  font-size: 0.9rem;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-word;
}
.c-foot {
  font-size: 0.75rem;
  color: #9ca3af;
  margin: 0.4rem 0 0;
}
.c-act {
  background: none;
  border: 0;
  color: #6b7280;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
  margin-left: 0.2rem;
}
.c-act.muted {
  color: #9ca3af;
  cursor: default;
}
.c-dot {
  margin: 0 0.15rem;
}
.c-subtoggle {
  margin-top: 0.25rem;
}
.sublist {
  list-style: none;
  margin: 0.4rem 0 0 0.2rem;
  padding: 0 0 0 0.5rem;
  border-left: 2px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.replybox {
  margin-top: 0.5rem;
  padding: 0.5rem 0.6rem;
  background: #fafafa;
  border-radius: 10px;
  border: 1px solid #f3f4f6;
}
.r-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.4rem;
  margin-top: 0.35rem;
}
.btn-g,
.btn-b {
  border-radius: 8px;
  padding: 0.3rem 0.7rem;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
}
.btn-g {
  border: 1px solid #d1d5db;
  background: #fff;
  color: #4b5563;
}
.btn-b {
  border: 0;
  background: #111827;
  color: #fff;
}
.empty {
  color: #9ca3af;
  font-size: 0.9rem;
  margin: 0;
}
</style>
