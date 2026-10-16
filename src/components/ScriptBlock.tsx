import type { Ref } from 'react'
import type { Block, CueKind } from '../data/script'
import { RECITATIONS } from '../data/recitations'

const CUES: Record<CueKind, { icon: string; label: string; detail?: string }> = {
  pause: { icon: '⏸️', label: 'Pause' },
  sit: { icon: '🪑', label: 'Sit briefly', detail: 'Sit before the second khutbah. Press Next when you stand.' },
  stand: { icon: '🧍', label: 'Stand', detail: 'Stand for the second khutbah.' },
  dua: { icon: '🤲', label: 'English du‘a', detail: 'Read the du‘a below in English.' },
  end: { icon: '🏁', label: 'End the khutbah' },
  note: { icon: '📚', label: 'Reference — do not read aloud' },
}

interface Props {
  block: Block
  isCurrent: boolean
  ref: Ref<HTMLElement>
  onSelect: () => void
  onOpenRecitation: () => void
}

export function ScriptBlock({ block, isCurrent, ref, onSelect, onOpenRecitation }: Props) {
  const current = isCurrent ? ' is-current' : ''

  switch (block.type) {
    case 'heading':
      return (
        <h2 className={`part-heading${current}`} ref={ref as Ref<HTMLHeadingElement>}>
          {block.text}
        </h2>
      )

    case 'para':
      return (
        <p
          className={`speech${block.dua ? ' dua-line' : ''}${current}`}
          ref={ref as Ref<HTMLParagraphElement>}
          onClick={onSelect}
        >
          {block.text}
        </p>
      )

    case 'cue': {
      const cue = CUES[block.cue]
      return (
        <div
          className={`cue cue-${block.cue}${current}`}
          ref={ref as Ref<HTMLDivElement>}
          role="note"
          aria-label={`Instruction, not spoken: ${cue.label}`}
          onClick={onSelect}
        >
          <div className="cue-label">
            <span className="cue-icon" aria-hidden>
              {cue.icon}
            </span>
            {cue.label}
          </div>
          {(block.text ?? cue.detail) && <div className="cue-detail">{block.text ?? cue.detail}</div>}
        </div>
      )
    }

    case 'recite': {
      const r = RECITATIONS[block.recitationId]
      return (
        <section
          className={`recite-card${r.optional ? ' optional' : ''}${current}`}
          ref={ref as Ref<HTMLElement>}
          aria-label={`Instruction: recite ${r.title} in Arabic`}
        >
          <div className="cue-label">
            <span className="cue-icon" aria-hidden>
              📖
            </span>
            Recite Arabic{r.optional && <span className="optional-tag">Optional</span>}
          </div>
          <h3 className="recite-title">{r.title}</h3>
          <p className="recite-subtitle">{r.subtitle}</p>
          <ol className="recite-steps">
            <li>
              <span aria-hidden>📖</span> Open the Arabic page and recite
            </li>
            {r.readTranslationAloud && (
              <li>
                <span aria-hidden>🇬🇧</span> Read the English translation
              </li>
            )}
            <li>
              <span aria-hidden>↩️</span> Return to the khutbah
            </li>
          </ol>
          <button className="open-recitation" onClick={onOpenRecitation}>
            Open Arabic page →
          </button>
        </section>
      )
    }
  }
}
