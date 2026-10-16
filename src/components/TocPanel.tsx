import { SECTIONS } from '../data/script'
import { Sheet } from './Sheet'

interface Props {
  currentSection: number
  onJump: (sectionIndex: number) => void
  onClose: () => void
}

export function TocPanel({ currentSection, onJump, onClose }: Props) {
  let lastPart = ''
  return (
    <Sheet title="Contents" onClose={onClose} side="left">
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
