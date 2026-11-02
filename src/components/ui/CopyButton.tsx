import { useEffect, useState } from 'react'
import { buttonClass } from './button'
import { CheckIcon, CopyIcon } from './icons'

type Status = 'idle' | 'copied' | 'failed'

const announcements: Record<Status, string> = {
  idle: '',
  copied: 'Email address copied to the clipboard.',
  failed: 'Could not copy. Select the address and copy it instead.',
}

export function CopyButton({ value, label }: { value: string; label: string }) {
  const [status, setStatus] = useState<Status>('idle')

  useEffect(() => {
    if (status === 'idle') return
    const timer = setTimeout(() => setStatus('idle'), 2500)
    return () => clearTimeout(timer)
  }, [status])

  async function copy() {
    try {
      await navigator.clipboard.writeText(value)
      setStatus('copied')
    } catch {
      setStatus('failed')
    }
  }

  return (
    <>
      <button type="button" onClick={copy} className={buttonClass('secondary', 'min-w-36')}>
        {status === 'copied' ? <CheckIcon className="size-4" /> : <CopyIcon className="size-4" />}
        {status === 'copied' ? 'Copied' : status === 'failed' ? 'Copy failed' : label}
      </button>
      <span role="status" className="sr-only">
        {announcements[status]}
      </span>
    </>
  )
}
