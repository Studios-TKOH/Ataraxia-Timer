const ALLOWED_URL_SCHEMES = ['https:', 'http:']
const ALLOWED_IMAGE_SCHEMES = ['https:', 'data:']
const BLOCKED_DATA_URL_TYPES = /javascript:|vbscript:|data:(?!image\/)/i

export function sanitizeUrl(url: string, allowedSchemes: string[] = ALLOWED_URL_SCHEMES): string {
  const trimmed = url.trim()
  if (!trimmed) return ''

  try {
    const parsed = new URL(trimmed)
    if (!allowedSchemes.includes(parsed.protocol)) {
      return ''
    }
    return trimmed
  } catch {
    return ''
  }
}

export function sanitizeImageUrl(url: string): string {
  return sanitizeUrl(url, ALLOWED_IMAGE_SCHEMES)
}

export function sanitizeForCss(value: string): string {
  return value
    .replace(/\\/g, '')
    .replace(/"/g, '')
    .replace(/'/g, '')
    .replace(/[();]/g, '')
}

export function sanitizeInput(value: string): string {
  return value
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
