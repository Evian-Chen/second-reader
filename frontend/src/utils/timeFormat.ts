export function formatTimeAgo(iso: string): string {
  const t = new Date(iso).getTime()
  if (Number.isNaN(t)) return iso
  const sec = Math.floor((Date.now() - t) / 1000)
  if (sec < 45) return '剛剛'
  if (sec < 3600) return `${Math.floor(sec / 60)} 分鐘前`
  if (sec < 86400) return `${Math.floor(sec / 3600)} 小時前`
  if (sec < 604800) return `${Math.floor(sec / 86400)} 天前`
  return new Date(iso).toLocaleDateString('zh-TW')
}
