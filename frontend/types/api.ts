export interface ApiErrorResponse {
  error?: string | null;
  code?: string | null;
  errors?: Record<string, string[] | null> | null;
}

export type ApiResponse<T> = T | ApiErrorResponse;

export function isApiError(res: unknown): res is ApiErrorResponse {
  return typeof res === "object" && res !== null && "error" in res;
}
