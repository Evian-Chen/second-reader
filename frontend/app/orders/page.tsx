"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import type { OrderItem } from "@/types";
import { Package, ShoppingCart, Calendar, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import {
  useGetOrdersQuery,
  useGetSalesQuery,
  useCompleteOrderItemMutation,
  useAcceptSaleMutation,
  useRejectSaleMutation,
  useCompleteSaleMutation,
} from "@/redux/services/api";
import { DEFAULT_COVER } from "@/types/constants";
import { toast } from "sonner";

const statusMap: Record<string, string> = {
  Pending: "待確認",
  Accepted: "已確認",
  Rejected: "已取消",
  SellerSent: "已出貨",
  Completed: "已完成",
};

function OrderCard({
  order,
  onAcceptSale,
  onRejectSale,
  onCompleteSale,
  onCompleteOrderItem,
}: {
  order: OrderItem;
  onAcceptSale?: (id: string) => void;
  onRejectSale?: (id: string) => void;
  onCompleteSale?: (id: string) => void;
  onCompleteOrderItem?: (id: string) => void;
}) {
  return (
    <div className="border-b border-border pb-6 last:border-0">
      <div className="flex gap-4">
        <div className="w-16 shrink-0">
          <img
            src={order.bookCover ?? DEFAULT_COVER}
            alt={order.bookTitle ?? ""}
            className="w-full aspect-2/3 object-cover rounded"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-medium mb-1 line-clamp-1">
                {order.bookTitle ?? "—"}
              </h3>
              <p className="text-xs text-muted-foreground">
                {order.type === "purchase"
                  ? `賣家：${order.sellerName ?? "—"}`
                  : `買家：${order.buyerName ?? "—"}`}
              </p>
            </div>
            <span className="text-xs text-muted-foreground ml-4 shrink-0">
              {statusMap[order.orderItemStatus ?? "Pending"] ??
                order.orderItemStatus}
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3 w-3" />
              {order.createdAt ?? "—"}
            </div>
            <div className="font-medium text-foreground">
              NT$ {order.price ?? 0}
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {order.orderItemStatus === "Pending" && order.type === "sale" ? (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onAcceptSale?.(order.id)}
                >
                  確認訂單
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onRejectSale?.(order.id)}
                >
                  取消訂單
                </Button>
              </>
            ) : null}
            {order.orderItemStatus === "Accepted" && order.type === "sale" ? (
              <Button
                size="sm"
                onClick={() => onCompleteSale?.(order.id)}
              >
                標記為已出貨
              </Button>
            ) : null}
            {order.orderItemStatus === "SellerSent" &&
            order.type === "purchase" ? (
              <Button
                size="sm"
                onClick={() => onCompleteOrderItem?.(order.id)}
              >
                確認收貨
              </Button>
            ) : null}
            {order.orderItemStatus === "Completed" ? (
              <Button size="sm" variant="outline" asChild>
                <Link href={`/orders`}>查看詳情</Link>
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrdersPage() {
  const { data: orders = [], isLoading: ordersLoading } = useGetOrdersQuery();
  const { data: sales = [], isLoading: salesLoading } = useGetSalesQuery();
  const [completeOrderItem] = useCompleteOrderItemMutation();
  const [acceptSale] = useAcceptSaleMutation();
  const [rejectSale] = useRejectSaleMutation();
  const [completeSale] = useCompleteSaleMutation();

  const purchaseItems: OrderItem[] = orders.flatMap((order) =>
    (order.orderItems ?? []).map((item) => ({
      ...item,
      type: "purchase" as const,
      orderId: order.orderId ?? item.orderId,
    }))
  );
  const saleItems: OrderItem[] = sales.map((item) => ({
    ...item,
    type: "sale" as const,
  }));

  const handleAcceptSale = async (id: string) => {
    try {
      await acceptSale(id).unwrap();
      toast.success("已確認訂單");
    } catch {
      toast.error("操作失敗");
    }
  };

  const handleRejectSale = async (id: string) => {
    try {
      await rejectSale(id).unwrap();
      toast.success("已取消訂單");
    } catch {
      toast.error("操作失敗");
    }
  };

  const handleCompleteSale = async (id: string) => {
    try {
      await completeSale(id).unwrap();
      toast.success("已標記為已出貨");
    } catch {
      toast.error("操作失敗");
    }
  };

  const handleCompleteOrderItem = async (id: string) => {
    try {
      await completeOrderItem(id).unwrap();
      toast.success("已確認收貨");
    } catch {
      toast.error("操作失敗");
    }
  };

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
            管理你的購買與銷售訂單
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
            {ordersLoading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : purchaseItems.length > 0 ? (
              <div className="space-y-6">
                {purchaseItems.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onCompleteOrderItem={handleCompleteOrderItem}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <ShoppingCart className="h-12 w-12 text-muted-foreground/20 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">尚無購買訂單</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="sale">
            {salesLoading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : saleItems.length > 0 ? (
              <div className="space-y-6">
                {saleItems.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onAcceptSale={handleAcceptSale}
                    onRejectSale={handleRejectSale}
                    onCompleteSale={handleCompleteSale}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Package className="h-12 w-12 text-muted-foreground/20 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">尚無銷售訂單</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
