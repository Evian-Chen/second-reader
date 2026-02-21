"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";

export default function NotificationsPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      <h1 className="text-2xl font-medium mb-2">通知</h1>
      <p className="text-sm text-muted-foreground mb-8">
        此功能即將推出，敬請期待。
      </p>
      <div className="text-center py-12 text-muted-foreground">
        <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p className="text-sm">尚無通知</p>
      </div>
      <Link href="/">
        <Button variant="outline" className="mt-4">
          返回首頁
        </Button>
      </Link>
    </div>
  );
}
