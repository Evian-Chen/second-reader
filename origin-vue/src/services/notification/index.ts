import api from "../api";

import type {
  GetMyNotificationByIdPath,
  GetMyNotificationByIdResponse,
  GetMyNotificationsQuery,
  GetMyNotificationsResponse
} from "@/types/notification";

export default {
  getNotification: (params?: GetMyNotificationsQuery) =>
    api<GetMyNotificationsResponse>('get', `me/notification?UnReadOnly=${params?.UnReadOnly}`),

  geNotificationById: (param: GetMyNotificationByIdPath) => {
    if (!param.id) throw new Error("Notification Id is required.");
    return api<GetMyNotificationByIdResponse>('get', `/me/notification/${param.id}`)
  }
}
