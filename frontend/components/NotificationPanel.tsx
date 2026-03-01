"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import {
  useGetNotificationsQuery,
  useReadAllNotificationsMutation,
  useMarkNotificationReadMutation,
} from "@/redux/services/api";
import type { Notification, NotificationType } from "@/types";

/** 依 notificationType 推導導向連結（API 無 linkTo 欄位） */
function getLinkFromNotification(n: Notification): string | undefined {
  const t = n.notificationType;
  if (!t) return undefined;
  const orderTypes: NotificationType[] = [
    "OrderCreated",
    "OrderRequest",
    "OrderRejected",
    "OrderAccepted",
    "OrderCompletedBySeller",
    "OrderCompletedByBuyer",
  ];
  if (orderTypes.includes(t)) return "/orders";
  if (t === "WaitlistAccepted" || t === "WaitlistCanceled") return "/my-shop";
  if (t === "CartItemExpired") return "/cart";
  if (t === "WelcomeMsg") return "/";
  return "/notifications";
}

/** 將 ISO 日期轉為相對時間 */
function formatRelativeTime(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 1) return "剛剛";
  if (diffMins < 60) return `${diffMins}分鐘前`;
  if (diffHours < 24) return `${diffHours}小時前`;
  if (diffDays < 7) return `${diffDays}天前`;
  return date.toLocaleDateString("zh-TW");
}

export function NotificationPanel() {
  const router = useRouter();
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const { data: allNotifications = [], isLoading } =
    useGetNotificationsQuery(undefined);

  const [markRead] = useMarkNotificationReadMutation();
  const [readAll, { isLoading: readingAll }] = useReadAllNotificationsMutation();

  const unreadCount = allNotifications.filter((n) => n.unRead).length;
  const notifications =
    filter === "unread"
      ? allNotifications.filter((n) => n.unRead)
      : allNotifications;

  const handleNotificationClick = async (n: Notification) => {
    if (n.unRead) {
      try {
        await markRead(n.id).unwrap();
      } catch {
        // ignore
      }
    }
    const link = getLinkFromNotification(n);
    if (link) router.push(link);
  };

  const handleMarkAllRead = async () => {
    try {
      await readAll().unwrap();
    } catch {
      // ignore
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="relative p-1.5 hover:bg-muted rounded-lg transition-colors"
          aria-label="通知"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0.5 right-0.5 h-2 w-2 bg-destructive rounded-full" />
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="border-b border-border px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-sm">通知</h3>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                disabled={readingAll}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
              >
                全部已讀
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant={filter === "all" ? "default" : "ghost"}
              size="sm"
              className="flex-1 h-7 text-xs"
              onClick={() => setFilter("all")}
            >
              全部 ({allNotifications.length})
            </Button>
            <Button
              variant={filter === "unread" ? "default" : "ghost"}
              size="sm"
              className="flex-1 h-7 text-xs"
              onClick={() => setFilter("unread")}
            >
              未讀 ({unreadCount})
            </Button>
          </div>
        </div>
        <div className="max-h-[400px] overflow-y-auto">
          {isLoading ? (
            <div className="px-4 py-8 text-center">
              <p className="text-sm text-muted-foreground">載入中...</p>
            </div>
          ) : notifications.length > 0 ? (
            <div className="divide-y divide-border">
              {notifications.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => handleNotificationClick(n)}
                  className={`w-full text-left px-4 py-3 hover:bg-muted transition-colors ${
                    n.unRead ? "bg-muted/30" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm mb-1 ${n.unRead ? "font-medium" : ""}`}
                      >
                        {n.title || "通知"}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-1">
                        {n.content || ""}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatRelativeTime(n.createdAt)}
                      </p>
                    </div>
                    {n.unRead && (
                      <div className="h-2 w-2 bg-foreground rounded-full mt-1 shrink-0" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="px-4 py-8 text-center">
              <Bell className="h-8 w-8 text-muted-foreground/20 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                {filter === "unread" ? "沒有未讀通知" : "目前沒有通知"}
              </p>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
