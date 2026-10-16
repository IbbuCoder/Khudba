/**
 * The khutbah, in delivery order.
 *
 * Every bracketed stage direction from the original script is represented as
 * a `cue` or `recite` block so it can never be mistaken for spoken text.
 * Spoken English is only ever in `para` blocks.
 */

import { RECITATIONS } from './recitations'

export type CueKind = 'pause' | 'sit' | 'stand' | 'dua' | 'end'

export type BlockInput =
  | { type: 'heading'; text: string }
  | { type: 'para'; text: string; dua?: boolean }
  | { type: 'cue'; cue: CueKind }
  | { type: 'recite'; recitationId: string }

export interface SectionInput {
  id: string
  title: string
  part: 'First Khutbah' | 'Second Khutbah' | 'Closing Du‘a'
  blocks: BlockInput[]
}

export const KHUTBAH_TITLE = 'Everything Has a Reason — Trusting Allah’s Wisdom'

const PAUSE: BlockInput = { type: 'cue', cue: 'pause' }
const say = (text: string): BlockInput => ({ type: 'para', text })
const dua = (text: string): BlockInput => ({ type: 'para', text, dua: true })

export const SECTIONS: SectionInput[] = [
  {
    id: 'opening',
    title: 'Opening in Arabic',
    part: 'First Khutbah',
    blocks: [{ type: 'heading', text: 'First Khutbah' }, { type: 'recite', recitationId: 'opening' }, PAUSE],
  },
  {
    id: 'why-me',
    title: '“Why is this happening to me?”',
    part: 'First Khutbah',
    blocks: [
      say('My brothers and sisters,'),
      say('Have you ever been through something and asked, “Why is this happening to me?”'),
      say(
        'Maybe you lost something important. Maybe something you really wanted didn’t happen. Or maybe you went through a hard time and couldn’t understand why Allah allowed it.',
      ),
      say('We won’t always understand what happens to us. But the Qur’an tells us something important: tests are part of life.'),
    ],
  },
  {
    id: 'baqarah',
    title: 'Qur’an: Al-Baqarah 2:155–157',
    part: 'First Khutbah',
    blocks: [{ type: 'recite', recitationId: 'baqarah' }],
  },
  {
    id: 'tests',
    title: 'A test is not a punishment',
    part: 'First Khutbah',
    blocks: [
      say(
        'Allah tells us we will be tested with fear, hunger, and loss. But look at what follows: He praises those who are patient and promises them blessings and mercy.',
      ),
      say(
        'So a hardship is not a sign that Allah is punishing you. It may be a test. It may be a chance to grow in patience, or a way back to Allah. And sometimes we simply don’t know the reason yet.',
      ),
      PAUSE,
    ],
  },
  {
    id: 'yusuf',
    title: 'The story of Prophet Yusuf',
    part: 'First Khutbah',
    blocks: [
      say('Think of Prophet Yusuf, peace be upon him.'),
      say(
        'When he was young, his own brothers grew jealous of him and threw him into a well. He was taken to Egypt, far from his family, and faced more hardship there. Later he was put in prison, even though he was innocent.',
      ),
      say('Imagine living through all of that.'),
      say(
        'But his story didn’t end there. By Allah’s will, Yusuf became a man of authority in Egypt, and years later he was reunited with his family.',
      ),
      say('In the well, and in the prison, Yusuf couldn’t see how his story would end. But Allah could.'),
      say(
        'The lesson is not that every hardship ends in wealth or power. The lesson is that one hard chapter is not the whole story.',
      ),
      say('So when you face a difficulty, don’t treat it as the end. Stay patient, keep doing what is right, and hold on to Allah.'),
      PAUSE,
    ],
  },
  {
    id: 'car',
    title: 'A personal story: the car crash',
    part: 'First Khutbah',
    blocks: [
      say('Let me share something that happened to my own family.'),
      say(
        'Some time ago, an elderly lady accidentally crashed into our car, and it was completely totaled. We were upset and frustrated. It felt like a setback out of nowhere, and we couldn’t understand why it had happened to us.',
      ),
      say(
        'But the insurance company covered everything, and the payout was enough to buy the brand-new version of our old car — the exact upgraded model we had been hoping for, even before the crash.',
      ),
      say('On the day of the crash, all we could see was loss, damage, and stress. In the end, things turned out very differently than we expected.'),
      say(
        'I’m not saying every loss turns into something better in this life, or that we will always find out the reason. But it taught us that the first moment of a hardship rarely shows the full picture.',
      ),
      say('Sometimes the wisdom becomes clear later. Sometimes it never does. Either way, our trust in Allah doesn’t have to change.'),
      PAUSE,
    ],
  },
  {
    id: 'talaq',
    title: 'Qur’an: At-Talaq 65:2–3',
    part: 'First Khutbah',
    blocks: [say('And being tested never means being abandoned. Allah says:'), { type: 'recite', recitationId: 'talaq' }],
  },
  {
    id: 'way-out',
    title: 'Allah makes a way out',
    part: 'First Khutbah',
    blocks: [
      say('Think about that. You may look at your situation and say, “I don’t see a way out.” But Allah sees what you cannot.'),
      say('You may say, “I don’t know what to do.” But He knows.'),
      say(
        'The Prophet Muhammad, peace and blessings be upon him, said that the affair of the believer is amazing, because all of it is good. If something good happens, he is grateful, and that is good for him. If something hard happens, he is patient, and that is also good for him.',
      ),
      say(
        'So in ease, we give thanks. In hardship, we stay patient and turn to Allah. Hardship is never easy, but the way we respond to it can earn us reward.',
      ),
      PAUSE,
    ],
  },
  {
    id: 'who-allah-is',
    title: 'Remember who Allah is',
    part: 'First Khutbah',
    blocks: [
      say(
        'We don’t need to understand everything that happens in order to trust Allah. We only need to remember who He is. He knows what we don’t know. He sees what we can’t see. And He knows the beginning, the middle, and the end of our story.',
      ),
      PAUSE,
      { type: 'cue', cue: 'sit' },
    ],
  },
  {
    id: 'second-opening',
    title: 'Praise & salawat in Arabic',
    part: 'Second Khutbah',
    blocks: [
      { type: 'heading', text: 'Second Khutbah' },
      { type: 'cue', cue: 'stand' },
      { type: 'recite', recitationId: 'second-praise' },
    ],
  },
  {
    id: 'lessons',
    title: 'Three lessons to take home',
    part: 'Second Khutbah',
    blocks: [
      say('My brothers and sisters, let us take three lessons home with us today.'),
      say('First: tests are part of life. Losses and difficulties will come, often without warning.'),
      say('Second: hardship does not mean Allah has left us. He has promised a way out to those who are mindful of Him.'),
      say(
        'Third: true sabr is not giving up or feeling helpless. It is keeping your heart attached to Allah while you keep working, keep making du‘a, and keep doing what is right.',
      ),
    ],
  },
  {
    id: 'allah-knows',
    title: '“Allah knows what I don’t know”',
    part: 'Second Khutbah',
    blocks: [
      say('So the next time life doesn’t go according to plan, before you ask, “Why me?”, remind yourself: “Allah knows what I don’t know.”'),
      say('Be patient through the test, and trust Him even when you can’t see the way forward.'),
      PAUSE,
    ],
  },
  {
    id: 'dua',
    title: 'Closing du‘a (English)',
    part: 'Closing Du‘a',
    blocks: [
      { type: 'heading', text: 'Closing Du‘a' },
      { type: 'cue', cue: 'dua' },
      dua('O Allah, give us patience during our tests.'),
      dua('O Allah, make a way out for us from every difficulty, and show us a way forward when we feel stuck.'),
      dua('O Allah, forgive our sins, strengthen our faith, and guide us to what is best for us.'),
      dua('O Allah, help us remember You, thank You, and worship You in the best way.'),
      dua('O Allah, help us trust You in times of difficulty and remember You in times of ease.'),
      dua('O Allah, grant us what is good for us, even when we do not understand it.'),
      dua('Our Lord, give us good in this world and good in the Hereafter, and protect us from the punishment of the Fire.'),
      dua('Ameen.'),
    ],
  },
  {
    id: 'arabic-dua',
    title: 'Optional Arabic du‘a',
    part: 'Closing Du‘a',
    blocks: [{ type: 'recite', recitationId: 'closing-dua' }],
  },
  {
    id: 'end',
    title: 'End of khutbah',
    part: 'Closing Du‘a',
    blocks: [{ type: 'cue', cue: 'end' }],
  },
]

