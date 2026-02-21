import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Bell } from "lucide-react";
import { useState } from "react";
import { mockNotifications } from "../data/mockData";
import { useNavigate } from "react-router";
import { Button } from "./ui/button";

export function NotificationPanel() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const navigate = useNavigate();
  
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const filteredNotifications = filter === "unread" 
    ? notifications.filter(n => !n.isRead)
    : notifications;

  const handleNotificationClick = (notification: typeof notifications[0]) => {
    // Mark as read
    setNotifications(prev =>
      prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n)
    );
    
    // Navigate if has link
    if (notification.linkTo) {
      navigate(notification.linkTo);
    }
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="relative p-1.5 hover:bg-muted rounded-lg transition-colors">
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
                onClick={markAllAsRead}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
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
              全部 ({notifications.length})
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
          {filteredNotifications.length > 0 ? (
            <div className="divide-y divide-border">
              {filteredNotifications.map((notification) => (
                <button
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`w-full text-left px-4 py-3 hover:bg-muted transition-colors ${
                    !notification.isRead ? "bg-muted/30" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm mb-1 ${!notification.isRead ? "font-medium" : ""}`}>
                        {notification.title}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground">{notification.createdAt}</p>
                    </div>
                    {!notification.isRead && (
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