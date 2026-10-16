import type { Ref } from 'react'
import type { Block, CueKind } from '../data/script'
import { RECITATIONS } from '../data/recitations'

const CUES: Record<CueKind, { icon: string; label: string }> = {
  pause: { icon: '⏸️', label: 'Pause' },
  sit: { icon: '🪑', label: 'Sit briefly' },
  stand: { icon: '🧍', label: 'Stand up' },
  dua: { icon: '🤲', label: 'Make du‘a' },
  end: { icon: '🏁', label: 'End of khutbah' },
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
          <span className="cue-icon" aria-hidden>
            {cue.icon}
          </span>
          {cue.label}
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
          <div className="recite-label">
            <span aria-hidden>📖</span> Arabic{r.optional && <span className="optional-tag">Optional</span>}
          </div>
          <h3 className="recite-title">{r.title}</h3>
          <button className="open-recitation" onClick={onOpenRecitation}>
            Open Arabic page →
          </button>
        </section>
      )
    }
  }
}
