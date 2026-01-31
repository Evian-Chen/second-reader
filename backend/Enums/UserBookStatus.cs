namespace backend.Enums
{
    public enum UserBookStatus
    {
        Drafted = 1,   // 草稿（尚未上架）
        Listed,        // 上架中（可瀏覽 / 可預約）
        Reserved,      // 已被預約（已經被加入購物車，暫停其他人操作）
        WaitForConfirmation,  // 已經 checkout 成功，等待賣家回覆
        InProgress,    // 交易進行中（已確認交付，等待賣家給書、買家收書）
        Completed,     // 交易完成（買賣家書本交付完成，不可再使用）
        Delisted       // 主動下架（未成交）
    }

}