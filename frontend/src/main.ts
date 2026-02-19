import './styles/main.css'

import { clerkPlugin } from '@clerk/vue'
import { createPinia } from 'pinia'
import { createApp } from 'vue'

import App from './App.vue'
import router from './router'

// MSW 設定（僅在開發環境）
if (import.meta.env.DEV) {
  const { worker } = await import('./mocks/browser')
  await worker.start({
    quiet: true,
    onUnhandledRequest: 'bypass', // 未處理的請求直接通過
  })
  console.log('🔶 MSW: Mock API enabled')
}

const app = createApp(App)
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Add your Clerk Publishable Key to the .env file')
}

app.use(clerkPlugin, { publishableKey: PUBLISHABLE_KEY })

app.use(createPinia())
app.use(router)

app.mount('#app')
