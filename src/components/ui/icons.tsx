import type { ReactNode } from 'react'

type IconProps = { className?: string }

function icon(paths: ReactNode) {
  return function Icon({ className = 'size-4' }: IconProps) {
    return (
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        {paths}
      </svg>
    )
  }
}

export const ArrowDownIcon = icon(<path d="M12 5v14M6 13l6 6 6-6" />)
export const ArrowUpIcon = icon(<path d="M12 19V5M6 11l6-6 6 6" />)
export const ArrowRightIcon = icon(<path d="M5 12h14M13 6l6 6-6 6" />)
export const ArrowUpRightIcon = icon(<path d="M7 17 17 7M8.5 7H17v8.5" />)
export const ChevronDownIcon = icon(<path d="m6 9 6 6 6-6" />)
export const CheckIcon = icon(<path d="m5 12.5 4.5 4.5L19 7.5" />)
export const DownloadIcon = icon(<path d="M12 4v11M7 10l5 5 5-5M5 20h14" />)
export const RefreshIcon = icon(
  <>
    <path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3" />
    <path d="M19.5 4.5v4h-4" />
  </>,
)
export const CopyIcon = icon(
  <>
    <rect x="8.5" y="8.5" width="11" height="11" rx="2" />
    <path d="M15.5 8.5V6.5a2 2 0 0 0-2-2h-7a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h2" />
  </>,
)
export const ContrastIcon = icon(
  <>
    <circle cx="12" cy="12" r="8.25" />
    <path d="M12 3.75a8.25 8.25 0 0 1 0 16.5Z" fill="currentColor" stroke="none" />
  </>,
)
