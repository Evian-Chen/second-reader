import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Grid3x3, BookOpen, Heart, ArrowLeft, UserPlus, UserMinus, MoreHorizontal, Flag, Ban } from "lucide-react";
import { currentUser, mockPosts, mockBooks, currentUserPosts, currentUserBooks, savedPosts, savedBooks, mockUsers, followingList, followersList } from "../data/mockData";
import { PostCard } from "../components/PostCard";
import { BookCard } from "../components/BookCard";
import { EditProfileDialog } from "../components/EditProfileDialog";
import { useParams, useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";

export default function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [following, setFollowing] = useState(followingList);
  const [followers, setFollowers] = useState(followersList);
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);

  // Determine if viewing own profile or someone else's
  const isOwnProfile = !id || id === currentUser.id;
  
  // Get user data
  const viewingUser = isOwnProfile 
    ? currentUser 
    : mockUsers.find(u => u.id === id) || currentUser;

  const isFollowing = viewingUser.isFollowing;

  // Get user's content
  const userPosts = isOwnProfile 
    ? currentUserPosts 
    : mockPosts.filter((post) => post.userId === viewingUser.id);
  
  const userBooks = isOwnProfile 
    ? currentUserBooks 
    : mockBooks.filter((book) => book.userId === viewingUser.id);

  const handleFollow = () => {
    viewingUser.isFollowing = !isFollowing;
    toast.success(isFollowing ? `已取消追蹤 ${viewingUser.name}` : `已追蹤 ${viewingUser.name}`);
  };

  const handleBlock = () => {
    setBlockDialogOpen(false);
    toast.success(`已封鎖 ${viewingUser.name}`);
    navigate("/");
  };

  const handleReport = () => {
    setReportDialogOpen(false);
    toast.success("已送出檢舉，我們會盡快處理");
  };

  return (
    <div className="min-h-screen">
      {/* Back Button for other users */}
      {!isOwnProfile && (
        <div className="border-b border-border">
          <div className="mx-auto max-w-4xl px-6 py-3">
            <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2 -ml-2">
              <ArrowLeft className="h-4 w-4" />
              返回
            </Button>
          </div>
        </div>
      )}

      {/* Profile Header */}
      <div className="border-b border-border">
        <div className="mx-auto max-w-4xl px-6 py-8">
          <div className="flex gap-6 mb-6">
            {/* Avatar */}
            <img
              src={viewingUser.avatar}
              alt={viewingUser.name}
              className="h-24 w-24 rounded-full object-cover ring-1 ring-border"
            />

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-xl font-medium mb-1">{viewingUser.name}</h1>
                  <p className="text-sm text-muted-foreground">@{viewingUser.username}</p>
                </div>
                <div className="flex gap-2">
                  {isOwnProfile ? (
                    <EditProfileDialog />
                  ) : (
                    <>
                      <Button 
                        onClick={handleFollow}
                        size="sm"
                        variant={isFollowing ? "outline" : "default"}
                        className="gap-2"
                      >
                        {isFollowing ? (
                          <>
                            <UserMinus className="h-4 w-4" />
                            取消追蹤
                          </>
                        ) : (
                          <>
                            <UserPlus className="h-4 w-4" />
                            追蹤
                          </>
                        )}
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setReportDialogOpen(true)}>
                            <Flag className="mr-2 h-4 w-4" />
                            檢舉使用者
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setBlockDialogOpen(true)} className="text-destructive">
                            <Ban className="mr-2 h-4 w-4" />
                            封鎖使用者
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </>
                  )}
                </div>
              </div>

              {/* Bio */}
              <p className="text-[15px] leading-relaxed mb-4 max-w-2xl">
                {viewingUser.bio}
              </p>

              {/* Stats */}
              <div className="flex gap-6 text-sm">
                <div>
                  <span className="font-medium">{userPosts.length}</span>
                  <span className="text-muted-foreground ml-1.5">貼文</span>
                </div>
                {isOwnProfile ? (
                  <>
                    <Dialog>
                      <DialogTrigger asChild>
                        <button className="hover:underline">
                          <span className="font-medium">{followers.length}</span>
                          <span className="text-muted-foreground ml-1.5">粉絲</span>
                        </button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>粉絲</DialogTitle>
                        </DialogHeader>
                        <div className="max-h-96 overflow-y-auto">
                          <div className="space-y-4">
                            {followers.map((follower) => (
                              <div key={follower.id} className="flex items-center justify-between">
                                <div 
                                  className="flex items-center gap-3 flex-1 cursor-pointer"
                                  onClick={() => navigate(`/profile/${follower.id}`)}
                                >
                                  <img
                                    src={follower.avatar}
                                    alt={follower.name}
                                    className="h-10 w-10 rounded-full object-cover ring-1 ring-border"
                                  />
                                  <div>
                                    <p className="text-sm font-medium">{follower.name}</p>
                                    <p className="text-xs text-muted-foreground">@{follower.username}</p>
                                  </div>
                                </div>
                                <Button size="sm" variant="outline">
                                  {follower.isFollowing ? "取消追蹤" : "追蹤"}
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Dialog>
                      <DialogTrigger asChild>
                        <button className="hover:underline">
                          <span className="font-medium">{following.length}</span>
                          <span className="text-muted-foreground ml-1.5">追蹤中</span>
                        </button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>追蹤中</DialogTitle>
                        </DialogHeader>
                        <div className="max-h-96 overflow-y-auto">
                          <div className="space-y-4">
                            {following.map((user) => (
                              <div key={user.id} className="flex items-center justify-between">
                                <div 
                                  className="flex items-center gap-3 flex-1 cursor-pointer"
                                  onClick={() => navigate(`/profile/${user.id}`)}
                                >
                                  <img
                                    src={user.avatar}
                                    alt={user.name}
                                    className="h-10 w-10 rounded-full object-cover ring-1 ring-border"
                                  />
                                  <div>
                                    <p className="text-sm font-medium">{user.name}</p>
                                    <p className="text-xs text-muted-foreground">@{user.username}</p>
                                  </div>
                                </div>
                                <Button size="sm" variant="outline">
                                  取消追蹤
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </>
                ) : (
                  <>
                    <div>
                      <span className="font-medium">{viewingUser.followers.toLocaleString()}</span>
                      <span className="text-muted-foreground ml-1.5">粉絲</span>
                    </div>
                    <div>
                      <span className="font-medium">{viewingUser.following}</span>
                      <span className="text-muted-foreground ml-1.5">追蹤中</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="border-b border-border">
        <div className="mx-auto max-w-4xl px-6">
          <Tabs defaultValue="posts" className="w-full">
            <TabsList className="w-full h-12 bg-transparent p-0 gap-8 justify-start">
              <TabsTrigger 
                value="posts" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent bg-transparent px-0 text-[13px] data-[state=active]:shadow-none gap-2"
              >
                <Grid3x3 className="h-4 w-4" />
                貼文
              </TabsTrigger>
              <TabsTrigger 
                value="books" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent bg-transparent px-0 text-[13px] data-[state=active]:shadow-none gap-2"
              >
                <BookOpen className="h-4 w-4" />
                書籍
              </TabsTrigger>
              {isOwnProfile && (
                <>
                  <TabsTrigger 
                    value="saved-posts" 
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent bg-transparent px-0 text-[13px] data-[state=active]:shadow-none gap-2"
                  >
                    <Heart className="h-4 w-4" />
                    貼文收藏
                  </TabsTrigger>
                  <TabsTrigger 
                    value="saved-books" 
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent bg-transparent px-0 text-[13px] data-[state=active]:shadow-none gap-2"
                  >
                    <BookOpen className="h-4 w-4" />
                    書籍收藏
                  </TabsTrigger>
                </>
              )}
            </TabsList>

            <div className="py-6">
              {/* Posts Tab */}
              <TabsContent value="posts" className="m-0">
                {userPosts.length > 0 ? (
                  <div className="space-y-0 divide-y divide-border">
                    {userPosts.map((post) => (
                      <PostCard key={post.id} post={post} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <Grid3x3 className="h-12 w-12 text-muted-foreground/20 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">還沒有發布任何貼文</p>
                  </div>
                )}
              </TabsContent>

              {/* Books Tab */}
              <TabsContent value="books" className="m-0">
                {userBooks.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {userBooks.map((book) => (
                      <BookCard key={book.id} book={book} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <BookOpen className="h-12 w-12 text-muted-foreground/20 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">還沒有上架任何書籍</p>
                  </div>
                )}
              </TabsContent>

              {/* Saved Posts Tab (only for own profile) */}
              {isOwnProfile && (
                <TabsContent value="saved-posts" className="m-0">
                  {savedPosts.length > 0 ? (
                    <div className="space-y-0 divide-y divide-border">
                      {savedPosts.map((post) => (
                        <PostCard key={post.id} post={post} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <Heart className="h-12 w-12 text-muted-foreground/20 mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground">還沒有收藏任何貼文</p>
                    </div>
                  )}
                </TabsContent>
              )}

              {/* Saved Books Tab (only for own profile) */}
              {isOwnProfile && (
                <TabsContent value="saved-books" className="m-0">
                  {savedBooks.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                      {savedBooks.map((book) => (
                        <BookCard key={book.id} book={book} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <Heart className="h-12 w-12 text-muted-foreground/20 mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground">還沒有收藏任何書籍</p>
                    </div>
                  )}
                </TabsContent>
              )}
            </div>
          </Tabs>
        </div>
      </div>

      {/* Block Dialog */}
      <AlertDialog open={blockDialogOpen} onOpenChange={setBlockDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>確定要封鎖 {viewingUser.name}？</AlertDialogTitle>
            <AlertDialogDescription>
              封鎖後，你們將無法看到彼此的貼文、書籍和個人檔案。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleBlock}>確定封鎖</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Report Dialog */}
      <AlertDialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>檢舉 {viewingUser.name}</AlertDialogTitle>
            <AlertDialogDescription>
              我們會審核你的檢舉並採取適當的行動。請確保檢舉的內容違反了社群規範。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleReport}>送出檢舉</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}