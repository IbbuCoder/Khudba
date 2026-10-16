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
      say('Have you ever had something happen to you and thought, “Why is this happening to me?”'),
      say(
        'Maybe you lost something important. Maybe something you really wanted didn’t happen. Or maybe you went through a hard time and couldn’t understand why Allah let it happen.',
      ),
      say(
        'The truth is, we won’t always understand what happens to us. But the Qur’an teaches us something very important: tests are part of life.',
      ),
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
        'In these verses, Allah tells us that we will be tested with fear, hunger, and loss. But look at what comes after the test: Allah praises those who are patient, and He gives them blessings and mercy.',
      ),
      say(
        'So when something hard happens, it doesn’t mean Allah is punishing you. Sometimes it’s a test. Sometimes it’s a chance to grow in patience. Sometimes it brings us closer to Allah. And sometimes we just don’t know the reason yet.',
      ),
      PAUSE,
    ],
  },
  {
    id: 'yusuf',
    title: 'The story of Prophet Yusuf',
    part: 'First Khutbah',
    blocks: [
      say('Think about the story of Prophet Yusuf, peace be upon him, which Allah tells us in the Qur’an.'),
      say(
        'When Yusuf was young, his own brothers became jealous of him. They threw him into a well, and he was taken away from his family. He was brought to Egypt, where he faced more hardship. Then he was put in prison, even though he was innocent.',
      ),
      say(
        'Imagine going through all of that: losing your family, struggling in a strange land, and being punished for something you didn’t do.',
      ),
      say('But his story didn’t end there.'),
      say('By Allah’s will, Yusuf later became a man of authority in Egypt. Years later, he was reunited with his family.'),
      say(
        'While Yusuf was in the well, and while he was in prison, he couldn’t see how his story would end. But Allah knew the whole story.',
      ),
      say(
        'The lesson is not that every hardship ends with wealth or power. The lesson is that we can’t see the whole picture while we’re going through a hard moment.',
      ),
      say(
        'So when you face a difficulty, don’t think that this moment is the end of your story. Stay patient, keep doing what is right, and keep trusting Allah.',
      ),
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
        'Some time ago, an elderly lady accidentally crashed into our family car, and the car was completely totaled. My family and I were sad and frustrated. It felt like a setback we didn’t expect, and we couldn’t understand why it had happened to us.',
      ),
      say(
        'But the insurance company took care of everything. They gave us enough money to buy the brand-new version of our old car — the exact upgraded model we had been hoping to get, even before the crash.',
      ),
      say(
        'When the crash happened, all we could see was loss, damage, and stress. We couldn’t see anything good in it. But in the end, things turned out differently than we expected.',
      ),
      say(
        'Now, I’m not saying that every bad thing will turn into something better in this life, or that we will always know why something happened. But this taught us that we don’t see the full picture when something first goes wrong.',
      ),
      say('Sometimes we understand later. Sometimes we never find out the full reason. Either way, we can keep trusting Allah.'),
      PAUSE,
    ],
  },
  {
    id: 'talaq',
    title: 'Qur’an: At-Talaq 65:2–3',
    part: 'First Khutbah',
    blocks: [say('Being tested doesn’t mean Allah has left us. Allah says in the Qur’an:'), { type: 'recite', recitationId: 'talaq' }],
  },
  {
    id: 'way-out',
    title: 'Allah makes a way out',
    part: 'First Khutbah',
    blocks: [
      say(
        'Allah promises that whoever is mindful of Him, He will make a way out for them, and He will provide for them from where they do not expect.',
      ),
      say('Think about that. You may look at your situation and say, “I don’t see a way out.” But Allah sees what you cannot see.'),
      say('You may say, “I don’t know what to do.” But Allah knows.'),
      say(
        'The Prophet Muhammad, peace and blessings be upon him, taught us that a believer can find good in every situation. When something good happens, the believer is grateful, and that is good for him. When something hard happens, the believer is patient, and that is also good for him.',
      ),
      say('So in good times, we show gratitude. In hard times, we stay patient and keep turning to Allah.'),
      say('This doesn’t mean hardship is easy. It means the way we respond to hardship can earn us reward.'),
      PAUSE,
    ],
  },
  {
    id: 'who-allah-is',
    title: 'Remember who Allah is',
    part: 'First Khutbah',
    blocks: [
      say(
        'We don’t need to understand why something is happening in order to trust Allah. We only need to remember who Allah is. He knows what we don’t know. He sees what we can’t see. And He knows the beginning, the middle, and the end of our story.',
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
    title: 'Three lessons from today',
    part: 'Second Khutbah',
    blocks: [
      say('My brothers and sisters,'),
      say('Let us remember three lessons from today.'),
      say('First: life will have tests. We will face hardships, sudden losses, and things we don’t understand at first.'),
      say(
        'Second: a hard situation doesn’t mean Allah has left us. Allah promises that whoever is mindful of Him, He will make a way out for them and provide for them from where they do not expect.',
      ),
      say(
        'Third: true sabr, or patience, is not giving up or feeling helpless. Real sabr is keeping your heart connected to Allah while you keep working, keep making du‘a, and keep doing what is right.',
      ),
    ],
  },
  {
    id: 'allah-knows',
    title: '“Allah knows what I don’t know”',
    part: 'Second Khutbah',
    blocks: [
      say(
        'The story of Prophet Yusuf teaches us not to judge the whole story by one hard chapter. And our own lives remind us that things don’t always go the way we expect.',
      ),
      say('So the next time something doesn’t go according to your plan, don’t rush to say, “Why me?”'),
      say('Instead, remember: “Allah knows what I don’t know.”'),
      say('Keep making du‘a. Keep doing what is right. Be patient through the test. And trust Allah, even when you can’t see the way forward.'),
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
