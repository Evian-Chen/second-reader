namespace backend.Enums
{
    public enum PayMethod
    {
        Undefined = 0,  // 尚未被賣出時的預設值
        Cash = 1,        // 現金（面交）
        BankTransfer,   // 銀行轉帳 / 匯款
        Other           // 其他（保留擴充）
    }
}