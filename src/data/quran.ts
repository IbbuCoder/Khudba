import verified from './quran-verified.json'

export interface VerifiedVerse {
  surah: number
  surahName: string
  ayah: number
  arabic: string
  translation: string
}

const verses = verified.verses as Record<string, VerifiedVerse>

export const QURAN_SOURCE = verified._source

export function getVerse(key: string): VerifiedVerse {
  const verse = verses[key]
  if (!verse) throw new Error(`Verse ${key} is not in quran-verified.json`)
  return verse
}

/**
 * Returns the verified Arabic for a verse. When `fromWord` is given, the text
 * starts at that (0-based) word and runs to the end of the verse — used for
 * du'as that begin part-way through an ayah, e.g. "رَبَّنَآ" in 2:201.
 * Slicing by word position means no Qur'anic Arabic is ever typed by hand.
 */
export function verifiedArabic(key: string, fromWord?: number): string {
  const { arabic } = getVerse(key)
  if (fromWord === undefined) return arabic
  const words = arabic.split(' ')
  if (fromWord <= 0 || fromWord >= words.length) throw new Error(`Word ${fromWord} is outside verse ${key}`)
  return words.slice(fromWord).join(' ')
}

const ARABIC_DIGITS = '٠١٢٣٤٥٦٧٨٩'

export function toArabicDigits(n: number): string {
  return String(n).replace(/\d/g, (d) => ARABIC_DIGITS[Number(d)])
}

/**
 * The KFGQPC/QuranEnc text writes the "open" (mutatābiʿ) tanween with the
 * code points its own font expects: U+0657 (open fathatan), U+0656 (open
 * kasratan) and U+065E (open dammatan). Standard Unicode — and the Amiri Quran
 * font we ship — use U+08F0–U+08F2 for these marks. This display-only mapping
 * draws the same marks correctly; the stored verified text is unchanged.
 */
const OPEN_TANWEEN: Record<string, string> = {
  'ٗ': 'ࣰ',
  'ٞ': 'ࣱ',
  'ٖ': 'ࣲ',
}

export function displayArabic(text: string): string {
  return text.replace(/[ٖٗٞ]/g, (c) => OPEN_TANWEEN[c])
}
