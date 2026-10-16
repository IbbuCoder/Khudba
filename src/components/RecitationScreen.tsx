import { useEffect, useRef } from 'react'
import type { Recitation } from '../data/recitations'
import { displayArabic, toArabicDigits } from '../data/quran'
import { joinRuns, TAJWEED_LEGEND, toUrduDigits, type Run } from '../data/indopak'
import { ARABIC_SCALE, type Settings } from '../storage'

interface Props {
  recitation: Recitation
  nextText?: string
  theme: 'light' | 'dark'
  settings: Settings
  onSettings: (patch: Partial<Settings>) => void
  /** advance=true returns to the paragraph after the recitation; false returns to the card. */
  onReturn: (advance: boolean) => void
}

const round = (n: number) => Math.round(n * 10) / 10

function preview(text: string, max = 110) {
  return text.length > max ? `${text.slice(0, text.lastIndexOf(' ', max))}…` : text
}

export function RecitationScreen({ recitation, nextText, theme, settings, onSettings, onReturn }: Props) {
  const headingRef = useRef<HTMLHeadingElement>(null)

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

  const indopak = settings.script === 'indopak'

  const setArabic = (delta: number) =>
    onSettings({
      arabicScale: round(Math.min(ARABIC_SCALE.max, Math.max(ARABIC_SCALE.min, settings.arabicScale + delta))),
    })

  return (
    <div className="recitation">
      <header className="recitation-bar">
        <button className="icon-btn" onClick={() => onReturn(false)} aria-label="Back to the khutbah without advancing">
          ← <span className="btn-text">Khutbah</span>
        </button>
        <div className="recitation-bar-title">📖 Recite Arabic</div>
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
        <p className="recitation-subtitle">{recitation.subtitle}</p>

        <div className="step-banner step-recite">
          <span aria-hidden>📖</span> Recite Arabic
        </div>
        <p className="step-hint">{recitation.instruction}</p>

        {indopak && settings.tajweed && <TajweedLegend />}

        {recitation.segments.map((s, i) => (
          <div className="segment" key={i}>
            <div className="segment-ref">{s.ref}</div>
            {indopak ? (
              <div className="mushaf">
                <p className="arabic indopak" dir="rtl" lang="ar">
                  {s.indopak ? <TajweedText runs={s.indopak} colour={settings.tajweed} /> : s.arabic}
                  {s.ayahMarker !== undefined && (
                    <span className="ayah-mark" aria-label={`end of verse ${s.ayahMarker}`}>
                      {' '}
                      {'\u06DD' + toUrduDigits(s.ayahMarker)}
                    </span>
                  )}
                </p>
              </div>
            ) : (
              <p className="arabic" dir="rtl" lang="ar">
                {s.kind === 'quran' ? displayArabic(s.arabic) : s.arabic}
                {s.ayahMarker !== undefined && (
                  <span className="ayah-mark" aria-label={`end of verse ${s.ayahMarker}`}>
                    {' '}
                    ﴿{toArabicDigits(s.ayahMarker)}﴾
                  </span>
                )}
              </p>
            )}
            <p className="translit" lang="ar-Latn">
              {s.transliteration}
            </p>
          </div>
        ))}

        {recitation.readTranslationAloud ? (
          <div className="step-banner step-translate">
            <span aria-hidden>🇬🇧</span> Read English translation
          </div>
        ) : (
          <div className="step-banner step-meaning">
            <span aria-hidden>🔎</span> English meaning — for your reference
          </div>
        )}
        {!recitation.readTranslationAloud && <p className="step-hint">Not part of the script — no need to read this aloud.</p>}

        <div className={recitation.readTranslationAloud ? 'translations aloud' : 'translations'}>
          {recitation.segments.map((s, i) => (
            <p className="translation" key={i}>
              <span className="translation-ref">{s.ref}</span>
              {s.translation}
            </p>
          ))}
        </div>

        <div className="return-block">
          <button className="return-btn" onClick={() => onReturn(true)}>
            <span aria-hidden>↩️</span> Return to khutbah
          </button>
          {nextText && (
            <p className="next-preview">
              <span>Next you say:</span> “{preview(nextText)}”
            </p>
          )}
        </div>

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

function TajweedText({ runs, colour }: { runs: Run[]; colour: boolean }) {
  if (!colour) return <>{runs.map(([t]) => t).join('')}</>
  return (
    <>
      {joinRuns(runs).map(([t, rule], i) =>
        rule ? (
          <span key={i} className={`tj tj-${rule}`}>
            {t}
          </span>
        ) : (
          t
        ),
      )}
    </>
  )
}

function TajweedLegend() {
  return (
    <div className="tajweed-legend" aria-label="Tajweed colour key">
      {TAJWEED_LEGEND.map(({ rule, label }) => (
        <span key={rule} className={`legend-item tj-${rule}`}>
          <span className="legend-dot" aria-hidden />
          {label}
        </span>
      ))}
    </div>
  )
}
