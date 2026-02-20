# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

[Extract from feature spec: primary requirement + technical approach from research]

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: [e.g., Python 3.11, Swift 5.9, Rust 1.75 or NEEDS CLARIFICATION]  
**Primary Dependencies**: [e.g., FastAPI, UIKit, LLVM or NEEDS CLARIFICATION]  
**Storage**: [if applicable, e.g., PostgreSQL, CoreData, files or N/A]  
**Testing**: [e.g., pytest, XCTest, cargo test or NEEDS CLARIFICATION]  
**Target Platform**: [e.g., Linux server, iOS 15+, WASM or NEEDS CLARIFICATION]
**Project Type**: [single/web/mobile - determines source structure]  
**Performance Goals**: [domain-specific, e.g., 1000 req/s, 10k lines/sec, 60 fps or NEEDS CLARIFICATION]  
**Constraints**: [domain-specific, e.g., <200ms p95, <100MB memory, offline-capable or NEEDS CLARIFICATION]  
**Scale/Scope**: [domain-specific, e.g., 10k users, 1M LOC, 50 screens or NEEDS CLARIFICATION]

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Vue 3 + TypeScript Compliance

- [ ] 所有新組件使用 Composition API (`<script setup lang="ts">`)
- [ ] 所有型別定義完整，無 `any` 型別（除非有明確理由）
- [ ] Props 和 Emits 使用 `defineProps<T>()` 和 `defineEmits<T>()`
- [ ] API 回應資料定義完整型別（`src/types/api.ts`）

### Component Design

- [ ] 組件遵循單一職責原則，檔案大小 < 300 行
- [ ] 複雜 UI 邏輯已拆分為子組件
- [ ] 組件命名使用 PascalCase，與檔案名稱一致

### State Management (Pinia)

- [ ] Store 使用 `defineStore()` 並有明確的 store ID
- [ ] State 使用函數形式定義
- [ ] Actions 處理所有異步操作
- [ ] 避免在組件中直接修改 store state

### API Integration

- [ ] API 呼叫透過 `src/services/` 中的 service 函數
- [ ] Service 函數定義明確的請求/回應型別
- [ ] 使用 `useApi` composable 處理 loading 和錯誤狀態

### UX Consistency

- [ ] 所有異步操作顯示 loading 狀態
- [ ] 錯誤訊息使用者友善，提供解決建議
- [ ] 使用統一的 Tailwind CSS 設計系統
- [ ] 動畫過渡時間統一（200ms/300ms）
- [ ] 圖片有 alt 屬性，表單元素有 label

### Testing

- [ ] 新功能包含適當的測試（unit/component/integration）
- [ ] 測試覆蓋率符合目標（composables 80%+, stores 80%+, components 70%+）

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
# [REMOVE IF UNUSED] Option 1: Single project (DEFAULT)
src/
├── models/
├── services/
├── cli/
└── lib/

tests/
├── contract/
├── integration/
└── unit/

# [REMOVE IF UNUSED] Option 2: Web application (when "frontend" + "backend" detected)
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

# [REMOVE IF UNUSED] Option 3: Mobile + API (when "iOS/Android" detected)
api/
└── [same as backend above]

ios/ or android/
└── [platform-specific structure: feature modules, UI flows, platform tests]
```

**Structure Decision**: [Document the selected structure and reference the real
directories captured above]

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
