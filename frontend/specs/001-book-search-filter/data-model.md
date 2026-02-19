# Data Model: 首頁書籍搜尋和過濾功能

**Feature**: 001-book-search-filter  
**Date**: 2026-02-07

## Entities

### Book (書籍)

**Source**: 後端 API `UserBookSummaryDto`

**Attributes**:
- `userBookId` (number): 使用者書籍的唯一識別碼
- `isbn` (string | null): 國際標準書號
- `title` (string | null): 書名
- `author` (string | null): 作者
- `description` (string | null): 書籍描述
- `bookCategory` (BookCategory): 書籍分類

**Relationships**:
- 屬於一個 `BookCategory`
- 屬於一個 `User` (賣家)

**Validation Rules**:
- `userBookId` 必須為正整數
- `title` 和 `author` 在顯示時不應為空（但 API 可能回傳 null）

**Frontend Extensions** (用於顯示，不來自 API):
- `price` (number | undefined): 價格（需要從其他 API 或 store 取得）
- `image` (string | undefined): 書籍封面圖片 URL
- `condition` (string | undefined): 書況描述

### BookSearchQuery (搜尋查詢)

**Source**: 前端建立，對應後端 `BookSearchQueryDto`

**Attributes**:
- `title` (string | null): 書名關鍵字
- `author` (string | null): 作者關鍵字
- `sellerAccountId` (string | null): 賣家帳號 ID（本功能不使用）
- `sellerDisplayName` (string | null): 賣家顯示名稱（本功能不使用）
- `bookCategory` (BookCategory | null): 書籍分類過濾

**Validation Rules**:
- `title` 和 `author` 至少有一個不為空，或 `bookCategory` 不為 null
- 字串長度不超過 100 字元（前端驗證）

**State Transitions**:
- 初始狀態：所有欄位為 null
- 搜尋狀態：`title` 或 `author` 有值
- 過濾狀態：`bookCategory` 有值
- 組合狀態：同時有搜尋關鍵字和分類

### BookCategory (書籍分類)

**Source**: 後端 enum，前端 `src/types/book.ts` 已定義

**Values**:
- `Undefined` (0)
- `Mandarin` (1): 華語文學
- `World` (2): 世界文學
- `GenreFic` (3): 類型文學
- `LightNovel` (4): 輕小說
- `Manga` (5): 漫畫
- `Bl` (6): 耽美
- `Gl` (7): 百合
- `History` (8): 歷史
- `Poem` (9): 詩歌
- `Art` (10): 藝術
- `Philisophy` (11): 哲學
- `Religion` (12): 宗教
- `Biography` (13): 傳記

**Display Mapping** (前端顯示名稱):
- `Mandarin` → "華語文學"
- `World` → "世界文學"
- `GenreFic` → "類型文學"
- `LightNovel` → "輕小說"
- `Manga` → "漫畫"
- `Bl` → "BL"
- `Gl` → "GL"
- `History` → "歷史"
- `Poem` → "詩歌"
- `Art` → "藝術"
- `Philisophy` → "哲學"
- `Religion` → "宗教"
- `Biography` → "傳記"

## State Management

### Book Store State

**Store**: `src/stores/book.ts`

**State Structure**:
```typescript
interface BookState {
  books: Book[]                    // 當前顯示的書籍列表
  searchQuery: string              // 搜尋關鍵字
  selectedCategory: BookCategory | null  // 選中的分類
  loading: boolean                 // 載入狀態
  error: Error | null              // 錯誤訊息
  lastSearchParams: BookSearchQuery | null  // 最後一次搜尋參數（用於快取）
}
```

**Actions**:
- `searchBooks(query: BookSearchQuery)`: 執行搜尋
- `setCategory(category: BookCategory | null)`: 設定分類過濾
- `clearSearch()`: 清除搜尋條件
- `reset()`: 重置所有狀態

**Getters**:
- `hasResults`: 是否有搜尋結果
- `isEmpty`: 是否為空結果
- `isSearching`: 是否正在搜尋

## Data Flow

1. **使用者輸入搜尋關鍵字** → 更新 `searchQuery` state
2. **使用者選擇分類** → 更新 `selectedCategory` state
3. **觸發搜尋** → 建立 `BookSearchQuery` 物件
4. **呼叫 API** → `POST /api/books/search` with `BookSearchQueryDto`
5. **接收回應** → `UserBookSummaryDto[]`
6. **更新 state** → 將結果存入 `books` array
7. **組件渲染** → `HomeView` 顯示書籍列表

## Edge Cases Handling

- **空搜尋結果**: `books` array 為空，顯示「找不到相關書籍」訊息
- **API 錯誤**: `error` state 有值，顯示錯誤訊息和重試按鈕
- **同時有搜尋和分類**: 合併兩個條件發送單一 API 請求
- **快速連續輸入**: 使用防抖機制，只發送最後一次請求
