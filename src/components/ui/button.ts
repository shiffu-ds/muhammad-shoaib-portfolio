type Variant = 'primary' | 'secondary'

const variants: Record<Variant, string> = {
  primary: 'btn-shine bg-accent text-on-accent elevate-accent hover:bg-accent-strong',
  secondary: 'border border-rule-strong text-ink hover:border-ink hover:bg-surface',
}

/** The shared pill-button look, for both <a> and <button> elements: lifts on hover, presses in on click. */
export function buttonClass(variant: Variant, extra = '') {
  return `group inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-[0.9375rem] font-medium whitespace-nowrap transition-[background-color,border-color,color,translate,scale,transform] duration-300 ease-soft hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] ${variants[variant]} ${extra}`.trim()
}
