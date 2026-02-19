# Quick Start: 首頁書籍搜尋和過濾功能

**Feature**: 001-book-search-filter  
**Date**: 2026-02-07

## 功能概述

實作首頁的書籍搜尋和過濾功能，允許使用者：
1. 透過關鍵字（書名、作者、ISBN）搜尋書籍
2. 透過分類標籤過濾書籍列表
3. 組合使用搜尋和過濾功能

## 快速測試指南

### 前置需求

1. 確保後端 API 服務運行中：`https://second-reader.onrender.com`
2. 確保前端開發伺服器運行：`npm run dev`
3. 確保已登入（Clerk 認證）

### 測試步驟

#### 1. 測試關鍵字搜尋

1. 開啟首頁 (`/`)
2. 在搜尋框輸入「原子習慣」
3. 按下 Enter 或點擊搜尋按鈕
4. **預期結果**: 顯示包含「原子習慣」關鍵字的書籍列表

#### 2. 測試分類過濾

1. 在首頁點擊「類型文學」分類標籤
2. **預期結果**: 只顯示分類為「類型文學」的書籍
3. 點擊「全部」標籤
4. **預期結果**: 顯示所有分類的書籍

#### 3. 測試組合搜尋和過濾

1. 選擇「類型文學」分類
2. 在搜尋框輸入「習慣」
3. 執行搜尋
4. **預期結果**: 顯示「類型文學」分類中書名或作者包含「習慣」的書籍

#### 4. 測試空結果處理

1. 在搜尋框輸入不存在的關鍵字（如「xyzabc123」）
2. 執行搜尋
3. **預期結果**: 顯示「找不到相關書籍」的友善提示訊息

#### 5. 測試錯誤處理

1. 中斷網路連線
2. 執行搜尋
3. **預期結果**: 顯示錯誤訊息和重試按鈕

## 開發者快速參考

### 主要檔案位置

- **組件**: `src/components/BookSearchBar.vue`, `src/components/BookCategoryFilter.vue`
- **Composable**: `src/composables/useBookSearch.ts`
- **Store**: `src/stores/book.ts`
- **Service**: `src/services/book.ts`
- **型別**: `src/types/book.ts`
- **View**: `src/views/HomeView.vue`

### API 端點

- **搜尋**: `POST /api/books/search`
- **請求體**: `BookSearchQueryDto`
- **回應**: `UserBookSummaryDto[]`

### 關鍵型別

```typescript
// 搜尋查詢
interface BookSearchQueryDto {
  title?: string | null
  author?: string | null
  bookCategory?: BookCategory | null
}

// 書籍資料
interface Book {
  userBookId: number
  isbn: string | null
  title: string | null
  author: string | null
  description: string | null
  bookCategory: BookCategory
}
```

### 使用範例

```typescript
// 在組件中使用
import { useBookStore } from '@/stores/book'

const bookStore = useBookStore()

// 執行搜尋
await bookStore.searchBooks({
  title: '原子習慣',
  bookCategory: 'GenreFic'
})

// 取得結果
const books = bookStore.books
const loading = bookStore.loading
const error = bookStore.error
```

## 驗證檢查清單

- [ ] 搜尋功能正常運作
- [ ] 分類過濾正常運作
- [ ] 組合搜尋和過濾正常運作
- [ ] Loading 狀態正確顯示
- [ ] 錯誤處理正確運作
- [ ] 空結果提示正確顯示
- [ ] 防抖機制正常運作（不會過度請求）
- [ ] 型別檢查通過（`npm run type-check`）
- [ ] 程式碼格式正確（`npm run lint`）
- [ ] 測試通過（`npm test`）

## 常見問題

### Q: 搜尋沒有結果？
A: 檢查：
1. API 端點是否正確
2. 請求參數格式是否正確
3. 網路連線是否正常
4. 後端服務是否運行

### Q: 分類過濾沒有反應？
A: 檢查：
1. `selectedCategory` state 是否正確更新
2. API 請求是否包含 `bookCategory` 參數
3. 分類值是否與後端 enum 一致

### Q: 防抖沒有生效？
A: 檢查：
1. `useBookSearch` composable 中的防抖設定
2. 延遲時間是否合理（建議 300ms）

## 下一步

完成功能實作後，可以：
1. 執行 `/speckit.tasks` 建立任務清單
2. 執行 `/speckit.implement` 開始實作
3. 執行 `/speckit.checklist` 建立檢查清單
