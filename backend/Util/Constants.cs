using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Util
{
    public static class Constants
    {
        public const int ExpiredTime = 300;  // sec
    }

    public static class Literals
    {
        public const string OrderCreatedTitle = "您的訂單已確認！";
        public const string OrderAcceptedTitle = "您的訂單已被接受！";
        public const string OrderRejectedTitle = "您的訂單已被拒絕！";
        public const string OrderRequestTitle = "有人下單您的書籍哦！";
        public const string OrderCompletedTitle = "您的訂單已完成！";
    }

    public static class Accounts
    {
        public const string System = "System";
    }
}