/** Script blocks after expansion: each recitation becomes its Arabic and, for
 * Qur'an passages read aloud, its English translation. */
export type FlatBlock =
  | Exclude<BlockInput, { type: 'recite' }>
  | { type: 'arabic'; recitationId: string }
  | { type: 'translation'; recitationId: string }

export type Block = FlatBlock & {
  id: string
  index: number
  sectionId: string
  sectionIndex: number
}

function expand(b: BlockInput, id: string): (FlatBlock & { id: string })[] {
  if (b.type !== 'recite') return [{ ...b, id }]
  const out: (FlatBlock & { id: string })[] = [{ type: 'arabic', recitationId: b.recitationId, id: `${id}-arabic` }]
  if (RECITATIONS[b.recitationId].readTranslationAloud) {
    out.push({ type: 'translation', recitationId: b.recitationId, id: `${id}-english` })
  }
  return out
}

export const BLOCKS: Block[] = SECTIONS.flatMap((section, sectionIndex) =>
  section.blocks.flatMap((b, i) =>
    expand(b, `${section.id}-${i}`).map((x) => ({ ...x, sectionId: section.id, sectionIndex, index: 0 })),
  ),
).map((b, index) => ({ ...b, index }))

export const SECTION_START: number[] = SECTIONS.map((s) => BLOCKS.findIndex((b) => b.sectionId === s.id))
