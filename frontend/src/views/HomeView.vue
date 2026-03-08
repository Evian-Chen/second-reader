<script setup lang="ts">
</script>
<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="bg-white rounded-lg shadow-md p-8 max-w-sm w-full">
      <h1 class="text-2xl font-bold text-gray-900 mb-4">Hello Vue + Tailwind</h1>
      <p class="text-muted">設定完成！</p>
      <button class="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors">
        點我
      </button>
    </div>
  </div>
</template>
```

---

### 檔案結構總覽
```
src/
├── assets/
│   ├── base.css    ← CSS 變數 / 設計 token
│   └── main.css    ← 全域樣式 + 引入 base.css + 引入 Tailwind
├── main.js         ← 只 import main.css
└── App.vue
