<!--
Sync Impact Report:
Version change: 1.0.0 → 1.0.0 (initial creation)
Modified principles: N/A (new file)
Added sections: Core Principles (6 principles), TypeScript Standards, Component Design, State Management, API Integration, UX Consistency, Testing Standards, Development Workflow
Templates requiring updates: plan-template.md (Constitution Check section), spec-template.md (aligned with principles)
Follow-up TODOs: None
-->

# Second Reader Frontend Constitution

## Core Principles

### I. Vue 3 Composition API First (NON-NEGOTIABLE)

所有新組件必須使用 Composition API (`<script setup lang="ts">`)，禁止使用 Options API。Composition API 提供更好的 TypeScript 支援、邏輯重用性和程式碼組織。

**規則**：
- 使用 `<script setup lang="ts">` 語法
- 使用 `defineProps<T>()` 和 `defineEmits<T>()` 進行型別定義
- 使用 `ref()`、`reactive()`、`computed()`、`watch()` 管理響應式狀態
- 複雜邏輯抽取到 composables (`src/composables/`)
- 組件內邏輯保持簡潔，單一職責原則

**範例**：
```typescript
// GOOD
<script setup lang="ts">
interface Props {
  title: string
  count?: number
}

const props = defineProps<Props>()
const emit = defineEmits<{ increment: [value: number] }>()
const count = ref(props.count ?? 0)
</script>

// BAD
<script>
export default {
  props: { title: String },
  data() { return { count: 0 } }
}
</script>
```

### II. TypeScript Strict Mode (NON-NEGOTIABLE)

所有程式碼必須通過 TypeScript strict 模式檢查，禁止使用 `any` 型別（除非有明確理由並加上註解說明）。

**規則**：
- 所有函數參數和返回值必須有明確型別
- 使用 `interface` 定義物件結構，`type` 定義聯合型別或工具型別
- API 回應資料必須定義型別（放在 `src/types/`）
- 使用型別推斷時確保型別明確
- 避免使用 `as` 型別斷言，優先使用型別守衛（type guards）

**範例**：
```typescript
// GOOD
interface Book {
  id: string
  title: string
  price: number
}

const getBook = async (id: string): Promise<Book> => {
  const response = await api.get<Book>(`/books/${id}`)
  return response.data
}

// BAD
const getBook = async (id: any): Promise<any> => {
  return await api.get(`/books/${id}`)
}
```

### III. Component-Based Architecture

組件必須遵循單一職責原則，保持小而專注，易於測試和維護。

**規則**：
- 組件檔案大小不超過 300 行（不含樣式）
- 複雜 UI 邏輯抽取為子組件
- 組件命名使用 PascalCase，檔案名稱與組件名稱一致
- Props 使用 `defineProps<T>()` 定義，提供預設值時使用 `withDefaults()`
- Emits 使用 `defineEmits<T>()` 定義事件型別
- 組件必須有明確的 props 和 emits 文檔註解

**目錄結構**：
```
src/components/
├── [FeatureName]/          # 功能相關組件群組
│   ├── [FeatureName]Card.vue
│   └── [FeatureName]List.vue
├── common/                  # 通用組件
│   ├── Button.vue
│   └── Modal.vue
└── icons/                   # 圖標組件
```

**範例**：
```typescript
// GOOD - 組件職責單一
<script setup lang="ts">
interface BookCardProps {
  book: Book
  showPrice?: boolean
}

const props = withDefaults(defineProps<BookCardProps>(), {
  showPrice: true
})

const emit = defineEmits<{
  click: [book: Book]
  favorite: [bookId: string]
}>()
</script>
```

### IV. Pinia State Management

使用 Pinia 進行狀態管理，遵循模組化設計和清晰的資料流。

**規則**：
- Store 必須使用 `defineStore()` 並提供明確的 store ID
- Store 檔案命名使用 kebab-case，對應功能領域（如 `book.ts`、`auth.ts`）
- State 使用函數形式定義，確保多實例安全
- Actions 處理所有異步操作和業務邏輯
- Getters 用於計算衍生狀態，保持純函數特性
- Store 之間避免循環依賴
- 使用 `storeToRefs()` 解構 store 以保持響應性

**Store 結構**：
```typescript
// GOOD
export const useBookStore = defineStore('book', {
  state: (): BookState => ({
    books: [],
    loading: false
  }),
  getters: {
    bookCount: (state) => state.books.length,
    findBook: (state) => (id: string) => state.books.find(b => b.id === id)
  },
  actions: {
    async fetchBooks() {
      this.loading = true
      try {
        const res = await apiServices.getBooks()
        this.books = res
      } finally {
        this.loading = false
      }
    }
  }
})
```

