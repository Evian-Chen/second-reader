# Tasks: 首頁書籍搜尋和過濾功能

**Input**: Design documents from `/specs/001-book-search-filter/`  
**Prerequisites**: plan.md (required), spec.md (required for user stories), data-model.md, contracts/

**Tests**: Tests are included as per project Constitution requirements (composables 80%+, stores 80%+, components 70%+).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `frontend/src/` for source code, `frontend/tests/` for tests

---

## Phase 1: Setup (Type Definitions & Services)

**Purpose**: Establish type definitions, API service layer, and mock API setup that all user stories depend on

- [x] T001 [P] Install MSW (Mock Service Worker) dependencies: `npm install --save-dev msw@latest` (需要手動執行: `npm install --save-dev msw@latest`)
- [x] T002 [P] Initialize MSW in `src/mocks/handlers.ts` for API mocking
- [x] T003 [P] Create mock handler for POST /api/books/search in `src/mocks/handlers.ts` based on Swagger schema
- [x] T004 [P] Setup MSW worker in `src/mocks/browser.ts` for development
- [x] T005 [P] Configure MSW in `src/main.ts` to enable mock API in development mode
- [x] T006 [P] Update BookSearchQueryDto interface in `src/types/book.ts` to match API contract (已存在且符合)
- [x] T007 [P] Add searchBooks service function in `src/services/book.ts` for POST /api/books/search endpoint
- [x] T008 [P] Export searchBooks function from `src/services/index.ts`
- [x] T009 [P] Create useBookSearch composable in `src/composables/useBookSearch.ts` with debounce logic

**Checkpoint**: Type definitions, API service layer, and mock API ready - user story implementation can now begin

**Note**: MSW allows frontend development without backend. When backend is ready, simply disable MSW or switch API_BASE_URL.

---

## Phase 2: User Story 1 - 關鍵字搜尋書籍 (Priority: P1) MVP

**Goal**: 使用者可以在首頁的搜尋框中輸入關鍵字（書名、作者、ISBN），系統會顯示符合條件的書籍列表。

**Independent Test**: 在搜尋框輸入書名關鍵字（如「原子習慣」），驗證系統是否正確顯示相關書籍，並且結果與輸入的關鍵字相關。

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T010 [P] [US1] Unit test for useBookSearch composable in `tests/unit/composables/useBookSearch.test.ts` (use MSW for API mocking)
- [ ] T011 [P] [US1] Component test for BookSearchBar in `tests/component/BookSearchBar.test.ts` (use MSW for API mocking)
- [ ] T012 [P] [US1] Store test for searchBooks action in `tests/unit/stores/book.test.ts` (use MSW for API mocking)

### Implementation for User Story 1

- [ ] T013 [US1] Update BookState interface in `src/stores/book.ts` to include searchQuery, loading, error states
- [ ] T014 [US1] Implement searchBooks action in `src/stores/book.ts` that calls bookService.searchBooks
- [ ] T015 [US1] Add getters (hasResults, isEmpty, isSearching) in `src/stores/book.ts`
- [ ] T016 [US1] Create BookSearchBar component in `src/components/BookSearchBar.vue` with input field and search button
- [ ] T017 [US1] Integrate BookSearchBar component into `src/views/HomeView.vue` replacing existing search input
- [ ] T018 [US1] Connect BookSearchBar to book store searchBooks action in `src/views/HomeView.vue`
- [ ] T019 [US1] Display loading state during search in `src/views/HomeView.vue`
- [ ] T020 [US1] Display empty result message when no books found in `src/views/HomeView.vue`
- [ ] T021 [US1] Display error message with retry button on search failure in `src/views/HomeView.vue`
- [ ] T022 [US1] Implement debounce mechanism in useBookSearch composable (300ms delay)
- [ ] T023 [US1] Handle Enter key press to trigger search in `src/components/BookSearchBar.vue`
- [ ] T024 [US1] Handle empty/whitespace-only input validation in `src/components/BookSearchBar.vue`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently. Users can search books by keyword and see results.

