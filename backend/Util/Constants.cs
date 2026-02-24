using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Util
{
    public static class Constants
    {
        public const int ExpiredTime = 60000;  // sec
    }

    public static class Literals
    {
        public const string OrderCreatedTitle = "您的訂單已確認！";
        public const string OrderAcceptedTitle = "您的訂單已被接受！";
        public const string OrderRejectedTitle = "您的訂單已被拒絕！";
        public const string OrderRequestTitle = "有人下單您的書籍哦！";
        public const string OrderCompletedBySellerTitle = "您訂購的書籍已出貨！";
        public const string OrderCompletedByBuyerTitle = "已收到訂購的書籍！";
        public const string WaitlistCanceled = "您排隊的書已被取消！";
        public const string WaitlistAccepted = "您排隊的書已成功遞補！";
        public const string CartItemExpiredTitle = "您的購物車商品逾期！";
        public const string InformPostCreaterNewCommentTitle = "有人在您的貼文底下留言哦！";
        public const string InformRootCommentCreaterNewCommentTitle = "有人回覆您的留言哦！";
        public const string WelcomeMsg = "歡迎來到黑白冊！";
    }

    public static class Accounts
    {
        public const string System = "System";
    }
}