"use client";

import Link from "next/link";
import { Bell } from "lucide-react";

const MOCK_UNREAD_COUNT = 0;

export function NotificationPanel() {
  return (
    <Link
      href="/notifications"
      className="relative p-1.5 hover:bg-muted rounded-lg transition-colors inline-flex"
      aria-label="通知"
    >
      <Bell className="h-5 w-5" />
      {MOCK_UNREAD_COUNT > 0 ? (
        <span className="absolute top-0.5 right-0.5 h-2 w-2 bg-destructive rounded-full" />
      ) : null}
    </Link>
  );
}
