import './assets/main.css'

import { createPinia } from 'pinia'
import { createApp } from 'vue'
import { clerkPlugin } from 'vue-clerk'

import App from './App.vue'
import router from './router'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
if (!PUBLISHABLE_KEY) throw new Error("Clerk Key not found.");

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(clerkPlugin, {
  publishableKey: PUBLISHABLE_KEY
})

app.mount('#app')
