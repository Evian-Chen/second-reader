import { auth, currentUser } from '@clerk/nextjs/server'

/**
 * 在 Server Component 中取得認證狀態
 */
export async function getAuth() {
  const { userId } = await auth()
  return { userId, isAuthenticated: !!userId }
}

/**
 * 在 Server Component 中取得使用者資訊
 */
export async function getUser() {
  return await currentUser()
}

/**
 * 在 Server Component 中取得 token
 */
export async function getToken() {
  const { getToken: clerkGetToken } = await auth()
  return await clerkGetToken()
}
