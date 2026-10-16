import { ARABIC_SCALE, TEXT_SCALE, type Settings, type ThemeSetting } from '../storage'
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

      <Stepper label="Arabic text" value={settings.arabicScale} range={ARABIC_SCALE} onChange={(v) => onChange({ arabicScale: v })} />
      <p className="setting-sample arabic-sample" dir="rtl" lang="ar">
        إِنَّ الْحَمْدَ لِلَّهِ
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
