namespace backend.Enums
{
    public enum OrderStatus
    {
        PendingSellerConfirm = 1,   // 買家 checkout 後等賣家確認
        Paid,          // 已付款 / 已確認付款
        Shipping,      // 交付中（面交/寄送進行中）
        Completed,     // 交易完成
        Canceled       // 取消 / 爽約
    }

}