import type { Image } from '../../types'

type Props = {
  image?: Image
  /** Shown on the placeholder: what belongs here. */
  label: string
  /** The placeholder's shape, e.g. '16 / 10'. Real images use their own size. */
  ratio: string
  sizes?: string
  /** Lift the plate when the surrounding `.group` is hovered, and tilt it toward the pointer. */
  interactive?: boolean
  /** Wipe the plate into view as it scrolls in (see data-reveal="image" in index.css). */
  reveal?: boolean
  className?: string
}

/**
 * A framed image with its space reserved up front. Without an image it shows a
 * labelled placeholder, so the layout looks the same before and after.
 */
export function ImagePlate({ image, label, ratio, sizes, interactive = false, reveal = false, className = '' }: Props) {
  const lift = interactive
    ? 'elevate-1 transition-[translate,box-shadow,transform] duration-700 ease-expo motion-safe:group-hover:-translate-y-1.5 group-hover:elevate-2'
    : ''
  const revealAttr = reveal ? 'image' : undefined
  const tilt = interactive ? '' : undefined

  if (!image) {
    return (
      <div
        data-reveal={revealAttr}
        data-tilt={tilt}
        role="img"
        aria-label={`Image placeholder: ${label}`}
        style={{ aspectRatio: ratio }}
        className={`plate-hatch grid place-items-center overflow-hidden rounded-xl border border-dashed border-rule-strong ${lift} ${className}`}
      >
        <div className="max-w-[30ch] px-6 text-center">
          <p className="eyebrow">Image placeholder</p>
          <p className="mt-2 font-display text-lg leading-snug text-ink-2">{label}</p>
          <p className="mt-2 font-mono text-xs text-ink-3">
            {ratio.replace(' / ', ':')} · add <code>image</code> in src/content.ts
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
      data-reveal={revealAttr}
      data-tilt={tilt}
      style={{ aspectRatio: `${image.width} / ${image.height}` }}
      className={`overflow-hidden rounded-xl border border-rule bg-surface ${lift} ${className}`}
    >
      <img
        src={image.src}
        srcSet={image.srcSet}
        sizes={image.srcSet ? sizes : undefined}
        width={image.width}
        height={image.height}
        alt={image.alt}
        loading="lazy"
        decoding="async"
        className="size-full object-cover transition-[scale] duration-700 ease-expo motion-safe:group-hover:scale-[1.03]"
      />
    </div>
  )
}
