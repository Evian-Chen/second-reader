/**
 * API config & auth - 供 RTK Query 使用
 * - getApiBaseUrl: 依 NEXT_PUBLIC_API_BASE_URL 組出後端 /api base URL
 * - setApiAuth / getAuthHeaders: 注入 Clerk getToken，供 prepareHeaders 帶 Bearer
 * - 瀏覽器與 SSR 皆可用
 */

const DEFAULT_API_BASE = "https://second-reader.onrender.com";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULT_API_BASE;
const API_PREFIX = "/api";

/** 移除尾隨斜線，避免組出 //api 雙斜線 */
const normalizeBase = (url: string) => url.replace(/\/+$/, "");

export const getApiBaseUrl = () => `${normalizeBase(BASE_URL)}${API_PREFIX}`;

export type GetToken = () => Promise<string | null>;

export interface ClientConfig {
  getToken?: GetToken;
}

let globalGetToken: GetToken | undefined;

export function setApiAuth(getToken: GetToken) {
  globalGetToken = getToken;
}

/** 取得帶 Bearer 的 headers，供 RTK Query baseQuery 使用 */
export function getAuthHeaders(config?: ClientConfig): Promise<HeadersInit> {
  const getToken = config?.getToken ?? globalGetToken;
  if (!getToken) return Promise.resolve({} as HeadersInit);

  return getToken().then((token): HeadersInit =>
    token ? { Authorization: `Bearer ${token}` } : ({} as HeadersInit)
  );
}
