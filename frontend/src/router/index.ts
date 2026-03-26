import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../components/HomeView.vue'
import { useAuthStore } from '@/stores/auth.ts'
import MainLayout from '@/layouts/MainLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: MainLayout,
      children: [
        {
          path: '',
          name: 'home',
          component: HomeView,
          meta: { requiresAuth: true, title: 'Scheduler', showInNav: true },
        },
        // {
        //   path: 'interviewerList',
        //   name: 'Interviewer List',
        //   component: () => import('../views/InterviewerList.vue'),
        //   meta: { requiresAuth: true, title: 'Interviewer List', showInNav: true },
        // },
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
        return { name: 'home' }
      },
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  if (!authStore.isInitialized) {
    await authStore.checkAuth()
  }
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    next({ name: 'login' })
  } else if (to.meta.guestOnly && authStore.isLoggedIn) {
    next({ name: 'home' })
  } else if (to.matched.length === 0) {
    if (authStore.isLoggedIn) {
      next({ name: 'home' })
    } else {
      next({ name: 'login' })
    }
  } else next()
})
export default router
