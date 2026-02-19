/**
 * Me API
 */
import { api } from "./client";
import type { GetMeResponse, UpdateMeBody, UpdateMeResponse } from "./types";
import type { RequestOptions } from "./client";

const path = "/me";

export const meApi = {
  getMe: (options?: RequestOptions) =>
    api.get<GetMeResponse>(path, undefined, options),

  updateMe: (body: UpdateMeBody, options?: RequestOptions) =>
    api.put<UpdateMeResponse>(path, body, options),
};

export default meApi;
