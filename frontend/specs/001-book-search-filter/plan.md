# Implementation Plan: 首頁書籍搜尋和過濾功能

**Branch**: `001-book-search-filter` | **Date**: 2026-02-07 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/001-book-search-filter/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

實作首頁的書籍搜尋和過濾功能，允許使用者透過關鍵字（書名、作者、ISBN）搜尋書籍，並透過分類標籤過濾書籍列表。功能將整合現有的 API 端點，使用 Vue 3 Composition API、Pinia 狀態管理和 TypeScript 進行開發，確保型別安全和良好的使用者體驗。

## Technical Context

**Language/Version**: TypeScript 5.9.3, Vue 3.5.26  
**Primary Dependencies**: Vue 3, Pinia 3.0.4, Vue Router 4.6.4, Axios 1.13.4, Tailwind CSS 4.1.18  
**Storage**: N/A (前端功能，資料來自後端 API)  
**Testing**: Vitest, Vue Test Utils, MSW (Mock Service Worker)  
**Target Platform**: Web browsers (modern browsers supporting ES2020+)  
**Project Type**: Web application (frontend)  
**Performance Goals**: 搜尋操作完成時間 ≤ 3 秒，分類過濾響應時間 ≤ 2 秒  
**Constraints**: 必須遵循專案 Constitution 的所有原則，支援至少 1000 筆書籍資料的搜尋和過濾  
**Scale/Scope**: 單一頁面功能，影響 HomeView 組件和相關的 composables、stores、services

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Vue 3 + TypeScript Compliance

- [x] 所有新組件使用 Composition API (`<script setup lang="ts">`)
- [x] 所有型別定義完整，無 `any` 型別（除非有明確理由）
- [x] Props 和 Emits 使用 `defineProps<T>()` 和 `defineEmits<T>()`
- [x] API 回應資料定義完整型別（`src/types/api.ts`）

### Component Design

- [x] 組件遵循單一職責原則，檔案大小 < 300 行
- [x] 複雜 UI 邏輯已拆分為子組件
- [x] 組件命名使用 PascalCase，與檔案名稱一致

### State Management (Pinia)

- [x] Store 使用 `defineStore()` 並有明確的 store ID
- [x] State 使用函數形式定義
- [x] Actions 處理所有異步操作
- [x] 避免在組件中直接修改 store state

### API Integration

- [x] API 呼叫透過 `src/services/` 中的 service 函數
- [x] Service 函數定義明確的請求/回應型別
- [x] 使用 `useApi` composable 處理 loading 和錯誤狀態

### UX Consistency

- [x] 所有異步操作顯示 loading 狀態
- [x] 錯誤訊息使用者友善，提供解決建議
- [x] 使用統一的 Tailwind CSS 設計系統
- [x] 動畫過渡時間統一（200ms/300ms）
- [x] 圖片有 alt 屬性，表單元素有 label

### Testing

- [x] 新功能包含適當的測試（unit/component/integration）
- [x] 測試覆蓋率符合目標（composables 80%+, stores 80%+, components 70%+）

## Project Structure

### Documentation (this feature)

```text
specs/001-book-search-filter/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
frontend/
├── src/
│   ├── components/
│   │   ├── BookCard.vue              # 現有：書籍卡片組件
│   │   ├── BookSearchBar.vue        # 新增：搜尋輸入框組件
│   │   └── BookCategoryFilter.vue   # 新增：分類過濾組件
│   ├── composables/
│   │   ├── useBookCategories.ts      # 現有：書籍分類 composable
│   │   └── useBookSearch.ts         # 新增：搜尋邏輯 composable
│   ├── services/
│   │   ├── api.ts                    # 現有：API 基礎設定
│   │   ├── index.ts                  # 現有：服務匯出
│   │   └── book.ts                   # 新增/更新：書籍相關 API 服務
│   ├── stores/
│   │   ├── book.ts                   # 更新：擴充搜尋和過濾狀態管理
│   │   └── index.ts                  # 現有：store 匯出
│   ├── types/
│   │   ├── api.ts                     # 現有：API 型別定義
│   │   └── book.ts                   # 更新：擴充搜尋相關型別
│   └── views/
│       └── HomeView.vue              # 更新：整合搜尋和過濾功能
└── tests/
    ├── unit/
    │   ├── composables/
    │   │   └── useBookSearch.test.ts  # 新增：搜尋 composable 測試
    │   └── stores/
    │       └── book.test.ts           # 新增：book store 測試
    ├── component/
    │   ├── BookSearchBar.test.ts      # 新增：搜尋組件測試
    │   └── BookCategoryFilter.test.ts # 新增：分類過濾組件測試
    └── integration/
        └── book-search.test.ts       # 新增：搜尋功能整合測試
```

**Structure Decision**: 採用現有的前端專案結構，新增必要的組件、composables、services 和型別定義。遵循專案的組件化設計原則，將搜尋和過濾功能拆分為獨立的組件和 composables，確保程式碼的可維護性和可測試性。

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | N/A | N/A |
