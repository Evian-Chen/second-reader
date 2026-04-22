import type { DeliveryMethod, PayMethod } from '@/api/types/secondReader'

export const payMethodOptions: { value: PayMethod; label: string }[] = [
  { value: 'Cash', label: '現金（面交）' },
  { value: 'BankTransfer', label: '銀行轉帳 / 匯款' },
  { value: 'Other', label: '其他' },
]

export const deliveryMethodOptions: { value: DeliveryMethod; label: string }[] = [
  { value: 'FaceToFace', label: '面交' },
  { value: 'Mail', label: '郵寄' },
  { value: 'ConvenienceStore', label: '超商取貨' },
  { value: 'Other', label: '其他' },
]

const bookConditionLabels: Record<string, string> = {
  New: '全新',
  LikelyNew: '近全新',
  Good: '良好',
  Fair: '普通',
  Poor: '尚可',
  Bad: '狀況不佳',
}

export function bookConditionLabel(code: string) {
  if (!code) return '—'
  return bookConditionLabels[code] || code
}

const orderItemStatusLabels: Record<string, string> = {
  Pending: '待賣家確認',
  Accepted: '賣家已接受',
  Rejected: '已拒絕',
  SellerSent: '已出貨',
  Completed: '已完成',
}

export function orderItemStatusLabel(status: string) {
  return orderItemStatusLabels[status] || status
}

export function payMethodLabel(m: string) {
  return payMethodOptions.find((o) => o.value === m)?.label || m
}

export function deliveryMethodLabel(m: string) {
  return deliveryMethodOptions.find((o) => o.value === m)?.label || m
}
