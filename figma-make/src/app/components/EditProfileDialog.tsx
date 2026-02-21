import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Settings, Plus, X } from "lucide-react";
import { useState } from "react";
import { currentUser } from "../data/mockData";
import { toast } from "sonner";

interface EditProfileDialogProps {
  children?: React.ReactNode;
}

interface SocialLink {
  platform: string;
  url: string;
}

export function EditProfileDialog({ children }: EditProfileDialogProps) {
  const [open, setOpen] = useState(false);
  const [bio, setBio] = useState(currentUser.bio);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([
    { platform: "Instagram", url: "" },
    { platform: "Twitter", url: "" },
  ]);

  const handleAddSocial = () => {
    setSocialLinks([...socialLinks, { platform: "", url: "" }]);
  };

  const handleRemoveSocial = (index: number) => {
    setSocialLinks(socialLinks.filter((_, i) => i !== index));
  };

  const handleSocialChange = (index: number, field: keyof SocialLink, value: string) => {
    const newLinks = [...socialLinks];
    newLinks[index][field] = value;
    setSocialLinks(newLinks);
  };

  const handleSave = () => {
    toast.success("個人檔案已更新");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm" className="gap-2">
            <Settings className="h-4 w-4" />
            編輯個人檔案
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>編輯個人檔案</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {/* Avatar Section */}
          <div className="space-y-2">
            <Label>頭像</Label>
            <div className="flex items-center gap-4">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="h-20 w-20 rounded-full object-cover ring-1 ring-border"
              />
              <Button variant="outline" size="sm">
                更換頭像
              </Button>
            </div>
          </div>

          {/* Name Section */}
          <div className="space-y-2">
            <Label htmlFor="name">名稱</Label>
            <Input
              id="name"
              defaultValue={currentUser.name}
              placeholder="輸入你的名稱"
            />
          </div>

          {/* Username Section */}
          <div className="space-y-2">
            <Label htmlFor="username">使用者名稱</Label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">@</span>
              <Input
                id="username"
                defaultValue={currentUser.username}
                placeholder="username"
              />
            </div>
          </div>

          {/* Bio Section */}
          <div className="space-y-2">
            <Label htmlFor="bio">個人簡介</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="介紹一下你自己..."
              className="min-h-[100px] resize-none"
              maxLength={200}
            />
            <p className="text-xs text-muted-foreground text-right">
              {bio.length}/200
            </p>
          </div>

          {/* Social Links Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>社群媒體</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddSocial}
                className="gap-2"
              >
                <Plus className="h-3 w-3" />
                新增連結
              </Button>
            </div>
            <div className="space-y-3">
              {socialLinks.map((link, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="平台名稱 (例: Instagram)"
                    value={link.platform}
                    onChange={(e) =>
                      handleSocialChange(index, "platform", e.target.value)
                    }
                    className="w-1/3"
                  />
                  <Input
                    placeholder="網址"
                    value={link.url}
                    onChange={(e) =>
                      handleSocialChange(index, "url", e.target.value)
                    }
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveSocial(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 justify-end pt-4 border-t">
          <Button variant="outline" onClick={() => setOpen(false)}>
            取消
          </Button>
          <Button onClick={handleSave}>
            儲存變更
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
