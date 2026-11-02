/** Text like "[Your role]" is a placeholder still waiting for real content. */
export function isPlaceholder(text: string): boolean {
  return /^\[[^\]]*\]$/.test(text.trim())
}

/** True when a link has somewhere real to go: http(s), mailto, or a path on this site. */
export function hasDestination(url: string | undefined): url is string {
  const value = url?.trim()
  if (!value || isPlaceholder(value)) return false
  if (value.startsWith('/') && !value.startsWith('//')) return true
  try {
    return ['http:', 'https:', 'mailto:'].includes(new URL(value).protocol)
  } catch {
    return false
  }
}

export function isExternal(url: string): boolean {
  return /^https?:\/\//i.test(url)
}

export function isEmail(value: string): boolean {
  return /^[^\s@[\]]+@[^\s@[\]]+\.[^\s@[\]]+$/.test(value.trim())
}
