import { Button } from "../components/ui/button";
import { BookCard } from "../components/BookCard";
import { CreateBookDialog } from "../components/CreateBookDialog";
import { currentUserBooks, currentUser } from "../data/mockData";
import { Package, Plus, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";

export default function MyShop() {
  const navigate = useNavigate();
  const myBooks = currentUserBooks;
  const totalRevenue = myBooks.reduce((sum, book) => sum + book.price, 0);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-2xl font-medium mb-2">我的賣場</h1>
              <p className="text-sm text-muted-foreground">管理你的二手書上架</p>
            </div>
            <CreateBookDialog>
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                上架書籍
              </Button>
            </CreateBookDialog>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8">
            <div>
              <p className="text-xs text-muted-foreground mb-1">上架書籍</p>
              <p className="text-2xl font-medium">{myBooks.length}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">已售出</p>
              <p className="text-2xl font-medium">12</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">總收益</p>
              <p className="text-2xl font-medium">NT$ {totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Books Grid */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        {myBooks.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {myBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Package className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
            <h3 className="text-sm font-medium mb-2">還沒有上架任何書籍</h3>
            <p className="text-sm text-muted-foreground mb-6">開始上架你的二手書，與其他書友交流吧！</p>
            <CreateBookDialog>
              <Button>上架第一本書</Button>
            </CreateBookDialog>
          </div>
        )}
      </div>
    </div>
  );
}