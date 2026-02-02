namespace backend.Enums
{
    public enum WaitlistStatus
    {
        Waiting = 0,  // 有別人先加入的購物車，但賣家還沒確認訂單，所以可以排隊
        Accepted = 1,  // 第一個排隊的人都會被 accept，代表可以加入購物車
        Rejected,  // 被賣家拒絕，從 CartItem 退出，排隊狀態呈現被拒絕
        Canceled  // 書本不再 available（不在架上），所有排隊的人都被 cancel，此書不再開放排隊
    }
}