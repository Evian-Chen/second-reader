<script setup lang="ts">
import { reactive, watch, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { secondReaderService } from '@/services/secondReaderService'
import { isDemoMode } from '@/config/demoMode'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ (e: 'close'): void; (e: 'updated'): void }>()

const authStore = useAuthStore()
const loading = ref(false)
const form = reactive({
  displayName: '',
  bio: '',
  instagram: '',
  threads: '',
})

watch(
  () => props.open,
  (open) => {
    if (open) {
      form.displayName = authStore.userProfile?.userProfile?.displayName || ''
      form.bio = authStore.userProfile?.userProfile?.bio || ''
      form.instagram = authStore.userProfile?.instagramAccount || ''
      form.threads = authStore.userProfile?.threadsAccount || ''
    }
  }
)

const submit = async () => {
  const me = authStore.userProfile
  if (!me) return
  if (isDemoMode) {
    if (!me.userProfile) {
      me.userProfile = { displayName: form.displayName, bio: form.bio }
    } else {
      me.userProfile.displayName = form.displayName
      me.userProfile.bio = form.bio
    }
    me.instagramAccount = form.instagram
    me.threadsAccount = form.threads
    emit('updated')
    emit('close')
    return
  }
  loading.value = true
  try {
    await secondReaderService.updateMe({
      accountId: me.accountId,
      email: me.email,
      instagramAccount: form.instagram,
      threadsAccount: form.threads,
      userProfile: {
        bio: form.bio,
        displayName: form.displayName,
      },
    })
    await authStore.checkAuth()
    emit('updated')
    emit('close')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div v-if="open" class="overlay" @click.self="emit('close')">
    <section class="modal">
      <div class="head">
        <h3>編輯個人檔案</h3>
        <button @click="emit('close')">✕</button>
      </div>
      <div class="body">
        <input v-model="form.displayName" placeholder="名稱" />
        <textarea v-model="form.bio" placeholder="個人簡介" maxlength="200" />
        <input v-model="form.instagram" placeholder="Instagram" />
        <input v-model="form.threads" placeholder="Threads" />
      </div>
      <div class="footer">
        <button class="ghost" @click="emit('close')">取消</button>
        <button class="primary" :disabled="loading" @click="submit">{{ loading ? '儲存中...' : '儲存變更' }}</button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.overlay { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.35); display: grid; place-items: center; z-index: 1200; }
.modal { width: min(760px, 94vw); background: #fff; border-radius: 14px; border: 1px solid #e5e7eb; }
.head { display: flex; justify-content: space-between; align-items: center; padding: 14px 16px; border-bottom: 1px solid #eee; }
.head h3 { font-weight: 700; }
.head button { border: 0; background: transparent; cursor: pointer; }
.body { display: grid; gap: 10px; padding: 16px; }
input, textarea { border: 1px solid #ddd; border-radius: 8px; padding: 10px; font: inherit; }
textarea { min-height: 90px; resize: vertical; }
.footer { display: flex; justify-content: flex-end; gap: 8px; padding: 0 16px 16px; }
.footer button { border-radius: 8px; padding: 9px 14px; cursor: pointer; border: 1px solid #ddd; background: #fff; }
.footer .primary { background: #111827; color: #fff; border-color: #111827; }
</style>
