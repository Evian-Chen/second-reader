import type { NotificationType } from "./Enums";

/* ===========================
 * OpenAPI Schemas (Notification)
 * =========================== */

/** OpenAPI: NotificationDto */
export interface NotificationDto {
  id?: string; // uuid
  title?: string | null;
  content?: string | null;
  receiverAccountId?: string | null;
  actorAccountId?: string | null;
  notificationType?: NotificationType;
  createdAt?: string; // date-time
  readAt?: string | null; // date-time
  unRead?: boolean;
}

/* ===========================
 * /api/me/notification Endpoints
 * =========================== */

/** GET /api/me/notification?UnReadOnly= */
export interface GetMyNotificationsQuery {
  /** 是否只取得未讀訊息 */
  UnReadOnly?: boolean;
}
/** GET /api/me/notification -> 200 NotificationDto[] */
export type GetMyNotificationsResponse = NotificationDto[];

/** GET /api/me/notification/{id} */
export interface GetMyNotificationByIdPath {
  id: string; // uuid
}
/** GET /api/me/notification/{id} -> 200 NotificationDto */
export type GetMyNotificationByIdResponse = NotificationDto;
