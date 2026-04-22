<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import EditProfileModal from '@/components/modals/EditProfileModal.vue'

const authStore = useAuthStore()
const route = useRoute()
const me = computed(() => authStore.userProfile)
const showEditProfileModal = ref(false)

const tabClass = (names: string | string[]) => {
  const n = Array.isArray(names) ? names : [names]
  return {
    'tab-link': true,
    'tab-link-active': n.includes(String(route.name)),
  }
}
</script>

<template>
  <section class="page">
    <div class="profile-head">
      <div class="avatar">👤</div>
      <div>
        <h1>{{ me?.userProfile?.displayName || me?.accountId || '使用者' }}</h1>
        <p class="account">@{{ me?.accountId }}</p>
        <p class="bio">{{ me?.userProfile?.bio || '熱愛閱讀與分享 | 文學愛好者 | 交換好書，交流好想法' }}</p>
        <p class="stats">2 貼文　4 粉絲　2 追蹤中</p>
      </div>
      <button class="edit-btn" type="button" @click="showEditProfileModal = true">編輯個人檔案</button>
    </div>
    <nav class="tabs" aria-label="個人分頁">
      <RouterLink :class="tabClass('me-posts')" to="/me" end>貼文</RouterLink>
      <RouterLink :class="tabClass('me-books')" to="/me/books">書籍</RouterLink>
      <RouterLink :class="tabClass('me-saved-posts')" to="/me/saved-posts">貼文收藏</RouterLink>
      <RouterLink :class="tabClass('me-saved-books')" to="/me/saved-books">書籍收藏</RouterLink>
    </nav>
    <div class="me-tab-panel">
      <RouterView />
    </div>
    <EditProfileModal :open="showEditProfileModal" @close="showEditProfileModal = false" />
  </section>
</template>

<style scoped>
.page { padding: 1rem; }
.profile-head { display: grid; grid-template-columns: 80px 1fr auto; gap: 16px; align-items: start; background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; }
.avatar { width: 80px; height: 80px; border-radius: 999px; background: #e5e7eb; display: grid; place-items: center; font-size: 28px; }
h1 { font-size: 28px; font-weight: 700; }
.account { color: #6b7280; }
.bio { margin-top: 8px; }
.stats { margin-top: 10px; font-weight: 600; }
.edit-btn { border: 1px solid #ddd; background: #fff; border-radius: 10px; padding: 10px 12px; cursor: pointer; }
.tabs { margin-top: 12px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
.tab-link { border: 1px solid #ddd; background: #fff; border-radius: 8px; padding: 10px 12px; text-align: center; color: #111; font: inherit; cursor: pointer; }
.tab-link:hover { border-color: #9ca3af; }
.tab-link-active { border-color: #111; font-weight: 700; }
.me-tab-panel { margin-top: 14px; min-height: 120px; }
@media (max-width: 900px) {
  .profile-head { grid-template-columns: 1fr; }
  .tabs { grid-template-columns: 1fr 1fr; }
}
</style>
