"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { mockOrders } from "@/lib/mock/orders";
import type { OrderDisplay } from "@/lib/types/display";
import { Package, ShoppingCart, Calendar, ArrowLeft } from "lucide-react";
import Link from "next/link";

function OrderCard({ order }: { order: OrderDisplay }) {
  return (
    <div className="border-b border-border pb-6 last:border-0">
      <div className="flex gap-4">
        <div className="w-16 shrink-0">
          <img
            src={order.bookCover}
            alt={order.bookTitle}
            className="w-full aspect-[2/3] object-cover rounded"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-medium mb-1 line-clamp-1">{order.bookTitle}</h3>
              <p className="text-xs text-muted-foreground">
                {order.type === "purchase"
                  ? `賣家：${order.sellerName ?? "—"}`
                  : `買家：${order.buyerName ?? "—"}`}
              </p>
            </div>
            <span className="text-xs text-muted-foreground ml-4 shrink-0">
              {order.status}
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3 w-3" />
              {order.createdAt}
            </div>
            <div className="font-medium text-foreground">NT$ {order.price}</div>
          </div>
          <div className="flex gap-2">
            {order.status === "待確認" && order.type === "sale" ? (
              <>
                <Button size="sm" variant="outline">
                  確認訂單
                </Button>
                <Button size="sm" variant="ghost">
                  取消訂單
                </Button>
              </>
            ) : null}
            {order.status === "已確認" && order.type === "sale" ? (
              <Button size="sm">標記為已出貨</Button>
            ) : null}
            {order.status === "已出貨" && order.type === "purchase" ? (
              <Button size="sm">確認收貨</Button>
            ) : null}
            {order.status === "已完成" ? (
              <Button size="sm" variant="outline">
                查看詳情
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrdersPage() {
  const purchaseOrders = mockOrders.filter((o) => o.type === "purchase");
  const saleOrders = mockOrders.filter((o) => o.type === "sale");

  return (
    <div className="min-h-screen">
      <div className="border-b border-border">
        <div className="mx-auto max-w-4xl px-6 py-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4 gap-2 -ml-2">
              <ArrowLeft className="h-4 w-4" />
              返回
            </Button>
          </Link>
          <h1 className="text-2xl font-medium mb-2">訂單管理</h1>
          <p className="text-sm text-muted-foreground">
            管理你的購買與銷售訂單（目前為 mock 資料，TODO: 接 Order API）
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-8">
        <Tabs defaultValue="purchase" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="purchase" className="gap-2">
              <ShoppingCart className="h-4 w-4" />
              我買的
            </TabsTrigger>
            <TabsTrigger value="sale" className="gap-2">
              <Package className="h-4 w-4" />
              我賣的
            </TabsTrigger>
          </TabsList>

          <TabsContent value="purchase">
            {purchaseOrders.length > 0 ? (
              purchaseOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))
            ) : (
              <div className="text-center py-16">
                <p className="text-sm text-muted-foreground">尚無購買訂單</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="sale">
            {saleOrders.length > 0 ? (
              saleOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))
            ) : (
              <div className="text-center py-16">
                <p className="text-sm text-muted-foreground">尚無銷售訂單</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
