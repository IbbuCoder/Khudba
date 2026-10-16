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
    title: 'When life doesn’t make sense',
    part: 'First Khutbah',
    blocks: [
      say('My brothers and sisters,'),
      say(
        'All of us have had moments when life didn’t make sense. Something we wanted slipped away. Something we feared came true. And we asked, “Why is this happening to me?”',
      ),
      say('Allah answers that question in a few simple words:'),
      { type: 'recite', recitationId: 'dislike' },
    ],
  },
  {
    id: 'allah-knows',
    title: 'Allah knows, and we do not',
    part: 'First Khutbah',
    blocks: [
      say(
        'Think about how much is in that one verse. The thing that hurt us might be protecting us. The thing we chased might have harmed us. We see one moment. Allah sees everything.',
      ),
      say(
        'Maybe it was a job you didn’t get, a door that closed, or a plan that fell apart. In that moment it felt like loss. But how many of us have looked back years later and said, “Alhamdulillah that didn’t happen”?',
      ),
      say(
        'So when something hard happens, it isn’t a sign that Allah has forgotten you. It may be a test, a lesson, or a door to something better that you can’t see yet. And sometimes we simply won’t know the reason in this life.',
      ),
      PAUSE,
    ],
  },
  {
    id: 'yusuf',
    title: 'Prophet Yusuf: patience is never wasted',
    part: 'First Khutbah',
    blocks: [
      say('Look at the story of Prophet Yusuf, peace be upon him.'),
      say(
        'His brothers were jealous of him and threw him into a well. He was taken to Egypt, far from his family. Then he was sent to prison for something he did not do.',
      ),
      say(
        'His father, Prophet Yaqub, peace be upon him, lost his beloved son for years. Yet his answer, which Allah records in the Qur’an, was: “So patience is most fitting.”',
      ),
      say(
        'At every step, it looked like loss. But by Allah’s will, Yusuf rose to a position of authority in Egypt, and one day his brothers came and stood in front of him, needing his help.',
      ),
      say('When they finally recognised him, Yusuf didn’t talk about his pain. He said:'),
      { type: 'recite', recitationId: 'yusuf-words' },
      say('A well, slavery, years in prison, and that was his conclusion: with Allah, patience is never wasted.'),
      PAUSE,
    ],
  },
  {
    id: 'car',
    title: 'A personal story',
    part: 'First Khutbah',
    blocks: [
      say('Let me share something from my own family.'),
      say(
        'Some time ago, an elderly lady accidentally crashed into our car, and it was completely totaled. We were upset and frustrated, and we couldn’t understand why it had happened to us.',
      ),
      say(
        'But the insurance company covered everything, and the money was enough to buy the brand-new version of our old car — the exact upgraded model we had been hoping for, even before the crash.',
      ),
      say('On the day of the crash, all we saw was loss. Later, we saw something we never expected.'),
      say(
        'I’m not saying every loss turns into a gain in this life. Sometimes we never learn the reason. But that day reminded us that we only ever see a small part of the picture.',
      ),
      PAUSE,
    ],
  },
  {
    id: 'ease',
    title: 'With hardship comes ease',
    part: 'First Khutbah',
    blocks: [
      say('And Allah gives us a promise that every one of us can hold on to:'),
      { type: 'recite', recitationId: 'ease' },
      say('Allah says it twice, so that we never doubt it. And notice the word “with”: the ease comes with the hardship, not only after it.'),
      say(
        'The Prophet Muhammad, peace and blessings be upon him, said that the affair of the believer is amazing, because all of it is good. If something good happens, he is grateful, and that is good for him. If something hard happens, he is patient, and that is also good for him.',
      ),
      say('So in good times, we say alhamdulillah. In hard times, we stay patient. Either way, the believer comes out ahead.'),
      PAUSE,
    ],
  },
  {
    id: 'trust',
    title: 'Trust the One who knows',
    part: 'First Khutbah',
    blocks: [
      say(
        'My brothers and sisters, we don’t need to understand everything in order to trust Allah. We only need to remember who He is. He knows what we don’t know. He sees what we can’t see. And He knows how our story ends.',
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
    id: 'reminders',
    title: 'Three things to remember',
    part: 'Second Khutbah',
    blocks: [
      say('My brothers and sisters, let us take three simple reminders home with us today.'),
      say('One: what you dislike may be good for you. Allah knows, and we do not.'),
      say('Two: patience is never wasted. Allah does not let the reward of those who do good be lost. And He is with you while you are patient:'),
      { type: 'recite', recitationId: 'patient' },
      say('Three: with hardship comes ease. Allah promised it twice.'),
      say(
        'And when a hardship comes, here is what we can do: say “inna lillahi wa inna ilayhi raji‘un,” turn to Allah in du‘a, keep doing what is right, and be patient. That is what Allah asks of us. The outcome is in His hands.',
      ),
      say(
        'So the next time life doesn’t go according to plan, before you ask, “Why me?”, remind yourself: “Allah knows what I don’t know.”',
      ),
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
