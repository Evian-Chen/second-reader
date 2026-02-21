/**
 * API Client - 以 fetch 為基礎，符合 Next.js 使用情境
 * - 支援 Bearer token（可注入 getToken，例如 Clerk getToken()）
 * - 基礎 URL 來自 NEXT_PUBLIC_API_BASE_URL
 * - 在瀏覽器內改走同源 /api-proxy，由 Next.js rewrites 轉發到後端，避免 CORS
 */

const isBrowser = typeof window !== "undefined";
const DEFAULT_API_BASE = "https://second-reader.onrender.com";

const BASE_URL = isBrowser
  ? window.location.origin
  : process.env.NEXT_PUBLIC_API_BASE_URL || DEFAULT_API_BASE;

const API_PREFIX = isBrowser ? "/api-proxy" : "/api";

export type GetToken = () => Promise<string | null>;

export interface ClientConfig {
  getToken?: GetToken;
}

let globalGetToken: GetToken | undefined;

export function setApiAuth(getToken: GetToken) {
  globalGetToken = getToken;
}

function getAuthHeaders(config?: ClientConfig): Promise<HeadersInit> {
  const getToken = config?.getToken ?? globalGetToken;
  if (!getToken) return Promise.resolve({} as HeadersInit);

  return getToken().then((token): HeadersInit =>
    token ? { Authorization: `Bearer ${token}` } : ({} as HeadersInit)
  );
}

export interface RequestOptions extends RequestInit {
  getToken?: GetToken;
  params?: Record<string, string | number | boolean | undefined>;
}

async function request<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { getToken, params, ...init } = options;

  const url = new URL(API_PREFIX + path, BASE_URL);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) url.searchParams.set(key, String(value));
    });
  }

  const auth = await getAuthHeaders({ getToken });
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...auth,
    ...init.headers,
  };

  if (init.body instanceof FormData) {
    const { "Content-Type": _, ...rest } = headers as Record<string, string>;
    Object.assign(headers, rest);
    delete (headers as Record<string, unknown>)["Content-Type"];
  }

  const res = await fetch(url.toString(), {
    ...init,
    headers,
  });

  const text = await res.text();
  const data = text ? (JSON.parse(text) as T) : (null as T);

  if (!res.ok) {
    const err = new Error(
      (data as { error?: string })?.error || res.statusText || "API Error"
    ) as Error & { status: number; data: unknown };
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data as T;
}

export const api = {
  get: <T>(path: string, params?: RequestOptions["params"], options?: RequestOptions) =>
    request<T>(path, { ...options, method: "GET", params }),

  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "POST", body: body ? JSON.stringify(body) : undefined }),

  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "PUT", body: body ? JSON.stringify(body) : undefined }),

  delete: <T>(path: string, params?: RequestOptions["params"], options?: RequestOptions) =>
    request<T>(path, { ...options, method: "DELETE", params }),
};

export default api;
