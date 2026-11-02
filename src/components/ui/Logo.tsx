/** The mark: a sigmoid with a dot on its decision boundary (p = 0.5). Matches public/favicon.svg. */
export function Logo({ className = 'size-7' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false" className={className}>
      <rect width="32" height="32" rx="8" className="fill-ink" />
      <path
        d="M6 23.5C14 23.5 18 8.5 26 8.5"
        fill="none"
        strokeWidth="2.75"
        strokeLinecap="round"
        className="stroke-bg"
      />
      <circle cx="16" cy="16" r="3" className="fill-dot" />
    </svg>
  )
}
