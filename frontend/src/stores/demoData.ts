import { defineStore } from 'pinia'
import { ref } from 'vue'
import { createLocalDemoPost, initialDemoPosts, buildInitialDemoCommentMaps } from '@/data/demoMocks'
import type { CommentDto, ReadingPostDto } from '@/api/types/secondReader'

const initialCommentMaps = buildInitialDemoCommentMaps()

export const useDemoDataStore = defineStore('demoData', () => {
  const posts = ref<ReadingPostDto[]>([...initialDemoPosts])
  const demoPostRoots = ref<Record<string, CommentDto[]>>({ ...initialCommentMaps.roots })
  const demoPostReplies = ref<Record<string, CommentDto[]>>({ ...initialCommentMaps.replies })

  function addPostFromComposer(title: string, content: string, rating: number) {
    posts.value = [createLocalDemoPost({ title, content, rating }), ...posts.value]
  }

  function bumpPostLike(postId: string, delta: 1 | -1) {
    const p = posts.value.find((x) => x.id === postId)
    if (p) p.likes = Math.max(0, p.likes + delta)
  }

  function incrementCommentCount(postId: string) {
    const p = posts.value.find((x) => x.id === postId)
    if (p) p.commentCount += 1
  }

  return {
    posts,
    demoPostRoots,
    demoPostReplies,
    addPostFromComposer,
    bumpPostLike,
    incrementCommentCount,
  }
})
