import { RECITATIONS } from './recitations'
import { BLOCKS, SECTIONS, type Block } from './script'

/** Calm khutbah pace for English, and a slower pace for Arabic recitation. */
export const ENGLISH_WPM = 130
export const ARABIC_WPM = 60

export const TARGET_MINUTES = 10

const words = (s: string) => s.trim().split(/\s+/).filter(Boolean).length

const CUE_SECONDS = { pause: 2, sit: 20, stand: 3, dua: 0, end: 0 } as const

/** Estimated seconds to deliver one block of the script. */
export function blockSeconds(b: Block): number {
  switch (b.type) {
    case 'para':
      return (words(b.text) / ENGLISH_WPM) * 60
    case 'cue':
      return CUE_SECONDS[b.cue]
    case 'arabic': {
      const r = RECITATIONS[b.recitationId]
      return (words(r.segments.map((s) => s.arabic).join(' ')) / ARABIC_WPM) * 60
    }
    case 'translation': {
      const r = RECITATIONS[b.recitationId]
      return (words(r.segments.map((s) => s.translation).join(' ')) / ENGLISH_WPM) * 60
    }
    default:
      return 0
  }
}

export const BLOCK_SECONDS = BLOCKS.map(blockSeconds)
export const TOTAL_SECONDS = BLOCK_SECONDS.reduce((a, b) => a + b, 0)
export const SECTION_SECONDS = SECTIONS.map((s) =>
  BLOCKS.reduce((sum, b, i) => (b.sectionId === s.id ? sum + BLOCK_SECONDS[i] : sum), 0),
)

/** Estimated seconds left from the start of block `index` to the end. */
export const secondsLeftFrom = (index: number) => BLOCK_SECONDS.slice(index).reduce((a, b) => a + b, 0)

export function formatClock(totalSeconds: number) {
  const s = Math.max(0, Math.round(totalSeconds))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

export const formatMinutes = (seconds: number) => (seconds < 45 ? '<1 min' : `${Math.round(seconds / 60)} min`)
