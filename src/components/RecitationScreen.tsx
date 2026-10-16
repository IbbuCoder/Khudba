import { Fragment, useEffect, useRef } from 'react'
import type { Recitation, Segment } from '../data/recitations'
import { displayArabic, toArabicDigits } from '../data/quran'
import { joinRuns, runsText, toUrduDigits, type Run } from '../data/indopak'
import { ARABIC_SCALE, type Settings } from '../storage'

interface Props {
  recitation: Recitation
  theme: 'light' | 'dark'
  settings: Settings
  onSettings: (patch: Partial<Settings>) => void
  /** advance=true returns to the paragraph after the recitation; false returns to the card. */
  onReturn: (advance: boolean) => void
}

const round = (n: number) => Math.round(n * 10) / 10

export function RecitationScreen({ recitation, theme, settings, onSettings, onReturn }: Props) {
  const headingRef = useRef<HTMLHeadingElement>(null)
  const indopak = settings.script === 'indopak'

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true })
  }, [recitation.id])

  // Page turner / keyboard: scroll through the page. Never advances on its own;
  // only a deliberate press at the very bottom returns to the khutbah.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4
      if (['ArrowRight', 'ArrowDown', 'PageDown', ' '].includes(e.key)) {
        e.preventDefault()
        if (atBottom) onReturn(true)
        else window.scrollBy({ top: window.innerHeight * 0.75, behavior: 'smooth' })
      } else if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(e.key)) {
        e.preventDefault()
        window.scrollBy({ top: -window.innerHeight * 0.75, behavior: 'smooth' })
      } else if (e.key === 'Escape') {
        onReturn(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onReturn])

  const setArabic = (delta: number) =>
    onSettings({
      arabicScale: round(Math.min(ARABIC_SCALE.max, Math.max(ARABIC_SCALE.min, settings.arabicScale + delta))),
    })

  const translations = (
    <div className={recitation.readTranslationAloud ? 'translations aloud' : 'translations'}>
      {recitation.segments.map((s, i) => (
        <p className="translation" key={i}>
          {s.ayahMarker !== undefined && <span className="verse-num">{s.ayahMarker}</span>}
          {s.translation}
        </p>
      ))}
    </div>
  )

  return (
    <div className="recitation">
      <header className="recitation-bar">
        <button className="icon-btn" onClick={() => onReturn(false)} aria-label="Back to the khutbah">
          ← <span className="btn-text">Back</span>
        </button>
        <div className="recitation-bar-spacer" />
        <button
          className="icon-btn"
          onClick={() => setArabic(-ARABIC_SCALE.step)}
          disabled={settings.arabicScale <= ARABIC_SCALE.min}
          aria-label="Smaller Arabic"
        >
          A−
        </button>
        <button
          className="icon-btn"
          onClick={() => setArabic(ARABIC_SCALE.step)}
          disabled={settings.arabicScale >= ARABIC_SCALE.max}
          aria-label="Larger Arabic"
        >
          A+
        </button>
        <button
          className="icon-btn"
          onClick={() => onSettings({ theme: theme === 'dark' ? 'light' : 'dark' })}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? '☀︎' : '☾'}
        </button>
      </header>

      <main className="recitation-body">
        <h1 className="recitation-title" ref={headingRef} tabIndex={-1}>
          {recitation.title}
          {recitation.optional && <span className="optional-tag">Optional</span>}
        </h1>

        <h2 className="step">
          <span className="step-num">1</span> Recite the Arabic
        </h2>

        <div className={indopak ? 'mushaf' : 'mushaf plain'}>
          <p className={indopak ? 'arabic indopak' : 'arabic'} dir="rtl" lang="ar">
            {recitation.segments.map((s, i) => (
              <Fragment key={i}>
                {i > 0 && ' '}
                <ArabicSegment segment={s} indopak={indopak} tajweed={settings.tajweed} />
              </Fragment>
            ))}
          </p>
        </div>

        <div className="translit-block" lang="ar-Latn">
          {recitation.segments.map((s, i) => (
            <p className="translit" key={i}>
              {s.ayahMarker !== undefined && <span className="verse-num">{s.ayahMarker}</span>}
              {s.transliteration}
            </p>
          ))}
        </div>

        {recitation.readTranslationAloud ? (
          <>
            <h2 className="step">
              <span className="step-num">2</span> Read the English
            </h2>
            {translations}
          </>
        ) : (
          <details className="meaning">
            <summary>Show the English meaning (not read aloud)</summary>
            {translations}
          </details>
        )}

        <button className="return-btn" onClick={() => onReturn(true)}>
          ↩️ Back to khutbah
        </button>

        <details className="sources">
          <summary>Sources</summary>
          <ul>
            {recitation.sources.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </details>
      </main>
    </div>
  )
}

function ArabicSegment({ segment: s, indopak, tajweed }: { segment: Segment; indopak: boolean; tajweed: boolean }) {
  const marker =
    s.ayahMarker === undefined ? null : (
      <span className="ayah-mark" aria-label={`end of verse ${s.ayahMarker}`}>
        {' '}
        {indopak ? '۝' + toUrduDigits(s.ayahMarker) : `﴿${toArabicDigits(s.ayahMarker)}﴾`}
      </span>
    )
  const text = !indopak ? (
    s.kind === 'quran' ? displayArabic(s.arabic) : s.arabic
  ) : s.indopak ? (
    <TajweedText runs={s.indopak} colour={tajweed} />
  ) : (
    s.arabic
  )
  return (
    <>
      {text}
      {marker}
    </>
  )
}

function TajweedText({ runs, colour }: { runs: Run[]; colour: boolean }) {
  if (!colour) return <>{runsText(runs)}</>
  return (
    <>
      {joinRuns(runs).map(([t, rule], i) =>
        rule ? (
          <span key={i} className={`tj tj-${rule}`}>
            {t}
          </span>
        ) : (
          <Fragment key={i}>{t}</Fragment>
        ),
      )}
    </>
  )
}
