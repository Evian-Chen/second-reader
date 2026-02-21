import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Button } from "../components/ui/button";
import { mockOrders } from "../data/mockData";
import { Package, ShoppingCart, Calendar, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";

export default function Orders() {
  const navigate = useNavigate();
  const purchaseOrders = mockOrders.filter((order) => order.type === "purchase");
  const saleOrders = mockOrders.filter((order) => order.type === "sale");

  const OrderCard = ({ order }: { order: typeof mockOrders[0] }) => (
    <div className="border-b border-border pb-6 last:border-0">
      <div className="flex gap-4">
        {/* Book Cover */}
        <div className="w-16 shrink-0">
          <img
            src={order.bookCover}
            alt={order.bookTitle}
            className="w-full aspect-[2/3] object-cover rounded"
          />
        </div>

        {/* Order Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-medium mb-1 line-clamp-1">{order.bookTitle}</h3>
              <p className="text-xs text-muted-foreground">
                {order.type === "purchase" ? `賣家：${order.sellerName}` : `買家：${order.buyerName}`}
              </p>
            </div>
            <span className="text-xs text-muted-foreground ml-4 shrink-0">{order.status}</span>
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3 w-3" />
              {order.createdAt}
            </div>
            <div className="font-medium text-foreground">NT$ {order.price}</div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            {order.status === "待確認" && order.type === "sale" && (
              <>
                <Button size="sm" variant="outline">
                  確認訂單
                </Button>
                <Button size="sm" variant="ghost">
                  取消訂單
                </Button>
              </>
            )}
            {order.status === "已確認" && order.type === "sale" && (
              <Button size="sm">標記為已出貨</Button>
            )}
            {order.status === "已出貨" && order.type === "purchase" && (
              <Button size="sm">確認收貨</Button>
            )}
            {order.status === "已完成" && (
              <Button size="sm" variant="outline">
                查看詳情
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-border">
        <div className="mx-auto max-w-4xl px-6 py-8">
          <h1 className="text-2xl font-medium mb-2">訂單管理</h1>
          <p className="text-sm text-muted-foreground">管理你的購買與銷售訂單</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <div className="mx-auto max-w-4xl px-6">
          <Tabs defaultValue="purchases" className="w-full">
            <TabsList className="w-full h-12 bg-transparent p-0 gap-8 justify-start">
              <TabsTrigger 
                value="purchases" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent bg-transparent px-0 text-[13px] data-[state=active]:shadow-none gap-2"
              >
                <ShoppingCart className="h-4 w-4" />
                我的購買
              </TabsTrigger>
              <TabsTrigger 
                value="sales" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent bg-transparent px-0 text-[13px] data-[state=active]:shadow-none gap-2"
              >
                <Package className="h-4 w-4" />
                我的銷售
              </TabsTrigger>
            </TabsList>

            <div className="py-6">
              {/* Purchase Orders */}
              <TabsContent value="purchases" className="m-0">
                {purchaseOrders.length > 0 ? (
                  <div className="space-y-6">
                    {purchaseOrders.map((order) => (
                      <OrderCard key={order.id} order={order} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <ShoppingCart className="h-12 w-12 text-muted-foreground/20 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">還沒有購買記錄</p>
                  </div>
                )}
              </TabsContent>

              {/* Sale Orders */}
              <TabsContent value="sales" className="m-0">
                {saleOrders.length > 0 ? (
                  <div className="space-y-6">
                    {saleOrders.map((order) => (
                      <OrderCard key={order.id} order={order} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <Package className="h-12 w-12 text-muted-foreground/20 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">還沒有銷售記錄</p>
                  </div>
                )}
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}