import { SECTIONS } from '../data/script'
import { Sheet } from './Sheet'
import { formatMinutes, SECTION_SECONDS, TOTAL_SECONDS } from '../data/timing'

interface Props {
  currentSection: number
  onJump: (sectionIndex: number) => void
  onClose: () => void
}

export function TocPanel({ currentSection, onJump, onClose }: Props) {
  let lastPart = ''
  return (
    <Sheet title="Contents" onClose={onClose} side="left">
      <p className="toc-total">About {Math.round(TOTAL_SECONDS / 60)} minutes in total</p>
      <ol className="toc">
        {SECTIONS.map((s, i) => {
          const showPart = s.part !== lastPart
          lastPart = s.part
          const hasArabic = s.blocks.some((b) => b.type === 'recite')
          return (
            <li key={s.id}>
              {showPart && <div className="toc-part">{s.part}</div>}
              <button
                className={`toc-item${i === currentSection ? ' is-current' : ''}`}
                onClick={() => onJump(i)}
                aria-current={i === currentSection ? 'location' : undefined}
              >
                <span className="toc-num">{i + 1}</span>
                <span className="toc-title">{s.title}</span>
                {SECTION_SECONDS[i] > 0 && <span className="toc-time">{formatMinutes(SECTION_SECONDS[i])}</span>}
                {hasArabic && (
                  <span className="toc-badge" aria-label="Arabic recitation">
                    📖
                  </span>
                )}
              </button>
            </li>
          )
        })}
      </ol>
    </Sheet>
  )
}
