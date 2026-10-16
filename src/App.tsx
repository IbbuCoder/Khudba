import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { BLOCKS, KHUTBAH_TITLE, SECTIONS, SECTION_START, type Block } from './data/script'
import { RECITATIONS } from './data/recitations'
import { loadPosition, loadSettings, savePosition, saveSettings, type Settings } from './storage'
import { useEffectiveTheme, useWakeLock } from './hooks'
import { ScriptBlock } from './components/ScriptBlock'
import { RecitationScreen } from './components/RecitationScreen'
import { TocPanel } from './components/TocPanel'
import { SettingsPanel } from './components/SettingsPanel'

type Panel = 'toc' | 'settings' | null

/** Distance (px) below the top bar at which the current block is placed. */
const READING_GAP = 20

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function App() {
  const [settings, setSettings] = useState<Settings>(loadSettings)
  const [saved] = useState(loadPosition)
  const initialIndex = useMemo(() => {
    const i = saved ? BLOCKS.findIndex((b) => b.id === saved.blockId) : -1
    return i >= 0 ? i : 0
  }, [saved])
  const [current, setCurrent] = useState(initialIndex)
  const [reciteIndex, setReciteIndex] = useState<number | null>(() => {
    const i = saved?.recitationBlockId ? BLOCKS.findIndex((b) => b.id === saved.recitationBlockId) : -1
    return i >= 0 && BLOCKS[i].type === 'recite' ? i : null
  })
  const [panel, setPanel] = useState<Panel>(null)
  const [presentation, setPresentation] = useState(false)
  const [restoredNotice, setRestoredNotice] = useState(initialIndex > 0)

  const blockRefs = useRef<(HTMLElement | null)[]>([])
  const topBarRef = useRef<HTMLElement>(null)
  /** Set while we scroll programmatically, so the scroll listener doesn't fight us. */
  const scrollingTo = useRef<number | null>(null)
  const scrollTimer = useRef<number | undefined>(undefined)
  /** Block to scroll to once the reader becomes visible again (after a recitation). */
  const pendingScroll = useRef<number | null>(initialIndex > 0 ? initialIndex : null)

  const theme = useEffectiveTheme(settings.theme)
  useWakeLock(settings.keepAwake)

  useEffect(() => saveSettings(settings), [settings])

  useEffect(() => {
    savePosition({
      blockId: BLOCKS[current].id,
      recitationBlockId: reciteIndex !== null ? BLOCKS[reciteIndex].id : undefined,
    })
  }, [current, reciteIndex])

  useEffect(() => {
    const root = document.documentElement
    root.dataset.theme = theme
    root.style.setProperty('--text-scale', String(settings.textScale))
    root.style.setProperty('--arabic-scale', String(settings.arabicScale))
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#000000' : '#0b5d3b')
  }, [theme, settings.textScale, settings.arabicScale])

  const topOffset = useCallback(() => (topBarRef.current?.offsetHeight ?? 0) + READING_GAP, [])

  const scrollToBlock = useCallback(
    (index: number, smooth: boolean) => {
      const el = blockRefs.current[index]
      setCurrent(index)
      if (!el) return
      const top = el.getBoundingClientRect().top + window.scrollY - topOffset()
      scrollingTo.current = index
      window.clearTimeout(scrollTimer.current)
      const behavior: ScrollBehavior = smooth && !prefersReducedMotion() ? 'smooth' : 'instant'
      window.scrollTo({ top: Math.max(0, top), behavior })
      // `scrollend` isn't available everywhere (older iOS); a timer is the fallback.
      scrollTimer.current = window.setTimeout(() => (scrollingTo.current = null), behavior === 'smooth' ? 900 : 80)
    },
    [topOffset],
  )

  // Track the block at the reading line while the user scrolls by hand.
  useEffect(() => {
    if (reciteIndex !== null) return
    let frame = 0
    const update = () => {
      frame = 0
      if (scrollingTo.current !== null) return
      const line = topOffset() + 16
      let found = 0
      for (let i = 0; i < BLOCKS.length; i++) {
        const el = blockRefs.current[i]
        if (el && el.getBoundingClientRect().top <= line) found = i
        else if (el) break
      }
      setCurrent(found)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    const onScrollEnd = () => {
      if (scrollingTo.current !== null) {
        window.clearTimeout(scrollTimer.current)
        scrollingTo.current = null
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('scrollend', onScrollEnd)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('scrollend', onScrollEnd)
      cancelAnimationFrame(frame)
    }
  }, [reciteIndex, topOffset])

  // After returning from a recitation (or on first load), jump to the right block.
  useLayoutEffect(() => {
    if (reciteIndex !== null || pendingScroll.current === null) return
    const target = pendingScroll.current
    pendingScroll.current = null
    scrollToBlock(target, false)
  }, [reciteIndex, presentation, scrollToBlock])

  const openRecitation = useCallback((index: number) => {
    setPanel(null)
    setCurrent(index)
    setReciteIndex(index)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  const closeRecitation = useCallback(
    (advance: boolean) => {
      if (reciteIndex === null) return
      pendingScroll.current = advance ? Math.min(reciteIndex + 1, BLOCKS.length - 1) : reciteIndex
      setReciteIndex(null)
    },
    [reciteIndex],
  )

  const goNext = useCallback(() => {
    setRestoredNotice(false)
    const block = BLOCKS[current]
    if (block.type === 'recite') return openRecitation(current)
    if (current < BLOCKS.length - 1) scrollToBlock(current + 1, true)
  }, [current, openRecitation, scrollToBlock])

  const goPrev = useCallback(() => {
    setRestoredNotice(false)
    if (current > 0) scrollToBlock(current - 1, true)
  }, [current, scrollToBlock])

  const jumpToSection = useCallback(
    (sectionIndex: number) => {
      setPanel(null)
      setRestoredNotice(false)
      scrollToBlock(SECTION_START[sectionIndex], false)
    },
    [scrollToBlock],
  )

  const restart = useCallback(() => {
    setPanel(null)
    setRestoredNotice(false)
    scrollToBlock(0, false)
  }, [scrollToBlock])

  const togglePresentation = useCallback(() => {
    setPanel(null)
    setPresentation((on) => {
      const next = !on
      try {
        if (next && document.fullscreenEnabled && !document.fullscreenElement) {
          void document.documentElement.requestFullscreen().catch(() => {})
        } else if (!next && document.fullscreenElement) {
          void document.exitFullscreen().catch(() => {})
        }
      } catch {
        // Fullscreen isn't available on iPhone; presentation mode still hides the controls.
      }
      return next
    })
    pendingScroll.current = current
  }, [current])

  // Keyboard and Bluetooth page-turner support for the reading view.
  useEffect(() => {
    if (reciteIndex !== null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (panel) {
        if (e.key === 'Escape') setPanel(null)
        return
      }
      const target = e.target as HTMLElement | null
      if (target?.closest('input, select, textarea')) return
      if (['ArrowRight', 'ArrowDown', 'PageDown', ' '].includes(e.key)) {
        e.preventDefault()
        goNext()
      } else if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(e.key)) {
        e.preventDefault()
        goPrev()
      } else if (e.key === 'Escape' && presentation) {
        togglePresentation()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [reciteIndex, panel, presentation, goNext, goPrev, togglePresentation])

  const updateSettings = useCallback((patch: Partial<Settings>) => setSettings((s) => ({ ...s, ...patch })), [])

  const block: Block = BLOCKS[current]
  const section = SECTIONS[block.sectionIndex]
  const progress = BLOCKS.length > 1 ? current / (BLOCKS.length - 1) : 1
  const atEnd = current >= BLOCKS.length - 1
  const nextLabel = block.type === 'recite' ? 'Open Arabic' : atEnd ? 'End' : 'Next'

  const reciteBlock = reciteIndex !== null ? BLOCKS[reciteIndex] : null
  const recitation = reciteBlock?.type === 'recite' ? RECITATIONS[reciteBlock.recitationId] : null

  return (
    <>
      {recitation && reciteIndex !== null && (
        <RecitationScreen
          recitation={recitation}
          theme={theme}
          settings={settings}
          onSettings={updateSettings}
          onReturn={closeRecitation}
        />
      )}

      <div className={`reader${presentation ? ' presenting' : ''}`} hidden={reciteIndex !== null}>
        <div className="progress" role="progressbar" aria-label="Progress through khutbah" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)}>
          <div className="progress-fill" style={{ transform: `scaleX(${progress})` }} />
        </div>

        {!presentation && (
          <header className="topbar" ref={topBarRef}>
            <button className="icon-btn" onClick={() => setPanel('toc')} aria-label="Table of contents">
              <span aria-hidden>☰</span>
              <span className="btn-text">Contents</span>
            </button>
            <div className="topbar-center" aria-live="polite">
              <div className="topbar-part">{section.part}</div>
              <div className="topbar-section">{section.title}</div>
            </div>
            <button className="icon-btn" onClick={() => setPanel('settings')} aria-label="Text size and theme">
              <span aria-hidden className="aa">Aa</span>
            </button>
            <button className="icon-btn" onClick={togglePresentation} aria-label="Start presentation mode">
              <span aria-hidden>⛶</span>
              <span className="btn-text">Present</span>
            </button>
          </header>
        )}

        <main className="script" aria-label="Khutbah script">
          <h1 className="script-title">{KHUTBAH_TITLE}</h1>
          {BLOCKS.map((b) => (
            <ScriptBlock
              key={b.id}
              block={b}
              isCurrent={b.index === current}
              ref={(el) => {
                blockRefs.current[b.index] = el
              }}
              onSelect={() => scrollToBlock(b.index, true)}
              onOpenRecitation={() => openRecitation(b.index)}
            />
          ))}
          <div className="end-spacer" />
        </main>

        {restoredNotice && (
          <div className="toast" role="status">
            <span>Resumed where you left off: {section.title}</span>
            <button onClick={restart}>Start over</button>
            <button onClick={() => setRestoredNotice(false)} aria-label="Dismiss">
              ✕
            </button>
          </div>
        )}

        <nav className="bottombar" aria-label="Script navigation">
          <button className="nav-btn" onClick={goPrev} disabled={current === 0}>
            ‹ Previous
          </button>
          {presentation && (
            <button className="exit-presentation" onClick={togglePresentation} aria-label="Exit presentation mode">
              ✕
            </button>
          )}
          <div className="bottom-status">
            <span className="bottom-section">{presentation ? section.title : `Section ${block.sectionIndex + 1} of ${SECTIONS.length}`}</span>
            <span className="bottom-percent">{Math.round(progress * 100)}%</span>
          </div>
          <button className={`nav-btn primary${block.type === 'recite' ? ' recite' : ''}`} onClick={goNext} disabled={atEnd}>
            {nextLabel} ›
          </button>
        </nav>

        {panel === 'toc' && <TocPanel currentSection={block.sectionIndex} onJump={jumpToSection} onClose={() => setPanel(null)} />}
        {panel === 'settings' && (
          <SettingsPanel settings={settings} onChange={updateSettings} onRestart={restart} onClose={() => setPanel(null)} />
        )}
      </div>
    </>
  )
}
