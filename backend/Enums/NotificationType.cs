namespace backend.Enums
{
    public enum NotificationType
    {
        OrderCreated = 0,  // checkout 成功
        OrderRequest,  // 對賣家送出請求，以書本為單位
        OrderRejected,  // 賣家取消該出貨請求，以書本為單位
        OrderAccepted,  // 賣家接受買家請求，以書本為單位
        OrderCompleted,  // 書本已經完成雙向的交付
        WaitlistAccepted,  // 排隊遞補成功，以書本為單位
        WaitlistCanceled  // 正在排隊的書已經被下架（被賣出/賣家下架），以書本為單位
    }
}