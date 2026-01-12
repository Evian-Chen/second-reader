namespace backend.Enums
{
    public enum OrderStatus
    {
        Pending = 1,   // 已建立，待確認
        Paid,          // 已付款 / 已確認付款
        Shipping,      // 交付中（面交/寄送進行中）
        Completed,     // 交易完成
        Canceled       // 取消 / 爽約
    }

}