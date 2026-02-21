import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// 定義需要保護的路由（暫時關閉 /profile、/orders 以避免登入後導向迴圈，頁面改由 SignedIn/SignedOut 處理）
const isProtectedRoute = createRouteMatcher([
  // '/profile(.*)',
  // '/orders(.*)',
  '/my-books(.*)',
  '/checkout(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  // 如果訪問受保護的路由且未登入，重定向到登入頁
  if (isProtectedRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    // 排除靜態檔案和 API 路由
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