**禁止事項**：
- 禁止在組件中直接修改 store state（必須透過 actions）
- 禁止在 store 中直接操作 DOM
- 禁止在 store 中進行路由跳轉（使用 router composable）

### V. API Integration Standards

API 整合必須統一使用 `src/services/api.ts` 中的 axios instance，遵循錯誤處理和型別安全原則。

**規則**：
- 所有 API 呼叫必須透過 `src/services/` 中的 service 函數
- Service 函數必須定義明確的請求/回應型別
- 使用統一的錯誤處理機制（透過 interceptors）
- API 回應資料必須定義 TypeScript 型別（放在 `src/types/api.ts`）
- 使用 `useApi` composable 處理 loading 和錯誤狀態
- 請求參數使用物件傳遞，避免位置參數

**Service 結構**：
```typescript
// GOOD - src/services/book.ts
import api from './api'
import type { Book, BookListResponse } from '../types/api'

export const bookService = {
  getBooks: (params?: { page?: number; limit?: number }): Promise<BookListResponse> => {
    return api<BookListResponse>('get', '/books', params)
  },
  getBook: (id: string): Promise<Book> => {
    return api<Book>('get', `/books/${id}`)
  },
  createBook: (data: CreateBookRequest): Promise<Book> => {
    return api<Book>('post', '/books', data)
  }
}
```

**在組件中使用**：
```typescript
// GOOD
const { data, loading, error, execute } = useApi(bookService.getBooks)

onMounted(() => {
  execute({ page: 1, limit: 20 })
})
```

### VI. User Experience Consistency

確保整個應用程式的使用者體驗一致，包括載入狀態、錯誤處理、動畫過渡和無障礙設計。

**規則**：
- 所有異步操作必須顯示 loading 狀態
- 錯誤訊息必須使用者友善，提供明確的解決建議
- 使用統一的 Tailwind CSS 設計系統（顏色、間距、字體大小）
- 動畫過渡時間統一（200ms 基礎，300ms 複雜）
- 所有互動元素必須有 hover 和 focus 狀態
- 圖片必須有 alt 屬性，表單元素必須有 label
- 響應式設計：mobile-first，支援斷點 sm、md、lg、xl

**設計系統**：
- 使用 Tailwind CSS 工具類別，避免自訂 CSS（除非必要）
- 顏色使用語義化命名（如 `text-primary`、`bg-accent`）
- 間距使用 Tailwind 標準間距（4px 基準）

**範例**：
```vue
<!-- GOOD - 完整的 UX 狀態 -->
<template>
  <div v-if="loading" class="flex items-center justify-center p-8">
    <Spinner />
  </div>
  <div v-else-if="error" class="p-4 bg-red-50 text-red-800 rounded">
    {{ error.message }}
    <button @click="retry" class="mt-2">重試</button>
  </div>
  <div v-else>
    <!-- 內容 -->
  </div>
</template>
```

## TypeScript Standards

### 型別定義

- 所有 API 相關型別定義在 `src/types/api.ts`
- 業務領域型別定義在對應的 `src/types/[domain].ts`（如 `book.ts`）
- 使用 `interface` 定義物件結構
- 使用 `type` 定義聯合型別、工具型別或別名
- 避免使用 `enum`，優先使用 const object + `as const` 或字串聯合型別

### 型別安全

- 禁止使用 `any`，必要時使用 `unknown` 並進行型別守衛
- 使用型別守衛函數進行執行時型別檢查
- API 回應必須定義完整型別，避免部分型別定義

## Component Design

### Props 設計

- Props 必須有明確的型別定義
- 可選 props 使用 `?` 標記
- 提供合理的預設值（使用 `withDefaults()`）
- Props 命名使用 camelCase
- 避免傳遞過多 props（超過 5 個考慮使用物件或拆分組件）

### Emits 設計

- 所有 emits 必須定義型別
- 事件名稱使用 kebab-case
- 事件參數必須明確型別
- 避免過度使用 emits（考慮使用 v-model 或 provide/inject）

### 組件生命週期

- 使用 Composition API 生命週期 hooks（`onMounted`、`onUnmounted` 等）
- 清理副作用（如事件監聽器、定時器）必須在 `onUnmounted` 中處理
- 避免在 `setup` 中進行副作用操作，使用生命週期 hooks

## State Management (Pinia)

### Store 設計原則

