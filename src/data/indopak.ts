import data from './quran-indopak.json'

/** Tajweed rule groups coloured in the Indo-Pak display. */
export type TajweedRule = 'ghunnah' | 'idgham' | 'ikhfa' | 'iqlab' | 'qalqalah'
export type Run = [text: string, rule: TajweedRule | null]

interface IndopakVerse {
  text: string
  runs: Run[]
}

const verses = data.verses as unknown as Record<string, IndopakVerse>

export const INDOPAK_SOURCE = data._source

export const TAJWEED_LEGEND: { rule: TajweedRule; label: string }[] = [
  { rule: 'ghunnah', label: 'Ghunnah' },
  { rule: 'idgham', label: 'Idghām' },
  { rule: 'ikhfa', label: 'Ikhfāʾ' },
  { rule: 'iqlab', label: 'Iqlāb' },
  { rule: 'qalqalah', label: 'Qalqalah' },
]

export function getIndopakVerse(key: string): IndopakVerse {
  const verse = verses[key]
  if (!verse) throw new Error(`Verse ${key} is not in quran-indopak.json`)
  return verse
}

/**
 * Tajweed runs for a verse, optionally starting at a (0-based) word, as with
 * verifiedArabic(). Indo-Pak word positions differ from Uthmani ones because
 * pause marks are written as separate words.
 */
export function indopakRuns(key: string, fromWord?: number): Run[] {
  const { text, runs } = getIndopakVerse(key)
  if (fromWord === undefined) return runs
  const words = text.split(' ')
  if (fromWord <= 0 || fromWord >= words.length) throw new Error(`Word ${fromWord} is outside verse ${key}`)
  let offset = words.slice(0, fromWord).join(' ').length + 1
  const out: Run[] = []
  for (const [t, rule] of runs) {
    if (offset >= t.length) {
      offset -= t.length
      continue
    }
    out.push([t.slice(offset), rule])
    offset = 0
  }
  return out
}

export const runsText = (runs: Run[]) => runs.map(([t]) => t).join('')

// Letters that never connect to the following letter.
const NON_LEFT_JOINING = new Set('اأإآٱٲٳٵدذرزوؤۄۅۆۇۈۉۊۋۏةۃۀژڈڑےۓءﺀ')
const LETTER = /\p{L}/u

/**
 * Colouring part of a word puts letters in separate spans. To keep them
 * joined in every browser, a zero-width joiner is added on both sides of a
 * boundary between two letters that connect.
 */
export function joinRuns(runs: Run[]): Run[] {
  const out: Run[] = runs.map(([t, r]) => [t, r])
  for (let i = 0; i < out.length - 1; i++) {
    const left = out[i][0]
    const right = out[i + 1][0]
    const lastLetter = [...left].reverse().find((c) => LETTER.test(c))
    const endsInWord = !/\s$/.test(left)
    const startsWithLetter = LETTER.test(right[0] ?? '')
    if (lastLetter && endsInWord && startsWithLetter && !NON_LEFT_JOINING.has(lastLetter)) {
      out[i][0] = left + '‍'
      out[i + 1][0] = '‍' + right
    }
  }
  return out
}

const URDU_DIGITS = '۰۱۲۳۴۵۶۷۸۹'
export const toUrduDigits = (n: number) => String(n).replace(/\d/g, (d) => URDU_DIGITS[Number(d)])
