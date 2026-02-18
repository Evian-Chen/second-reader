import api from "../api";

import type {
  GetMeResponse,
  UpdateMeRequest,
  UpdateMeResponse
} from "@/types/me";

export default {
  getMe: () =>
    api<GetMeResponse>('get', '/me'),

  updateMe: (params: UpdateMeRequest) =>
    api<UpdateMeResponse>('put', '/me', params)
}