- 每個功能領域一個 store（如 `book.ts`、`auth.ts`、`cart.ts`）
- Store 必須有明確的 state 型別定義
- Actions 必須是 async 函數（即使不需要異步操作）
- Getters 必須是純函數，不應有副作用
- 避免在 store 中儲存 UI 狀態（如 modal 開關），使用組件本地狀態

### Store 組合

- 使用 `storeToRefs()` 解構 store 以保持響應性
- Store 之間可以互相呼叫，但避免循環依賴
- 複雜的跨 store 邏輯考慮抽取為 composable

## API Integration

### 錯誤處理

- 所有 API 錯誤必須被適當處理
- 使用統一的錯誤處理機制（axios interceptors）
- 顯示使用者友善的錯誤訊息
- 記錄錯誤到錯誤追蹤系統（如 Sentry）

### 請求優化

- 使用適當的 HTTP 方法（GET、POST、PUT、DELETE）
- 實現請求去重（避免同時發送相同請求）
- 實現請求取消（使用 AbortController）
- 適當使用快取策略

### 型別安全

- API 請求參數必須定義型別
- API 回應必須定義完整型別
- 使用型別推斷減少重複型別定義

## User Experience Consistency

### 載入狀態

- 所有異步操作必須顯示 loading 狀態
- 使用統一的 loading 組件或樣式
- 長時間操作提供進度指示

### 錯誤處理

- 錯誤訊息必須清楚、友善
- 提供明確的錯誤恢復選項（如重試按鈕）
- 區分不同類型的錯誤（網路錯誤、驗證錯誤、伺服器錯誤）

### 動畫與過渡

- 使用 Vue `<Transition>` 和 `<TransitionGroup>` 組件
- 動畫時間統一：200ms（基礎）、300ms（複雜）
- 使用 `ease-in-out` 緩動函數
- 避免過度動畫影響效能

### 無障礙設計

- 所有互動元素必須可鍵盤操作
- 圖片必須有 alt 屬性
- 表單元素必須有對應的 label
- 使用語義化 HTML 元素
- 確保顏色對比度符合 WCAG AA 標準

## Testing Standards

### 測試層級

- **Unit Tests**: 測試 composables、utils、store actions/getters
- **Component Tests**: 測試組件渲染、props、emits、使用者互動
- **Integration Tests**: 測試組件與 store、API 的整合
- **E2E Tests**: 測試完整使用者流程（可選，視專案需求）

### 測試原則

- 測試必須獨立，不依賴執行順序
- 使用描述性的測試名稱（describe/it）
- 遵循 AAA 模式（Arrange、Act、Assert）
- Mock 外部依賴（API、router、store）
- 測試邊界情況和錯誤情況

### 測試覆蓋率目標

- Composables: 80%+
- Store actions/getters: 80%+
- 組件核心邏輯: 70%+
- 工具函數: 90%+

### 測試工具

- 使用 Vitest 作為測試框架
- 使用 Vue Test Utils 進行組件測試
- 使用 MSW (Mock Service Worker) 模擬 API
- 使用 Testing Library 進行使用者導向測試

## Development Workflow

### 程式碼品質

- 所有程式碼必須通過 ESLint 檢查
- 使用 Prettier 進行程式碼格式化
- 提交前執行 `npm run lint` 和 `npm run type-check`
- 保持程式碼簡潔，遵循 DRY 原則

### Git 工作流程

- 使用語義化 commit message（feat、fix、docs、style、refactor、test、chore）
- 每個功能開發使用獨立分支
- PR 必須通過 code review 才能合併
- PR 描述必須清楚說明變更內容和原因

### 程式碼審查

- 審查重點：型別安全、錯誤處理、效能、可維護性
- 確保遵循本 constitution 的所有原則
- 提供建設性意見，避免僅指出問題

## Governance

本 Constitution 是專案開發的最高指導原則，所有開發工作必須遵循這些原則。

### 修訂流程

- 修訂必須經過團隊討論和共識
- 重大變更（影響現有程式碼）必須提供遷移指南
- 版本號遵循語義化版本（MAJOR.MINOR.PATCH）
- 修訂後必須更新相關文件和範本

### 合規檢查

- 所有 PR 必須通過 Constitution Check
- Code review 必須驗證是否符合原則
- 定期進行程式碼審計確保合規

### 例外情況

- 如果必須違反某項原則，必須在 PR 中明確說明理由
- 例外情況必須記錄在 Complexity Tracking 表格中
- 定期檢討例外情況，尋找更好的解決方案

**Version**: 1.0.0 | **Ratified**: 2026-02-07 | **Last Amended**: 2026-02-07
