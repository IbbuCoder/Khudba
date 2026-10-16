import { describe, expect, it } from 'vitest'
import verified from './quran-verified.json'
import { displayArabic } from './quran'
import { RECITATIONS } from './recitations'
import { BLOCKS, SECTIONS, SECTION_START } from './script'

const verses = verified.verses as Record<string, { arabic: string; translation: string }>

/** Compare English by words only, so restored punctuation doesn't matter. */
const words = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

describe('Qur’an text', () => {
  it('contains the complete passages requested', () => {
    for (const key of ['2:155', '2:156', '2:157', '65:2', '65:3']) {
      expect(verses[key]?.arabic.length, key).toBeGreaterThan(10)
    }
  })

  it('uses only verified Arabic for every Qur’an segment', () => {
    for (const r of Object.values(RECITATIONS)) {
      for (const s of r.segments.filter((x) => x.kind === 'quran')) {
        const v = verses[s.verseKey!]
        expect(v, `${r.id} ${s.ref}`).toBeDefined()
        if (s.ayahMarker !== undefined) expect(s.arabic).toBe(v.arabic)
        else expect(v.arabic.endsWith(s.arabic), `${s.ref} must be a tail slice of the verse`).toBe(true)
      }
    }
  })

  it('uses the Saheeh International wording for every Qur’an translation', () => {
    for (const r of Object.values(RECITATIONS)) {
      for (const s of r.segments.filter((x) => x.kind === 'quran')) {
        const source = words(verses[s.verseKey!].translation)
        const shown = words(s.translation)
        if (s.ayahMarker !== undefined) expect(shown, s.ref).toBe(source)
        else expect(source.endsWith(shown), s.ref).toBe(true)
      }
    }
  })

  it('only remaps open-tanween code points for display', () => {
    for (const v of Object.values(verses)) {
      const shown = displayArabic(v.arabic)
      expect(shown.length).toBe(v.arabic.length)
      expect(shown).not.toMatch(/[\u0656\u0657\u065E]/)
      for (let i = 0; i < shown.length; i++) {
        if (shown[i] !== v.arabic[i]) expect('\u0656\u0657\u065E').toContain(v.arabic[i])
      }
    }
  })

  it('has diacritics on every Arabic segment', () => {
    const harakat = /[ً-ْٰۡ]/
    for (const r of Object.values(RECITATIONS)) {
      for (const s of r.segments) expect(harakat.test(s.arabic), `${r.id} ${s.ref}`).toBe(true)
    }
  })

  it('gives every segment a transliteration and translation', () => {
    for (const r of Object.values(RECITATIONS)) {
      expect(r.sources.length, r.id).toBeGreaterThan(0)
      for (const s of r.segments) {
        expect(s.transliteration.trim(), `${r.id} ${s.ref}`).not.toBe('')
        expect(s.translation.trim(), `${r.id} ${s.ref}`).not.toBe('')
      }
    }
  })
})

describe('Khutbah script', () => {
  it('never puts a bracketed stage direction in spoken text', () => {
    for (const b of BLOCKS) {
      if (b.type === 'para') expect(b.text, b.id).not.toMatch(/[[\]]/)
    }
  })

  it('has all five recitation screens, in delivery order', () => {
    const order = BLOCKS.flatMap((b) => (b.type === 'recite' ? [b.recitationId] : []))
    expect(order).toEqual(['opening', 'baqarah', 'talaq', 'second-praise', 'closing-dua'])
    for (const id of order) expect(RECITATIONS[id]).toBeDefined()
  })

  it('keeps every stage direction from the original script', () => {
    const count = (cue: string) => BLOCKS.filter((b) => b.type === 'cue' && b.cue === cue).length
    expect(count('pause')).toBe(7)
    expect(count('sit')).toBe(1)
    expect(count('stand')).toBe(1)
    expect(count('dua')).toBe(1)
    expect(count('end')).toBe(1)
  })

  it('follows each recitation with the block the speaker returns to', () => {
    BLOCKS.forEach((b, i) => {
      if (b.type === 'recite') expect(BLOCKS[i + 1], `after ${b.id}`).toBeDefined()
    })
  })

  it('has unique, stable block ids and valid section starts', () => {
    expect(new Set(BLOCKS.map((b) => b.id)).size).toBe(BLOCKS.length)
    expect(SECTION_START).toHaveLength(SECTIONS.length)
    SECTION_START.forEach((start, i) => expect(BLOCKS[start].sectionId).toBe(SECTIONS[i].id))
  })
})
