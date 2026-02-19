# Research: 首頁書籍搜尋和過濾功能

**Feature**: 001-book-search-filter  
**Date**: 2026-02-07  
**Purpose**: 解決技術選型和實作決策

## API 端點分析

### Decision: 使用 POST /api/books/search 進行搜尋

**Rationale**: 
- 根據 Swagger API 文件，`POST /api/books/search` 端點接受 `BookSearchQueryDto`，支援多個搜尋參數
- 該端點支援 title、author、sellerAccountId、sellerDisplayName、bookCategory 等參數
- 回應格式為 `UserBookSummaryDto[]` 陣列，符合前端顯示需求

**Alternatives considered**:
- `GET /api/books`: 僅能取得所有書籍，不支援搜尋參數，不符合需求
- `GET /api/books/{accountId}`: 僅能取得特定賣家的書籍，不支援關鍵字搜尋

### Decision: 搜尋和過濾使用同一個 API 端點

**Rationale**:
- `POST /api/books/search` 的 `BookSearchQueryDto` 同時支援 `bookCategory` 參數
- 可以將關鍵字搜尋和分類過濾合併為單一 API 請求
- 減少 API 呼叫次數，提升效能和使用者體驗

**Alternatives considered**:
- 分別呼叫兩個 API：增加複雜度和延遲，不符合最佳實踐

## 搜尋輸入處理

### Decision: 實作防抖（debounce）機制

**Rationale**:
- 避免使用者在輸入過程中頻繁觸發 API 請求
- 減少伺服器負載和網路流量
- 提升使用者體驗，避免輸入卡頓

**Implementation**: 
- 使用 Vue 3 的 `watch` 配合防抖函數
- 預設延遲 300ms，平衡響應速度和請求頻率

**Alternatives considered**:
- 即時搜尋（無防抖）：會產生過多 API 請求，影響效能
- 僅在按下 Enter 時搜尋：不符合現代搜尋體驗的預期

## 狀態管理設計

### Decision: 使用 Pinia Store 管理搜尋狀態

**Rationale**:
- 搜尋結果和過濾條件需要在多個組件間共享
- 符合專案 Constitution 的狀態管理原則
- 便於實作搜尋歷史、快取等功能擴展

**State Structure**:
```typescript
{
  searchQuery: string
  selectedCategory: BookCategory | null
  searchResults: Book[]
  loading: boolean
  error: Error | null
}
```

**Alternatives considered**:
- 僅使用組件本地狀態：無法在多個組件間共享，不符合需求

## 錯誤處理策略

### Decision: 使用統一的錯誤處理機制

**Rationale**:
- 符合專案 Constitution 的 API 整合標準
- 使用現有的 `useApi` composable 處理 loading 和錯誤狀態
- 確保錯誤訊息一致且使用者友善

**Implementation**:
- 網路錯誤：顯示「網路連線失敗，請檢查網路設定」
- API 錯誤：顯示「搜尋失敗，請稍後再試」
- 空結果：顯示「找不到相關書籍，請嘗試其他關鍵字」

**Alternatives considered**:
- 每個組件自行處理錯誤：會導致錯誤處理不一致

## UI/UX 設計決策

### Decision: 使用 Tailwind CSS 工具類別

**Rationale**:
- 符合專案 Constitution 的 UX 一致性原則
- 使用統一的設計系統，確保視覺一致性
- 現有組件已使用 Tailwind CSS

**Design Patterns**:
- 搜尋輸入框：使用現有的設計風格，保持一致性
- 分類標籤：使用按鈕樣式，支援 active 狀態視覺回饋
- Loading 狀態：使用統一的 spinner 組件或 skeleton loader

**Alternatives considered**:
- 自訂 CSS：不符合專案規範，會增加維護成本

## 型別定義

### Decision: 擴展現有的型別定義

**Rationale**:
- `src/types/book.ts` 已定義 `BookSearchQueryDto` 和 `Book` 介面
- 符合專案 Constitution 的 TypeScript 標準
- 確保型別一致性和可重用性

**Type Extensions**:
- 擴充 `BookSearchQueryDto` 以支援前端特定的搜尋參數
- 確保 API 回應型別與後端一致

**Alternatives considered**:
- 建立新的型別定義：會導致型別重複和不一致

## 測試策略

### Decision: 實作多層級測試

**Rationale**:
- 符合專案 Constitution 的測試標準
- 確保功能品質和可維護性

**Test Levels**:
1. **Unit Tests**: 測試 composables 和 store actions
2. **Component Tests**: 測試組件渲染和使用者互動
3. **Integration Tests**: 測試完整的搜尋流程（包含 API mock）

**Coverage Goals**:
- Composables: 80%+
- Stores: 80%+
- Components: 70%+

**Alternatives considered**:
- 僅實作 E2E 測試：無法快速定位問題，不符合測試金字塔原則
