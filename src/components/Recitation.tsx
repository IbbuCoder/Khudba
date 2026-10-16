import { Fragment } from 'react'
import type { Recitation, Segment } from '../data/recitations'
import { displayArabic, toArabicDigits } from '../data/quran'
import { joinRuns, runsText, toUrduDigits, type Run } from '../data/indopak'
import type { Settings } from '../storage'

interface ArabicProps {
  recitation: Recitation
  settings: Settings
}

/** The Arabic of a recitation, inline in the script: mushaf page + transliteration. */
export function ArabicContent({ recitation, settings }: ArabicProps) {
  const indopak = settings.script === 'indopak'
  return (
    <>
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
      {!recitation.readTranslationAloud && (
        <details className="meaning">
          <summary>English meaning (not read aloud)</summary>
          <Translations recitation={recitation} />
        </details>
      )}
    </>
  )
}

export function Translations({ recitation }: { recitation: Recitation }) {
  return (
    <>
      {recitation.segments.map((s, i) => (
        <p className="translation" key={i}>
          {s.ayahMarker !== undefined && <span className="verse-num">{s.ayahMarker}</span>}
          {s.translation}
        </p>
      ))}
    </>
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
