import { useEffect, useRef, type ReactNode } from 'react'

interface Props {
  title: string
  onClose: () => void
  side?: 'left' | 'bottom'
  children: ReactNode
}

/** A simple modal panel. Closes on backdrop tap, the ✕ button, or Escape. */
export function Sheet({ title, onClose, side = 'bottom', children }: Props) {
  const panelRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    panelRef.current?.focus()
  }, [])
  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div
        className={`sheet sheet-${side}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        ref={panelRef}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sheet-header">
          <h2>{title}</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>
        <div className="sheet-body">{children}</div>
      </div>
    </div>
  )
}
