const GUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const OBFUSCATED_PREFIX = 'x_'

// A fixed XOR salt keeps IDs reversible while no longer human-readable in URL.
const SALT = [0x44, 0x58, 0x4f, 0x78, 0x36, 0x73, 0x6a, 0x6a, 0x53, 0x62, 0x4c, 0x51, 0x72, 0x39, 0x50, 0x6b]

function bytesToBase64Url(bytes: number[]): string {
  const binary = String.fromCharCode(...bytes)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

function base64UrlToBytes(token: string): number[] {
  const normalized = token.replace(/-/g, '+').replace(/_/g, '/')
  const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4)
  const binary = atob(padded)
  return Array.from(binary, (c) => c.charCodeAt(0))
}

function xorWithSalt(bytes: number[]): number[] {
  return bytes.map((b, i) => b ^ SALT[i % SALT.length]!)
}

export function encodeRouteGuid(guid: string): string {
  if (!guid) return guid
  const encoded = new TextEncoder().encode(guid)
  return `${OBFUSCATED_PREFIX}${bytesToBase64Url(xorWithSalt(Array.from(encoded)))}`
}

export function decodeRouteGuid(routeValue: string): string | null {
  if (!routeValue) return null
  // Backward compatibility: allow old raw GUID links.
  if (GUID_RE.test(routeValue)) return routeValue.toLowerCase()
  // If it's not our encoded token, treat it as plain ID (e.g. legacy/demo post IDs).
  if (!routeValue.startsWith(OBFUSCATED_PREFIX)) return routeValue
  try {
    const token = routeValue.slice(OBFUSCATED_PREFIX.length)
    const bytes = base64UrlToBytes(token)
    const decoded = xorWithSalt(bytes)
    return new TextDecoder().decode(Uint8Array.from(decoded))
  } catch {
    // Fallback avoids "not found" on malformed/legacy links.
    return routeValue
  }
}