---

## Phase 3: User Story 2 - 書籍分類過濾 (Priority: P1)

**Goal**: 使用者可以透過選擇書籍分類（如：文學小說、商業理財、心理勵志等）來過濾顯示的書籍列表。

**Independent Test**: 點擊分類標籤（如「類型文學」），驗證系統是否正確過濾並顯示該分類的書籍，且其他分類的書籍不會顯示。

### Tests for User Story 2

- [ ] T025 [P] [US2] Component test for BookCategoryFilter in `tests/component/BookCategoryFilter.test.ts` (use MSW for API mocking)
- [ ] T026 [P] [US2] Store test for setCategory action in `tests/unit/stores/book.test.ts` (use MSW for API mocking)

### Implementation for User Story 2

- [x] T027 [US2] Update BookState interface in `src/stores/book.ts` to include selectedCategory state
- [x] T028 [US2] Implement setCategory action in `src/stores/book.ts` that updates selectedCategory and triggers search
- [x] T029 [US2] Create BookCategoryFilter component in `src/components/BookCategoryFilter.vue` with category buttons
- [x] T030 [US2] Map BookCategory enum values to display names in `src/components/BookCategoryFilter.vue` (使用 useBookCategories)
- [x] T031 [US2] Implement "全部" category option in `src/components/BookCategoryFilter.vue` to clear filter
- [x] T032 [US2] Integrate BookCategoryFilter component into `src/views/HomeView.vue`
- [x] T033 [US2] Connect BookCategoryFilter to book store setCategory action in `src/views/HomeView.vue`
- [x] T034 [US2] Update searchBooks action to include bookCategory in search query in `src/stores/book.ts`
- [x] T035 [US2] Display active category state visually in `src/components/BookCategoryFilter.vue`
- [x] T036 [US2] Display empty message when category has no books in `src/views/HomeView.vue`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently. Users can search by keyword and filter by category.

---

## Phase 4: User Story 3 - 搜尋與過濾組合使用 (Priority: P2)

**Goal**: 使用者可以同時使用關鍵字搜尋和分類過濾，系統會顯示同時符合兩個條件的書籍。

**Independent Test**: 先選擇「類型文學」分類，再輸入關鍵字「習慣」，驗證系統是否正確顯示「類型文學」分類中書名或作者包含「習慣」的書籍。

### Tests for User Story 3

- [ ] T037 [P] [US3] Integration test for combined search and filter in `tests/integration/book-search.test.ts` (use MSW for API mocking)
- [ ] T038 [P] [US3] Store test for combined search query in `tests/unit/stores/book.test.ts` (use MSW for API mocking)

### Implementation for User Story 3

- [x] T039 [US3] Update searchBooks action to merge searchQuery and selectedCategory in `src/stores/book.ts` (已透過 buildSearchQuery 實作)
- [x] T040 [US3] Ensure searchBooks combines both title/author keywords and bookCategory in API request in `src/stores/book.ts` (已實作)
- [x] T041 [US3] Update BookSearchBar to preserve category filter when clearing search in `src/components/BookSearchBar.vue` (clearSearch 保留分類)
- [x] T042 [US3] Update BookCategoryFilter to preserve search query when changing category in `src/components/BookCategoryFilter.vue` (setCategory 保留搜尋關鍵字)
- [x] T043 [US3] Add clearSearch action in `src/stores/book.ts` that clears searchQuery but preserves category
- [x] T044 [US3] Add reset action in `src/stores/book.ts` that clears both search and category
- [x] T045 [US3] Test combined search and filter scenarios in `src/views/HomeView.vue` (功能已整合)

