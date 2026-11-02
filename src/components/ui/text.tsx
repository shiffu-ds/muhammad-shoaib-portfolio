import { Fragment, type CSSProperties } from 'react'
import { isPlaceholder } from '../../lib/placeholder'

/** Content text. "[Placeholders]" get a dotted underline so they're easy to find and replace. */
export function Fill({ text }: { text: string }) {
  if (!isPlaceholder(text)) return text
  return (
    <span className="placeholder" title="Placeholder — replace it in src/content.ts">
      {text}
    </span>
  )
}

/** Text with one phrase picked out by a highlighter stroke. */
export function Highlight({ text, phrase }: { text: string; phrase: string }) {
  const at = phrase ? text.indexOf(phrase) : -1
  if (at === -1) return <Fill text={text} />
  return (
    <>
      {text.slice(0, at)}
      <span className="marker">{phrase}</span>
      {text.slice(at + phrase.length)}
    </>
  )
}

/**
 * Text split into words (`.word`, each with its index in --i) so a heading can rise in
 * word by word. An optional phrase keeps its highlighter stroke.
 */
export function Words({ text, highlight = '' }: { text: string; highlight?: string }) {
  const at = highlight ? text.indexOf(highlight) : -1
  const parts =
    at === -1
      ? [{ chunk: text, marked: false }]
      : [
          { chunk: text.slice(0, at), marked: false },
          { chunk: highlight, marked: true },
          { chunk: text.slice(at + highlight.length), marked: false },
        ]
  let index = 0
  const split = (chunk: string) =>
    chunk.split(/(\s+)/).map((piece, i) =>
      piece.trim() ? (
        <span key={i} className="word" style={{ '--i': index++ } as CSSProperties}>
          {piece}
        </span>
      ) : (
        piece
      ),
    )
  return parts.map(({ chunk, marked }, i) =>
    marked ? (
      <span key={i} className="marker">
        {split(chunk)}
      </span>
    ) : (
      <Fragment key={i}>{split(chunk)}</Fragment>
    ),
  )
}

/**
 * Text split into letters (`.char`, each with its index in --i) grouped by word, for
 * letter-by-letter entrances. Screen readers get the plain text instead of the pieces.
 */
export function Letters({ text }: { text: string }) {
  let index = 0
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {text.split(/(\s+)/).map((word, w) =>
          word.trim() ? (
            <span key={w} className="word">
              {[...word].map((char, c) => (
                <span key={c} className="char" style={{ '--i': index++ } as CSSProperties}>
                  {char}
                </span>
              ))}
            </span>
          ) : (
            word
          ),
        )}
      </span>
    </>
  )
}

/** A link label that rolls up to an accent copy of itself on hover (needs `.roll` on the link). */
export function RollText({ text }: { text: string }) {
  return (
    <span className="roll-text">
      <span>{text}</span>
      <span aria-hidden="true" className="text-accent">
        {text}
      </span>
    </span>
  )
}

/** A row of small tags, e.g. tools on a project. */
export function Chips({ items }: { items: string[] }) {
  return (
    <ul data-reveal="stagger" className="flex flex-wrap gap-1.5">
      {items.map((item, i) => (
        <li
          key={`${i}-${item}`}
          style={{ '--i': i } as CSSProperties}
          className={`chip rounded-full border bg-surface px-2.5 py-1 font-mono text-xs leading-4 text-ink-2 ${
            isPlaceholder(item) ? 'border-dashed border-rule-strong' : 'border-rule'
          }`}
        >
          <Fill text={item} />
        </li>
      ))}
    </ul>
  )
}
