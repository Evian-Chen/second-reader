# MSW (Mock Service Worker) 設定指南

**目的**: 在後端 API 尚未部署時，使用 MSW 模擬 API 回應，讓前端開發可以獨立進行。

## 為什麼使用 MSW？

1. **前端獨立開發**: 不需要等待後端 API 完成
2. **測試友善**: 可以在測試中模擬各種 API 回應（成功、失敗、空結果等）
3. **開發體驗**: 可以控制 API 回應時間，測試 loading 狀態
4. **無縫切換**: 後端準備好後，只需關閉 MSW 或切換環境變數

## 安裝步驟

### 1. 安裝 MSW

```bash
npm install --save-dev msw@latest
```

### 2. 初始化 MSW Worker

```bash
npx msw init public/ --save
```

這會在 `public/` 目錄下建立 `mockServiceWorker.js` 檔案。

## 檔案結構

```
src/
├── mocks/
│   ├── browser.ts          # 瀏覽器環境的 MSW 設定
│   ├── handlers.ts         # API mock handlers
│   └── data/
│       └── books.ts        # Mock 資料
```

## 實作範例

### 1. Mock Handlers (`src/mocks/handlers.ts`)

```typescript
import { http, HttpResponse } from 'msw'
import type { BookSearchQueryDto, UserBookSummaryDto } from '@/types/book'
import { mockBooks } from './data/books'

export const handlers = [
  // POST /api/books/search
  http.post<never, BookSearchQueryDto, UserBookSummaryDto[]>(
    'https://second-reader.onrender.com/api/books/search',
    async ({ request }) => {
      const body = await request.json()
      
      // 模擬 API 延遲
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // 根據搜尋條件過濾書籍
      let filteredBooks = [...mockBooks]
      
      // 根據 title 過濾
      if (body.title) {
        filteredBooks = filteredBooks.filter(book =>
          book.title?.toLowerCase().includes(body.title!.toLowerCase())
        )
      }
      
      // 根據 author 過濾
      if (body.author) {
        filteredBooks = filteredBooks.filter(book =>
          book.author?.toLowerCase().includes(body.author!.toLowerCase())
        )
      }
      
      // 根據 bookCategory 過濾
      if (body.bookCategory) {
        filteredBooks = filteredBooks.filter(
          book => book.bookCategory === body.bookCategory
        )
      }
      
      return HttpResponse.json(filteredBooks)
    }
  ),
  
  // 模擬錯誤情況（可選）
  // http.post('...', () => {
  //   return HttpResponse.json(
  //     { error: 'Network error' },
  //     { status: 500 }
  //   )
  // }),
]
```

### 2. Browser Setup (`src/mocks/browser.ts`)

```typescript
import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

export const worker = setupWorker(...handlers)
```

### 3. Main.ts 整合 (`src/main.ts`)

```typescript
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

// MSW 設定（僅在開發環境且啟用時）
if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCK_API === 'true') {
  const { worker } = await import('./mocks/browser')
  await worker.start({
    onUnhandledRequest: 'bypass', // 未處理的請求直接通過
  })
  console.log('🔶 MSW: Mock API enabled')
}

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
```

### 4. Mock 資料 (`src/mocks/data/books.ts`)

```typescript
import type { UserBookSummaryDto } from '@/types/book'
import { BookCategory } from '@/types/book'

export const mockBooks: UserBookSummaryDto[] = [
  {
    userBookId: 1,
    isbn: '9789861755267',
    title: '原子習慣',
    author: '詹姆斯・克利爾',
    description: '細微改變帶來巨大成就的實證法則',
    bookCategory: BookCategory.GenreFic,
  },
  {
    userBookId: 2,
    isbn: '9789861755268',
    title: '深度工作力',
    author: '卡爾・紐波特',
    description: '淺薄時代，個人成功的關鍵能力',
    bookCategory: BookCategory.GenreFic,
  },
  {
    userBookId: 3,
    isbn: '9789861755269',
    title: '被討厭的勇氣',
    author: '岸見一郎、古賀史健',
    description: '自我啟發之父「阿德勒」的教導',
    bookCategory: BookCategory.Philisophy,
  },
  // 更多 mock 資料...
]
```

## 環境變數設定

在 `.env.development` 或 `.env.local` 中：

```env
# 啟用 MSW Mock API
VITE_USE_MOCK_API=true

# 或使用真實 API（當後端準備好時）
# VITE_USE_MOCK_API=false
# VITE_API_BASE_URL=https://second-reader.onrender.com/api
```

## 使用方式

### 開發時

1. 設定 `VITE_USE_MOCK_API=true`
2. 執行 `npm run dev`
3. MSW 會自動攔截 API 請求並返回 mock 資料
4. 在瀏覽器 console 會看到 "🔶 MSW: Mock API enabled"

### 測試時

在測試檔案中使用 MSW：

```typescript
import { setupServer } from 'msw/node'
import { handlers } from '@/mocks/handlers'

const server = setupServer(...handlers)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
```

### 切換到真實 API

當後端準備好時：

1. 設定 `VITE_USE_MOCK_API=false`
2. 確保 `VITE_API_BASE_URL` 指向真實的 API 端點
3. MSW 會自動停用，所有請求會發送到真實 API

## 進階功能

### 模擬不同的回應情況

```typescript
// 模擬空結果
http.post('...', () => {
  return HttpResponse.json([])
})

// 模擬錯誤
http.post('...', () => {
  return HttpResponse.json(
    { error: 'Server error' },
    { status: 500 }
  )
})

// 模擬延遲
http.post('...', async () => {
  await new Promise(resolve => setTimeout(resolve, 2000))
  return HttpResponse.json(mockBooks)
})
```

### 根據請求參數動態回應

```typescript
http.post('...', async ({ request }) => {
  const body = await request.json()
  
  // 根據不同的搜尋關鍵字返回不同結果
  if (body.title === '原子習慣') {
    return HttpResponse.json([mockBooks[0]])
  }
  
  return HttpResponse.json(mockBooks)
})
```

## 注意事項

1. **Worker 檔案**: `public/mockServiceWorker.js` 必須存在，這是 MSW 的核心檔案
2. **HTTPS**: MSW 需要 HTTPS 或 localhost，確保開發環境符合要求
3. **Service Worker**: MSW 使用 Service Worker，某些瀏覽器擴充功能可能會干擾
4. **型別安全**: Mock 資料應該符合 TypeScript 型別定義

## 參考資源

- [MSW 官方文件](https://mswjs.io/)
- [MSW with Vue](https://mswjs.io/docs/getting-started/integrate/browser)
- [MSW with Vitest](https://mswjs.io/docs/getting-started/integrate/node)
