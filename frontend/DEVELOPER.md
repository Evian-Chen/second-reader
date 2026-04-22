# Second Reader 前端開發說明

本文件給接手維護 `frontend/` 的開發者使用，涵蓋環境、架構、慣例與與後端串接時需注意的項目。

## 技術棧

- **Vue 3**（Composition API，`<script setup>` + TypeScript）
- **Vite** 建置與開發伺服器
- **Vue Router** 路由與導航守衛
- **Pinia** 狀態管理
- **Axios** HTTP 客戶端
- **Element Plus** UI 元件（例如 `ElMessage`）
- 樣式以各元件 **scoped CSS** 為主，全域樣式見 `src/assets/main.css`

## 開始使用

### 必要條件

- Node.js（與專案 `package.json` 相符的 LTS 建議）
- npm（或相容的 pnpm / yarn）

### 安裝與指令

```bash
cd frontend
npm install
npm run dev
```

其他常用指令：

| 指令 | 說明 |
|------|------|
| `npm run dev` | 啟動開發伺服器（含 HMR） |
| `npm run build` | 型別檢查 + 正式建置 |
| `npm run type-check` | 僅執行 `vue-tsc` |
| `npm run preview` | 預覽建置結果 |
| `npm run test:unit` | 單元測試（Vitest） |

## 環境變數

以 Vite 慣例使用 `import.meta.env`：

| 變數 | 說明 |
|------|------|
| `VITE_API_BASE_URL` | 後端 API 根位址（例如 `https://localhost:7xxx`），傳給 `src/api/axiosInstance.ts` 的 `baseURL` |
| `VITE_DEMO_MODE` | 設為 `true` 時：不強制登入、部分畫面使用本機假資料，方便離線預覽（見 `src/config/demoMode.ts`） |

請在專案根目錄建立 `.env`、`.env.local` 或各環境的 `.env.*`；勿將含敏感資訊的檔案提交至版本庫。

## 目錄結構（`src/`）

| 路徑 | 用途 |
|------|------|
| `api/axiosInstance.ts` | 共用的 Axios 實例：預設 JSON、`Authorization: Bearer`、**FormData 時會移除 `Content-Type` 以便帶上 multipart boundary** |
| `api/types/secondReader.ts` | 與後端對應的 DTO 型別 |
| `components/` | 可複用元件（導列、Modal、通知等） |
| `config/demoMode.ts` | DEMO 模式旗標 |
| `data/demoMocks.ts` | DEMO 用假資料 |
| `layouts/` | 例如 `MainLayout`（導列 + 內容區） |
| `router/index.ts` | 路由表、`meta.requiresAuth` / `meta.showInNav` 等 |
| `services/secondReaderService.ts` | 封裝後端 API 方法，頁面應盡量透過此檔呼叫 |
| `stores/` | Pinia：`auth`、`ui`、`demoData` 等 |
| `views/` | 各頁面與子路由畫面（含單則貼文、使用者主頁等） |
| `App.vue` / `main.ts` | 根元件與掛載（含 Element Plus 全域註冊） |

**常見前臺路徑：** `/posts` 貼文列表；`/post/:postId` 單則貼文與留言；`/book/:userBookId` 書籍詳情；`/user/:accountId` 公開主頁（與需登入的 `/me` 個人工作區不同）。

### 路由 ID 混淆（book / post）

- `post` 與 `book` 詳情頁 URL 參數採用混淆字串（例如 `x_...`），不是直接顯示資料庫 ID。
- 實作位置：`src/utils/routeObfuscation.ts`
  - `encodeRouteGuid(id)`：導頁前編碼
  - `decodeRouteGuid(routeParam)`：進頁後解碼
- 舊連結相容：若參數不是混淆格式，會回退使用原值，避免既有連結失效。
- 新增需要導向 `post-detail` / `book-detail` 的地方時，務必在 `router.push` 或 `RouterLink` 先做 `encodeRouteGuid(...)`。
- 詳情頁內取參數後，務必先做 `decodeRouteGuid(...)` 再呼叫 API。

## 與後端溝通

- **基礎路徑**：`axios` 的 `baseURL` = `VITE_API_BASE_URL`。
- **驗證**：登入後將 token 存於 `localStorage` 的 `second_reader_token`，`axiosInstance` 會自動附加 `Authorization` 標頭。
- **JSON**：多數 `POST/PUT` 使用 JSON body，與後端 Newtonsoft 慣例之 camelCase 屬性名對應即可。
- **檔案上傳**（`multipart/form-data`）：需使用 `FormData`。本專案在 request interceptor 中對 `FormData` **刪除**預設的 `Content-Type: application/json`，讓瀏覽器自行帶上正確的 boundary。新增上傳 API 時請沿用此模式。

### 書籍：ISBN 圖片自動填寫

後端提供：

- `POST /api/books/isbn`（需 `Authorize`）  
- `Content-Type: multipart/form-data`  
- 欄位名稱 **`Img`**（`IFormFile`），建議為含 ISBN 條碼之照片。  
- 成功時回傳 `GoogleBookResultDto`（書名、作者陣列、ISBN、Google Books 預覽連結）。

前端實作位置：

- `secondReaderService.prefillBookFromIsbnImage(file)`  
- `components/modals/BookUploadModal.vue`：選圖後呼叫上述 API 並帶入表單。  
- DEMO 模式下不呼叫後端，改為模擬延遲與假資料（見 modal 內邏輯）。

正式上傳書籍仍使用既有：

- `POST /api/books` + JSON body `UploadUserBookPayload[]`（`uploadBooks`）。

## 驗證與導向

- `router/index.ts` 的 `beforeEach` 會依 `meta.requiresAuth` 在**非** DEMO 模式時導向登入頁。
- 使用者狀態（是否登入、profile）在 `src/stores/auth.ts`，應用啟動時於 `App.vue` 的 `onMounted` 內觸發 `checkAuth()`。

## UI 與導航

- 主要版面：`MainLayout` + `TheNavbar`（含桌面圖示列、行動裝置側邊欄、通知浮層等）。
- 部分全域 UI 狀態放在 `ui` store（例如貼文/上架 modal、通知面板是否顯示）。
- `PostDetailView` 的「查看書籍」會優先導向該貼文關聯到的書籍詳情頁；`UserProfileView` 書籍卡片會直接開該本書詳情，而非回書籍列表。

## 建置與部署

- `npm run build` 產出於 `dist/`，可部署到任意靜態檔主機；請設定與實際後端位址一致之 `VITE_API_BASE_URL`（建置時或依環境檔替換）。

## 程式風格與靜態檢查

- ESLint、Oxlint、Prettier 之設定以專案內 `eslint.config.js`、`prettier` 等為準；提交前可執行 `npm run lint`。
- 以 **TypeScript 嚴格**為目標；新增型別時優先補在 `api/types/secondReader.ts` 或專用型別檔。

## 相關後端專案

- API 契約、狀態碼與錯誤格式以 `backend` 內 Controller / Dto 為準；若後端變更欄位名稱或路由，需同步更新 `secondReaderService` 與型別定義。

若你擴充了新的模組，建議在本文件補上簡短小節（路由、主要 API、所依賴的 store），方便下一位同事快速對齊。
