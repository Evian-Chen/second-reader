"use client";

import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ProfileByIdPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";

  return (
    <div className="mx-auto max-w-4xl px-6 py-12 text-center">
      <p className="text-muted-foreground mb-4">
        查看其他使用者頁面功能即將推出。（目前無 GET /api/users/:id）
      </p>
      <Link href="/">
        <Button>返回首頁</Button>
      </Link>
    </div>
  );
}
