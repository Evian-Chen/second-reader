namespace backend.Enums
{
    public enum DeliveryMethod
    {
        Undefined = 0,      // 尚未被賣出時的預設值
        FaceToFace = 1,     // 面交
        Mail,               // 郵寄（郵局）
        ConvenienceStore,   // 超商取貨
        Other               // 其他
    }
}