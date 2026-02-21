import { Link, useNavigate } from "react-router";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { User, LogOut, ShoppingBag, Package, Home, PenSquare, BookPlus, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { currentUser } from "../data/mockData";
import { LoginDialog } from "./LoginDialog";
import { Button } from "./ui/button";
import { NotificationPanel } from "./NotificationPanel";
import { CreatePostDialog } from "./CreatePostDialog";
import { CreateBookDialog } from "./CreateBookDialog";
import logoImage from "figma:asset/a1ff33300a3de52cbd47e052f46445e7b5d21f65.png";

export function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src={logoImage} alt="黑白冊" className="h-7" />
          </Link>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {isLoggedIn ? (
              <>
                {/* Quick Actions */}
                <CreatePostDialog>
                  <button className="p-1.5 hover:bg-muted rounded-lg transition-colors">
                    <PenSquare className="h-5 w-5" />
                  </button>
                </CreatePostDialog>
                <div className="h-5 w-px bg-border" />
                <CreateBookDialog>
                  <button className="p-1.5 hover:bg-muted rounded-lg transition-colors">
                    <BookPlus className="h-5 w-5" />
                  </button>
                </CreateBookDialog>
                <div className="h-5 w-px bg-border" />
                <button 
                  className="p-1.5 hover:bg-muted rounded-lg transition-colors relative"
                  onClick={() => navigate("/cart")}
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-foreground text-background text-[10px] rounded-full flex items-center justify-center font-medium">
                    3
                  </span>
                </button>
                <div className="h-5 w-px bg-border" />
                <NotificationPanel />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center focus:outline-none ml-2">
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        className="h-8 w-8 rounded-full object-cover ring-1 ring-border hover:ring-2 hover:ring-foreground transition-all"
                      />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-2">
                      <p className="text-sm font-medium">{currentUser.name}</p>
                      <p className="text-xs text-muted-foreground">@{currentUser.username}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/profile")}>
                      <User className="mr-2 h-4 w-4" />
                      個人頁面
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/my-shop")}>
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      我的賣場
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/orders")}>
                      <Package className="mr-2 h-4 w-4" />
                      訂單管理
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      登出
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <LoginDialog onLogin={() => setIsLoggedIn(true)}>
                <Button size="sm" variant="outline">
                  登入
                </Button>
              </LoginDialog>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background">
        <div className="flex items-center justify-around h-14">
          <Link to="/" className="flex flex-col items-center justify-center gap-0.5 flex-1 h-full text-foreground/60 hover:text-foreground transition-colors">
            <Home className="h-5 w-5" />
            <span className="text-[10px]">首頁</span>
          </Link>
          <Link to="/my-shop" className="flex flex-col items-center justify-center gap-0.5 flex-1 h-full text-foreground/60 hover:text-foreground transition-colors">
            <ShoppingBag className="h-5 w-5" />
            <span className="text-[10px]">賣場</span>
          </Link>
          <Link to="/orders" className="flex flex-col items-center justify-center gap-0.5 flex-1 h-full text-foreground/60 hover:text-foreground transition-colors">
            <Package className="h-5 w-5" />
            <span className="text-[10px]">訂單</span>
          </Link>
          <Link to="/profile" className="flex flex-col items-center justify-center gap-0.5 flex-1 h-full text-foreground/60 hover:text-foreground transition-colors">
            <User className="h-5 w-5" />
            <span className="text-[10px]">我的</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}