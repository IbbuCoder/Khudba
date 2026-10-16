export type ThemeSetting = 'light' | 'dark' | 'system'

export interface Settings {
  theme: ThemeSetting
  /** Multiplier for the English script text. */
  textScale: number
  /** Multiplier for Arabic on recitation screens. */
  arabicScale: number
  keepAwake: boolean
}

export interface Position {
  /** Id of the block at the reading line. Ids are stable across reloads. */
  blockId: string
  /** Recitation screen that was open, if any. */
  recitationBlockId?: string
}

export const DEFAULT_SETTINGS: Settings = {
  theme: 'light',
  textScale: 1,
  arabicScale: 1,
  keepAwake: true,
}

export const TEXT_SCALE = { min: 0.8, max: 2, step: 0.1 }
export const ARABIC_SCALE = { min: 0.7, max: 2, step: 0.1 }

const SETTINGS_KEY = 'khutbah-reader:settings'
const POSITION_KEY = 'khutbah-reader:position'

function read<T>(key: string): Partial<T> | null {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as Partial<T>) : null
  } catch {
    return null
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Private mode or storage full: the app still works, it just won't remember.
  }
}

const clamp = (n: unknown, { min, max }: { min: number; max: number }, fallback: number) =>
  typeof n === 'number' && Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback

export function loadSettings(): Settings {
  const s = read<Settings>(SETTINGS_KEY) ?? {}
  return {
    theme: s.theme === 'dark' || s.theme === 'system' || s.theme === 'light' ? s.theme : DEFAULT_SETTINGS.theme,
    textScale: clamp(s.textScale, TEXT_SCALE, DEFAULT_SETTINGS.textScale),
    arabicScale: clamp(s.arabicScale, ARABIC_SCALE, DEFAULT_SETTINGS.arabicScale),
    keepAwake: typeof s.keepAwake === 'boolean' ? s.keepAwake : DEFAULT_SETTINGS.keepAwake,
  }
}

export const saveSettings = (s: Settings) => write(SETTINGS_KEY, s)

export function loadPosition(): Position | null {
  const p = read<Position>(POSITION_KEY)
  return p && typeof p.blockId === 'string' ? (p as Position) : null
}

export const savePosition = (p: Position) => write(POSITION_KEY, p)
