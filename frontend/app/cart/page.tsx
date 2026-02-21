"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { BookDisplay } from "@/lib/types/display";
import { toBookDisplay } from "@/lib/adapters/books";

const mockBooksForCart: BookDisplay[] = [
  toBookDisplay({
    userBookId: "cart-1",
    title: "百年孤寂",
    author: "加西亞·馬奎斯",
    bookCategory: "World",
    sellerAccountId: "2",
  }),
  toBookDisplay({
    userBookId: "cart-2",
    title: "挪威的森林",
    author: "村上春樹",
    bookCategory: "World",
    sellerAccountId: "3",
  }),
].map((b, i) => ({
  ...b,
  id: `cart-${i + 1}`,
  price: [280, 220][i] ?? 0,
  cover:
    i === 0
      ? "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop"
      : "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&h=600&fit=crop",
}));

interface CartItem {
  book: BookDisplay;
  quantity: number;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { book: mockBooksForCart[0], quantity: 1 },
    { book: mockBooksForCart[1], quantity: 1 },
  ]);

  const updateQuantity = (bookId: string, delta: number) => {
    setCartItems((items) =>
      items.map((item) =>
        item.book.id === bookId
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (bookId: string) => {
    setCartItems((items) => items.filter((item) => item.book.id !== bookId));
  };

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.book.price * item.quantity,
    0
  );

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-4xl px-6 py-8">
          <Link href="/">
            <Button variant="ghost" className="mb-8 gap-2 -ml-2">
              <ArrowLeft className="h-4 w-4" />
              返回
            </Button>
          </Link>
          <div className="text-center py-16">
            <ShoppingCart className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
            <h2 className="text-lg font-medium mb-2">購物車是空的</h2>
            <p className="text-sm text-muted-foreground mb-6">
              到首頁逛逛，把喜歡的書加入購物車吧！
            </p>
            <Link href="/">
              <Button>去逛逛</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-6 py-8">
        <Link href="/">
          <Button variant="ghost" className="mb-8 gap-2 -ml-2">
            <ArrowLeft className="h-4 w-4" />
            返回
          </Button>
        </Link>

        <h1 className="text-2xl font-medium mb-6">購物車</h1>
        <p className="text-sm text-muted-foreground mb-8">
          目前為 mock 資料，TODO: 接 Cart API
        </p>

        <div className="space-y-6 border-b border-border pb-8">
          {cartItems.map((item) => (
            <div
              key={item.book.id}
              className="flex gap-4 border border-border rounded-lg p-4"
            >
              <img
                src={item.book.cover}
                alt={item.book.title}
                className="w-16 aspect-2/3 object-cover rounded shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-medium line-clamp-2">{item.book.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {item.book.author}
                </p>
                <p className="text-sm font-medium mt-2">
                  NT$ {item.book.price}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateQuantity(item.book.id, -1)}
                  >
                    -
                  </Button>
                  <span className="w-8 text-center text-sm">
                    {item.quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateQuantity(item.book.id, 1)}
                  >
                    +
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(item.book.id)}
                    className="ml-auto text-muted-foreground"
                  >
                    移除
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-between items-center">
          <p className="text-lg font-medium">
            總計：NT$ {totalAmount.toLocaleString()}
          </p>
          <Button size="lg">前往結帳</Button>
        </div>
      </div>
    </div>
  );
}
