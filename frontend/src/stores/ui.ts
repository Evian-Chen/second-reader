import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUiStore = defineStore('ui', () => {
  const showPostModal = ref(false)
  const showUploadModal = ref(false)
  const showNotificationDropdown = ref(false)
  const postFeedTick = ref(0)

  function openPostComposer() {
    showPostModal.value = true
  }
  function closePostComposer() {
    showPostModal.value = false
  }
  function openBookUpload() {
    showUploadModal.value = true
  }
  function closeBookUpload() {
    showUploadModal.value = false
  }
  function bumpPostFeed() {
    postFeedTick.value += 1
  }

  function setNotificationDropdown(open: boolean) {
    showNotificationDropdown.value = open
  }

  function toggleNotificationDropdown() {
    showNotificationDropdown.value = !showNotificationDropdown.value
  }

  return {
    showPostModal,
    showUploadModal,
    showNotificationDropdown,
    postFeedTick,
    openPostComposer,
    closePostComposer,
    openBookUpload,
    closeBookUpload,
    bumpPostFeed,
    setNotificationDropdown,
    toggleNotificationDropdown,
  }
})
