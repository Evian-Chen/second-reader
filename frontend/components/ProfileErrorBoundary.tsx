"use client";

import { Component, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * 個人頁面用 Error Boundary：避免 API 或子元件拋錯時整頁白畫面。
 */
export class ProfileErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto max-w-4xl px-6 py-12 text-center">
          <p className="text-muted-foreground mb-4">
            載入個人頁面時發生錯誤，請稍後再試或返回首頁。
          </p>
          <Link href="/">
            <Button>返回首頁</Button>
          </Link>
        </div>
      );
    }
    return this.props.children;
  }
}
