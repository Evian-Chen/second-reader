import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.ts'
import MainLayout from '@/layouts/MainLayout.vue'
import { isDemoMode } from '@/config/demoMode'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/books',
    },
    {
      path: '/',
      component: MainLayout,
      children: [
        {
          path: 'books',
          name: 'books',
          component: () => import('@/views/BooksView.vue'),
          meta: { title: 'Books', showInNav: true },
        },
        {
          path: 'book/:userBookId',
          name: 'book-detail',
          component: () => import('@/views/BookDetailView.vue'),
          meta: { title: 'Book' },
        },
        {
          path: 'posts',
          name: 'posts',
          component: () => import('@/views/PostsView.vue'),
          meta: { title: 'Posts', showInNav: true },
        },
        {
          path: 'post/:postId',
          name: 'post-detail',
          component: () => import('@/views/PostDetailView.vue'),
          meta: { title: 'Post' },
        },
        {
          path: 'user/:accountId',
          name: 'user-profile',
          component: () => import('@/views/UserProfileView.vue'),
          meta: { title: 'User' },
        },
        {
          path: 'cart',
          name: 'cart',
          component: () => import('@/views/CartView.vue'),
          meta: { requiresAuth: true, title: 'Cart', showInNav: true },
        },
        {
          path: 'me',
          name: 'me',
          component: () => import('@/views/me/MeLayout.vue'),
          meta: { requiresAuth: true, title: 'Me', showInNav: true },
          children: [
            {
              path: '',
              name: 'me-posts',
              component: () => import('@/views/me/MePostsTab.vue'),
            },
            {
              path: 'books',
              name: 'me-books',
              component: () => import('@/views/me/MeBooksTab.vue'),
            },
            {
              path: 'saved-posts',
              name: 'me-saved-posts',
              component: () => import('@/views/me/MeSavedPostsTab.vue'),
            },
            {
              path: 'saved-books',
              name: 'me-saved-books',
              component: () => import('@/views/me/MeSavedBooksTab.vue'),
            },
          ],
        },
        {
          path: 'orders',
          name: 'orders',
          component: () => import('@/views/OrdersView.vue'),
          meta: { requiresAuth: true, title: 'Orders', showInNav: true },
        },
        {
          path: 'sales',
          name: 'sales',
          component: () => import('@/views/SalesView.vue'),
          meta: { requiresAuth: true, title: 'Sales', showInNav: true },
        },
        {
          path: 'notifications',
          name: 'notifications',
          component: () => import('@/views/NotificationsView.vue'),
          meta: { requiresAuth: true, title: 'Notifications', showInNav: true },
        },
      ],
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login.vue'),
      meta: { guestOnly: true },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      redirect: (to) => {
        return { name: 'books' }
      },
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  if (!authStore.isInitialized) {
    await authStore.checkAuth()
  }
  if (to.meta.requiresAuth && !authStore.isLoggedIn && !isDemoMode) {
    next({ name: 'login' })
  } else if (to.meta.guestOnly && authStore.isLoggedIn && !isDemoMode) {
    next({ name: 'books' })
  } else if (to.matched.length === 0) {
    if (authStore.isLoggedIn) {
      next({ name: 'books' })
    } else {
      next({ name: 'login' })
    }
  } else next()
})
export default router
