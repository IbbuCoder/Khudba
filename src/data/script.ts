/**
 * The khutbah, in delivery order.
 *
 * Every bracketed stage direction from the original script is represented as
 * a `cue` or `recite` block so it can never be mistaken for spoken text.
 * Spoken English is only ever in `para` blocks.
 */

export type CueKind = 'pause' | 'sit' | 'stand' | 'dua' | 'end' | 'note'

export type BlockInput =
  | { type: 'heading'; text: string }
  | { type: 'para'; text: string; dua?: boolean }
  | { type: 'cue'; cue: CueKind; text?: string }
  | { type: 'recite'; recitationId: string }

export interface SectionInput {
  id: string
  title: string
  part: 'First Khutbah' | 'Second Khutbah' | 'Closing Du‘a'
  blocks: BlockInput[]
}

export const KHUTBAH_TITLE = 'Everything Has a Reason — Trusting Allah’s Wisdom'

const PAUSE: BlockInput = { type: 'cue', cue: 'pause' }

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
      { type: 'para', text: 'My brothers and sisters,' },
      { type: 'para', text: 'Have you ever had something happen and thought, “Why is this happening to me?”' },
      {
        type: 'para',
        text: 'Maybe you lost something important. Maybe something you really wanted didn’t happen. Maybe you were going through a difficult time and couldn’t understand why Allah was allowing it to happen.',
      },
      {
        type: 'para',
        text: 'The truth is, we won’t always understand everything that happens to us. But the Qur’an teaches us something very important: tests are a part of life.',
      },
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
      {
        type: 'para',
        text: 'Allah tells us that we will be tested with things like fear, hunger, and loss. But notice what comes after the test. Allah praises those who are patient and gives them mercy and blessings.',
      },
      {
        type: 'para',
        text: 'So when something difficult happens, it doesn’t automatically mean Allah is punishing you. Sometimes, it’s a test. Sometimes, it’s an opportunity to become more patient. Sometimes, it brings us closer to Allah. And sometimes, we simply don’t know the reason right away.',
      },
      PAUSE,
    ],
  },
  {
    id: 'yusuf',
    title: 'The story of Prophet Yusuf',
    part: 'First Khutbah',
    blocks: [
      {
        type: 'para',
        text: 'Let’s look at the story of Prophet Yusuf, peace be upon him, which Allah tells us in the Qur’an.',
      },
      {
        type: 'para',
        text: 'When Yusuf was young, his own brothers became jealous of him. They threw him into a well, and he was separated from his family. Later, he was taken to Egypt, where he faced more difficulties. Eventually, he was imprisoned despite being innocent.',
      },
      {
        type: 'para',
        text: 'Imagine going through all of that: first, being separated from your family, then facing difficulties in a foreign land, and finally being imprisoned for something you did not do.',
      },
      { type: 'para', text: 'But his story did not end there.' },
      {
        type: 'para',
        text: 'By Allah’s will, Yusuf eventually became a person of authority in Egypt. Years later, he was reunited with his family.',
      },
      {
        type: 'para',
        text: 'My brothers and sisters, Yusuf could not see how his story would unfold while he was in the well or in prison. But Allah knew the entire story.',
      },
      {
        type: 'para',
        text: 'The lesson is not that every hardship will end with us becoming wealthy or powerful. The lesson is that we cannot see the whole picture while we are living through a difficult moment.',
      },
      {
        type: 'para',
        text: 'So when you face a difficulty, do not assume that your current situation is the end of your story. Stay patient, keep doing what is right, and continue trusting Allah.',
      },
      PAUSE,
    ],
  },
  {
    id: 'car',
    title: 'A personal story: the car crash',
    part: 'First Khutbah',
    blocks: [
      { type: 'para', text: 'Let me share a personal story with you to show how this can relate to our own lives.' },
      {
        type: 'para',
        text: 'A while ago, an old lady accidentally crashed into our family car, and the car was completely totaled. When it happened, my family and I were so sad and frustrated. It felt like an unexpected setback, and in that moment, we couldn’t understand why this had to happen to us.',
      },
      {
        type: 'para',
        text: 'But when the insurance company handled everything, they gave us enough money to buy the brand-new version of our old car, which was the exact upgraded model we had been wishing to get even before the crash happened.',
      },
      {
        type: 'para',
        text: 'In the moment of the crash, all we saw was loss, damage, and stress. We couldn’t see any good in it. But afterward, our situation turned out differently than we had expected.',
      },
      {
        type: 'para',
        text: 'Now, I’m not saying that every bad thing will lead to something better in this life, or that we can always know why something happened. But this experience reminded us that we don’t always see the full picture when something first goes wrong.',
      },
      {
        type: 'para',
        text: 'Sometimes, we understand more with time. Other times, we may never know the full wisdom behind what happened. Either way, we can continue to trust Allah.',
      },
      PAUSE,
    ],
  },
  {
    id: 'talaq',
    title: 'Qur’an: At-Talaq 65:2–3',
    part: 'First Khutbah',
    blocks: [
      { type: 'para', text: 'Being tested doesn’t mean being abandoned. Allah tells us in the Qur’an:' },
      { type: 'recite', recitationId: 'talaq' },
    ],
  },
  {
    id: 'way-out',
    title: 'Allah makes a way out',
    part: 'First Khutbah',
    blocks: [
      {
        type: 'para',
        text: 'Allah tells us that whoever is mindful of Him, He will make a way out for them and provide for them from where they do not expect.',
      },
      {
        type: 'para',
        text: 'Think about that. You might look at a situation and think, “I don’t see a way out.” But Allah knows what you cannot see.',
      },
      { type: 'para', text: 'You might think, “I don’t know what I’m supposed to do.” But Allah knows.' },
      {
        type: 'para',
        text: 'The Prophet Muhammad, peace and blessings be upon him, taught us that the believer can find good in both good times and difficult times. When something good happens, the believer gives thanks to Allah. When something difficult happens, the believer remains patient, and that patience can bring reward.',
      },
      {
        type: 'cue',
        cue: 'note',
        text: 'Hadith reference (Ṣaḥīḥ Muslim 2999, narrated by Ṣuhayb): “How wondrous is the affair of the believer, for all of his affairs are good — and that is for no one except the believer. If something pleasing happens to him, he is grateful, and that is good for him. If something harmful befalls him, he is patient, and that is good for him.”',
      },
      {
        type: 'para',
        text: 'So as believers, we can find goodness in both ease and hardship. When life goes well, we show gratitude. When life becomes difficult, we practice patience and continue turning to Allah.',
      },
      {
        type: 'para',
        text: 'That does not mean hardship is easy, but it means our response to hardship can become a source of reward.',
      },
      PAUSE,
    ],
  },
  {
    id: 'who-allah-is',
    title: 'Remember who Allah is',
    part: 'First Khutbah',
    blocks: [
      {
        type: 'para',
        text: 'We don’t always need to understand why something is happening to trust Allah. We just need to remember who Allah is. He knows what we don’t know. He sees what we can’t see. And He knows the beginning, the middle, and the end of our story.',
      },
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
    title: 'What we learned today',
    part: 'Second Khutbah',
    blocks: [
      { type: 'para', text: 'My brothers and sisters,' },
      { type: 'para', text: 'Let us remember what we learned today.' },
      {
        type: 'para',
        text: 'First: Life will have tests. We will face difficulties, sudden losses, and things we don’t understand at first.',
      },
      {
        type: 'para',
        text: 'Second: A difficult situation does not mean Allah has abandoned us. Allah promises that for those who are mindful of Him, He will make a way out and provide for them from where they do not expect.',
      },
      {
        type: 'para',
        text: 'Third: True sabr, or patience, doesn’t mean giving up or feeling helpless. Real sabr means keeping your heart attached to Allah while you continue taking action, making dua, and doing what is right.',
      },
    ],
  },
  {
    id: 'allah-knows',
    title: '“Allah knows what I don’t know”',
    part: 'Second Khutbah',
    blocks: [
      {
        type: 'para',
        text: 'The story of Prophet Yusuf teaches us that we cannot judge the entire story by one difficult chapter. And our own experiences remind us that life does not always unfold the way we expect.',
      },
      {
        type: 'para',
        text: 'So the next time something doesn’t go according to your plan, don’t immediately think, “Why me?”',
      },
      { type: 'para', text: 'Instead, remember: “Allah knows what I don’t know.”' },
      {
        type: 'para',
        text: 'Keep making dua. Keep doing what’s right. Be patient during the test. And trust Allah even when you can’t see the way forward.',
      },
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
      { type: 'para', dua: true, text: 'O Allah, give us patience during our tests.' },
      {
        type: 'para',
        dua: true,
        text: 'O Allah, make a way out for us from every difficulty and show us a way forward when we feel stuck.',
      },
      {
        type: 'para',
        dua: true,
        text: 'O Allah, forgive our sins, strengthen our faith, and guide us toward what is best for us.',
      },
      { type: 'para', dua: true, text: 'O Allah, help us remember You, thank You, and worship You in the best way.' },
      {
        type: 'para',
        dua: true,
        text: 'O Allah, help us trust You during times of difficulty and remember You during times of ease.',
      },
      { type: 'para', dua: true, text: 'O Allah, grant us what is good for us, even when we do not understand it.' },
      {
        type: 'para',
        dua: true,
        text: 'Our Lord, give us good in this world and good in the Hereafter, and protect us from the punishment of the Fire.',
      },
      { type: 'para', dua: true, text: 'Ameen.' },
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

export type Block = BlockInput & {
  id: string
  index: number
  sectionId: string
  sectionIndex: number
}

export const BLOCKS: Block[] = SECTIONS.flatMap((section, sectionIndex) =>
  section.blocks.map((b, i) => ({ ...b, id: `${section.id}-${i}`, sectionId: section.id, sectionIndex, index: 0 })),
).map((b, index) => ({ ...b, index }))

export const SECTION_START: number[] = SECTIONS.map((s) => BLOCKS.findIndex((b) => b.sectionId === s.id))
