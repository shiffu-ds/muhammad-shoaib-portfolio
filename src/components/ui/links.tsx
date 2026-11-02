import type { ReactNode } from 'react'
import { isExternal } from '../../lib/placeholder'
import { buttonClass } from './button'
import { ArrowUpRightIcon, DownloadIcon } from './icons'

const newTab = { target: '_blank', rel: 'noopener noreferrer' }

/** A text link with an arrow. Off-site links open in a new tab and say so to screen readers. */
export function TextLink({ href, children, className = '' }: { href: string; children: ReactNode; className?: string }) {
  const external = isExternal(href)
  return (
    <a href={href} className={`group ${className}`} {...(external ? newTab : {})}>
      {children}
      <ArrowUpRightIcon className="size-4 shrink-0 transition-transform duration-200 motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5" />
      {external && <span className="sr-only"> (opens in a new tab)</span>}
    </a>
  )
}

/** Downloads a résumé stored in /public, or opens one hosted elsewhere. */
export function ResumeLink({ url }: { url: string }) {
  const external = isExternal(url)
  return (
    <a href={url} className={buttonClass('secondary')} {...(external ? newTab : { download: '' })}>
      <DownloadIcon className="size-4" />
      {external ? 'View résumé' : 'Download résumé'}
      {external && <span className="sr-only"> (opens in a new tab)</span>}
    </a>
  )
}
