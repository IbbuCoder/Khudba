import { ARABIC_SCALE, TEXT_SCALE, type ArabicScript, type Settings, type ThemeSetting } from '../storage'
import { getIndopakVerse, TAJWEED_LEGEND } from '../data/indopak'
import { displayArabic, getVerse } from '../data/quran'
import { wakeLockSupported } from '../hooks'
import { Sheet } from './Sheet'

interface Props {
  settings: Settings
  onChange: (patch: Partial<Settings>) => void
  onRestart: () => void
  onClose: () => void
}

const THEMES: { value: ThemeSetting; label: string }[] = [
  { value: 'light', label: '☀︎ Light' },
  { value: 'dark', label: '☾ Dark' },
  { value: 'system', label: 'Device' },
]

const SCRIPTS: { value: ArabicScript; label: string }[] = [
  { value: 'indopak', label: 'Indo-Pak' },
  { value: 'uthmani', label: 'Uthmani' },
]

const round = (n: number) => Math.round(n * 10) / 10

function Stepper({
  label,
  value,
  range,
  onChange,
}: {
  label: string
  value: number
  range: { min: number; max: number; step: number }
  onChange: (v: number) => void
}) {
  const set = (v: number) => onChange(round(Math.min(range.max, Math.max(range.min, v))))
  return (
    <div className="setting-row">
      <span className="setting-label">{label}</span>
      <div className="stepper">
        <button onClick={() => set(value - range.step)} disabled={value <= range.min} aria-label={`Smaller ${label}`}>
          A−
        </button>
        <output aria-live="polite">{Math.round(value * 100)}%</output>
        <button onClick={() => set(value + range.step)} disabled={value >= range.max} aria-label={`Larger ${label}`}>
          A+
        </button>
      </div>
    </div>
  )
}

export function SettingsPanel({ settings, onChange, onRestart, onClose }: Props) {
  return (
    <Sheet title="Display" onClose={onClose}>
      <div className="setting-row">
        <span className="setting-label">Theme</span>
        <div className="segmented" role="radiogroup" aria-label="Theme">
          {THEMES.map((t) => (
            <button
              key={t.value}
              role="radio"
              aria-checked={settings.theme === t.value}
              className={settings.theme === t.value ? 'is-selected' : ''}
              onClick={() => onChange({ theme: t.value })}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <Stepper label="English text" value={settings.textScale} range={TEXT_SCALE} onChange={(v) => onChange({ textScale: v })} />
      <p className="setting-sample">My brothers and sisters,</p>

      <div className="setting-row">
        <span className="setting-label">Arabic style</span>
        <div className="segmented" role="radiogroup" aria-label="Arabic style">
          {SCRIPTS.map((t) => (
            <button
              key={t.value}
              role="radio"
              aria-checked={settings.script === t.value}
              className={settings.script === t.value ? 'is-selected' : ''}
              onClick={() => onChange({ script: t.value })}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {settings.script === 'indopak' && (
        <>
          <label className="setting-row toggle">
            <span className="setting-label">Tajweed colours</span>
            <input type="checkbox" checked={settings.tajweed} onChange={(e) => onChange({ tajweed: e.target.checked })} />
          </label>
          {settings.tajweed && (
            <div className="tajweed-legend" aria-label="Tajweed colour key">
              {TAJWEED_LEGEND.map(({ rule, label }) => (
                <span key={rule} className={`legend-item tj-${rule}`}>
                  <span className="legend-dot" aria-hidden />
                  {label}
                </span>
              ))}
            </div>
          )}
        </>
      )}

      <Stepper label="Arabic text" value={settings.arabicScale} range={ARABIC_SCALE} onChange={(v) => onChange({ arabicScale: v })} />
      <p className={`setting-sample arabic-sample${settings.script === 'uthmani' ? ' uthmani' : ''}`} dir="rtl" lang="ar">
        {settings.script === 'indopak' ? getIndopakVerse('1:2').text : displayArabic(getVerse('1:2').arabic)}
      </p>

      {wakeLockSupported() && (
        <label className="setting-row toggle">
          <span className="setting-label">Keep screen awake</span>
          <input type="checkbox" checked={settings.keepAwake} onChange={(e) => onChange({ keepAwake: e.target.checked })} />
        </label>
      )}

      <div className="setting-row">
        <span className="setting-label">Reading position</span>
        <button className="plain-btn" onClick={onRestart}>
          Go to beginning
        </button>
      </div>

      <p className="setting-note">
        Your place and display settings are saved on this device only. After the first visit, the script works offline.
      </p>
    </Sheet>
  )
}
