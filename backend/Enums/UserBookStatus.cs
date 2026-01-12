namespace backend.Enums
{
    public enum UserBookStatus
    {
        Drafted = 1,   // 草稿（尚未上架）
        Listed,        // 上架中（可瀏覽 / 可預約）
        Reserved,      // 已被預約（暫停其他人操作）
        InProgress,    // 交易進行中（已確認交付）
        Completed,     // 交易完成（不可再使用）
        Delisted       // 主動下架（未成交）
    }

}