import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { PostCard } from "../components/PostCard";
import { BookCard } from "../components/BookCard";
import { CreatePostDialog } from "../components/CreatePostDialog";
import { Button } from "../components/ui/button";
import { PenSquare, Search, Plus, SlidersHorizontal } from "lucide-react";
import { mockPosts, mockBooks, currentUser, bookCategories } from "../data/mockData";
import { Input } from "../components/ui/input";
import { useState } from "react";
import { CreateBookDialog } from "../components/CreateBookDialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuCheckboxItem } from "../components/ui/dropdown-menu";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [postSearchQuery, setPostSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    noQueue: false,
    hasQueue: false,
    condition: null as string | null,
    category: null as string | null,
    sortBy: "latest" as "latest" | "price-low" | "price-high" | "queue",
  });

  const filteredBooks = mockBooks
    .filter((book) => {
      // Search filter
      const matchesSearch = searchQuery === "" ||
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      // No queue filter
      const matchesNoQueue = !filters.noQueue || (book.queueCount === 0);
      
      // Has queue filter
      const matchesHasQueue = !filters.hasQueue || ((book.queueCount ?? 0) > 0);
      
      // Condition filter
      const matchesCondition = !filters.condition || book.condition === filters.condition;
      
      // Category filter
      const matchesCategory = !filters.category || book.category === filters.category;
      
      return matchesSearch && matchesNoQueue && matchesHasQueue && matchesCondition && matchesCategory;
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "queue":
          return (b.queueCount || 0) - (a.queueCount || 0);
        default:
          return 0;
      }
    });

  const filteredPosts = mockPosts.filter((post) =>
    postSearchQuery === "" ||
    post.content.toLowerCase().includes(postSearchQuery.toLowerCase()) ||
    (post.bookTitle && post.bookTitle.toLowerCase().includes(postSearchQuery.toLowerCase())) ||
    post.userName.toLowerCase().includes(postSearchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      <Tabs defaultValue="posts" className="w-full">
        {/* Tabs Header */}
        <div className="sticky top-14 z-40 bg-background border-b border-border">
          <div className="mx-auto max-w-7xl px-6">
            <TabsList className="h-12 bg-transparent w-auto p-0 gap-8">
              <TabsTrigger 
                value="posts" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent bg-transparent px-0 text-[13px] data-[state=active]:shadow-none"
              >
                閱讀分享
              </TabsTrigger>
              <TabsTrigger 
                value="marketplace" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent bg-transparent px-0 text-[13px] data-[state=active]:shadow-none"
              >
                二手書市集
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        {/* Posts Tab */}
        <TabsContent value="posts" className="m-0">
          <div className="mx-auto max-w-2xl px-6 py-8">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜尋貼文..."
                  className="pl-7 h-9 border-0 border-b border-border rounded-none bg-transparent focus-visible:ring-0 focus-visible:border-foreground"
                  value={postSearchQuery}
                  onChange={(e) => setPostSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Create Post Button */}
            <div className="mb-8">
              <CreatePostDialog>
                <button className="w-full text-left border border-border rounded-lg p-4 hover:border-foreground/40 transition-colors flex items-center gap-3">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="h-9 w-9 rounded-full object-cover"
                  />
                  <span className="text-sm text-muted-foreground">分享你的閱讀心得...</span>
                </button>
              </CreatePostDialog>
            </div>

            {/* Posts Feed */}
            <div className="space-y-0 divide-y divide-border">
              {filteredPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>

            {filteredPosts.length === 0 && (
              <div className="text-center py-16">
                <p className="text-sm text-muted-foreground">找不到相關貼文</p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Marketplace Tab */}
        <TabsContent value="marketplace" className="m-0">
          <div className="mx-auto max-w-7xl px-6 py-8">
            {/* Search and Actions */}
            <div className="mb-6 max-w-3xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="搜尋書名、作者..."
                    className="pl-7 h-9 border-0 border-b border-border rounded-none bg-transparent focus-visible:ring-0 focus-visible:border-foreground"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <SlidersHorizontal className="h-4 w-4" />
                      篩選
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>排序方式</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => setFilters({...filters, sortBy: "latest"})}>
                      {filters.sortBy === "latest" && "✓ "}最新上架
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilters({...filters, sortBy: "price-low"})}>
                      {filters.sortBy === "price-low" && "✓ "}價格：低到高
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilters({...filters, sortBy: "price-high"})}>
                      {filters.sortBy === "price-high" && "✓ "}價格：高到低
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilters({...filters, sortBy: "queue"})}>
                      {filters.sortBy === "queue" && "✓ "}排隊人數
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>排隊狀態</DropdownMenuLabel>
                    <DropdownMenuCheckboxItem
                      checked={filters.noQueue}
                      onCheckedChange={(checked) => setFilters({...filters, noQueue: checked, hasQueue: checked ? false : filters.hasQueue})}
                    >
                      不需要排隊
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={filters.hasQueue}
                      onCheckedChange={(checked) => setFilters({...filters, hasQueue: checked, noQueue: checked ? false : filters.noQueue})}
                    >
                      需要排隊
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>書籍狀態</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => setFilters({...filters, condition: null})}>
                      {!filters.condition && "✓ "}全部狀態
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilters({...filters, condition: "全新"})}>
                      {filters.condition === "全新" && "✓ "}全新
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilters({...filters, condition: "近全新"})}>
                      {filters.condition === "近全新" && "✓ "}近全新
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilters({...filters, condition: "良好"})}>
                      {filters.condition === "良好" && "✓ "}良好
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilters({...filters, condition: "普通"})}>
                      {filters.condition === "普通" && "✓ "}普通
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>書籍類型</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => setFilters({...filters, category: null})}>
                      {!filters.category && "✓ "}全部類型
                    </DropdownMenuItem>
                    {bookCategories.map((category) => (
                      <DropdownMenuItem 
                        key={category}
                        onClick={() => setFilters({...filters, category})}
                      >
                        {filters.category === category && "✓ "}{category}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              {/* Category Labels */}
              <div className="flex items-center gap-2 flex-wrap">
                {bookCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSearchQuery(category)}
                    className="px-3 py-1.5 text-xs border border-border rounded-full hover:bg-foreground hover:text-background transition-colors"
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Books Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {filteredBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>

            {filteredBooks.length === 0 && (
              <div className="text-center py-16">
                <p className="text-sm text-muted-foreground">找不到相關書籍</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}