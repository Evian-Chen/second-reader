"use client";

import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { setApiAuth } from "@/lib/api/client";

/**
 * 在 client 掛載時將 Clerk 的 getToken 注入 API client，
 * 之後 RTK Query 的 API 請求會自動帶上 Bearer token。
 * 須放在 ClerkProvider 內。
 */
export default function ApiAuthSetter() {
  const { getToken } = useAuth();

  useEffect(() => {
    setApiAuth(async () => {
      try {
        return await getToken();
      } catch {
        return null;
      }
    });
  }, [getToken]);

  return null;
}
