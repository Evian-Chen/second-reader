"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  User,
  LogOut,
  ShoppingBag,
  Package,
  Home,
  PenSquare,
  BookPlus,
  ShoppingCart,
} from "lucide-react";
import { SignInButton, SignedIn, SignedOut, useClerk } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { NotificationPanel } from "@/components/NotificationPanel";
import { CreatePostDialog } from "@/components/CreatePostDialog";
import { CreateBookDialog } from "@/components/CreateBookDialog";
import { useCurrentUser } from "@/clerk/useCurrentUser";

export function Navbar() {
  const router = useRouter();
  const { signOut } = useClerk();
  const { user } = useCurrentUser();

  const handleSignOut = () => {
    signOut({ redirectUrl: "/" });
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logoWhite.png"
              alt="黑白冊"
              width={200}
              height={56}
              className="h-14 w-auto dark:hidden"
            />
            <Image
              src="/logoDark.png"
              alt="黑白冊"
              width={200}
              height={56}
              className="h-14 w-auto hidden dark:block"
            />
          </Link>

          <div className="flex items-center gap-2">
            <SignedIn>
              <CreatePostDialog>
                <button
                  type="button"
                  className="p-1.5 hover:bg-muted rounded-lg transition-colors"
                  aria-label="發布貼文"
                >
                  <PenSquare className="h-5 w-5" />
                </button>
              </CreatePostDialog>
              <div className="h-5 w-px bg-border" />
              <CreateBookDialog>
                <button
                  type="button"
                  className="p-1.5 hover:bg-muted rounded-lg transition-colors"
                  aria-label="上架書籍"
                >
                  <BookPlus className="h-5 w-5" />
                </button>
              </CreateBookDialog>
              <div className="h-5 w-px bg-border" />
              <button
                type="button"
                className="p-1.5 hover:bg-muted rounded-lg transition-colors relative"
                onClick={() => router.push("/cart")}
                aria-label="購物車"
              >
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-foreground text-background text-[10px] rounded-full flex items-center justify-center font-medium">
                  0
                </span>
              </button>
              <div className="h-5 w-px bg-border" />
              <NotificationPanel />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="flex items-center focus:outline-none ml-2"
                    aria-label="使用者選單"
                  >
                    {user ? (
                      <img
                        src={user.avatar}
                        alt={user.userProfile?.displayName ?? user.username ?? "使用者"}
                        className="h-8 w-8 rounded-full object-cover ring-1 ring-border hover:ring-2 hover:ring-foreground transition-all"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                        <User className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {user ? (
                    <>
                      <div className="px-2 py-2">
                        <p className="text-sm font-medium">{user.userProfile?.displayName ?? user.username ?? "使用者"}</p>
                        <p className="text-xs text-muted-foreground">
                          @{user.username}
                        </p>
                      </div>
                      <DropdownMenuSeparator />
                    </>
                  ) : null}
                  <DropdownMenuItem onClick={() => router.push("/profile")}>
                    <User className="mr-2 h-4 w-4" />
                    個人頁面
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/my-shop")}>
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    我的賣場
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/orders")}>
                    <Package className="mr-2 h-4 w-4" />
                    訂單管理
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    登出
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <Button size="sm" variant="outline">
                  登入
                </Button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>
      </div>

      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background">
        <div className="flex items-center justify-around h-14">
          <Link
            href="/"
            className="flex flex-col items-center justify-center gap-0.5 flex-1 h-full text-foreground/60 hover:text-foreground transition-colors"
          >
            <Home className="h-5 w-5" />
            <span className="text-[10px]">首頁</span>
          </Link>
          <Link
            href="/my-shop"
            className="flex flex-col items-center justify-center gap-0.5 flex-1 h-full text-foreground/60 hover:text-foreground transition-colors"
          >
            <ShoppingBag className="h-5 w-5" />
            <span className="text-[10px]">賣場</span>
          </Link>
          <Link
            href="/orders"
            className="flex flex-col items-center justify-center gap-0.5 flex-1 h-full text-foreground/60 hover:text-foreground transition-colors"
          >
            <Package className="h-5 w-5" />
            <span className="text-[10px]">訂單</span>
          </Link>
          <Link
            href="/profile"
            className="flex flex-col items-center justify-center gap-0.5 flex-1 h-full text-foreground/60 hover:text-foreground transition-colors"
          >
            <User className="h-5 w-5" />
            <span className="text-[10px]">我的</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