**Checkpoint**: All user stories should now be independently functional. Users can combine search and filter for precise results.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T046 [P] Add input validation for search query length (max 100 characters) in `src/components/BookSearchBar.vue`
- [ ] T047 [P] Add input sanitization for special characters in `src/components/BookSearchBar.vue`
- [ ] T048 [P] Implement visual feedback on search input focus in `src/components/BookSearchBar.vue`
- [ ] T049 [P] Add accessibility attributes (aria-label, role) to search components
- [ ] T050 [P] Ensure responsive design for mobile devices in `src/components/BookSearchBar.vue` and `src/components/BookCategoryFilter.vue`
- [ ] T051 [P] Add keyboard navigation support for category filter in `src/components/BookCategoryFilter.vue`
- [ ] T052 [P] Optimize debounce timing based on user testing feedback
- [ ] T053 [P] Add loading skeleton for book list during search in `src/views/HomeView.vue`
- [ ] T054 [P] Implement request cancellation for rapid successive searches in `src/composables/useBookSearch.ts`
- [ ] T055 [P] Add error boundary handling for search failures
- [ ] T056 [P] Update TypeScript types to ensure type safety across all components
- [ ] T057 [P] Add environment variable to toggle MSW on/off: `VITE_USE_MOCK_API=true/false`
- [ ] T058 [P] Document how to switch between mock API and real API in README or development guide
- [ ] T059 [P] Run ESLint and fix any linting errors: `npm run lint`
- [ ] T060 [P] Run TypeScript type check: `npm run type-check`
- [ ] T061 [P] Run all tests and ensure coverage meets targets: `npm test`
- [ ] T062 [P] Validate quickstart.md test scenarios manually (using MSW mock data)
- [ ] T063 [P] Code review and refactoring for code quality

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **User Story 1 (Phase 2)**: Depends on Setup completion - BLOCKS User Story 2 and 3
- **User Story 2 (Phase 3)**: Depends on Setup completion - Can work independently but shares store with US1
- **User Story 3 (Phase 4)**: Depends on User Story 1 and 2 completion - Combines functionality from both
- **Polish (Phase 5)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Setup (Phase 1) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Setup (Phase 1) - Shares store with US1 but independently testable
- **User Story 3 (P2)**: Depends on User Story 1 and 2 - Combines search and filter functionality

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation
- Type definitions before services
- Services before stores
- Stores before components
- Components before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel (T001-T009)
- MSW setup (T001-T005) can be done independently before other tasks
- All test tasks for a user story marked [P] can run in parallel
- User Story 1 and User Story 2 can be worked on in parallel after Setup (if different developers)
- All Polish tasks marked [P] can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch MSW setup first (can be done independently):
Task: "Install MSW dependencies"
Task: "Initialize MSW in src/mocks/handlers.ts"
Task: "Create mock handler for POST /api/books/search"
Task: "Setup MSW worker in src/mocks/browser.ts"
Task: "Configure MSW in src/main.ts"

# Launch all tests for User Story 1 together:
Task: "Unit test for useBookSearch composable in tests/unit/composables/useBookSearch.test.ts"
Task: "Component test for BookSearchBar in tests/component/BookSearchBar.test.ts"
Task: "Store test for searchBooks action in tests/unit/stores/book.test.ts"

# Launch type and service setup together:
Task: "Update BookSearchQueryDto interface in src/types/book.ts"
Task: "Add searchBooks service function in src/services/book.ts"
Task: "Create useBookSearch composable in src/composables/useBookSearch.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (Type definitions and services)
2. Complete Phase 2: User Story 1 (Keyword search)
3. **STOP and VALIDATE**: Test User Story 1 independently
4. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Add Polish → Final improvements → Deploy

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup together
2. Once Setup is done:
   - Developer A: User Story 1 (search functionality)
   - Developer B: User Story 2 (category filter) - can start in parallel
3. Once US1 and US2 are done:
   - Developer C: User Story 3 (combined functionality)
4. All developers: Polish phase

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Follow Vue 3 Composition API and TypeScript strict mode per Constitution
- All components must use `<script setup lang="ts">`
- All API calls must go through services layer
- All state changes must go through Pinia store actions
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
