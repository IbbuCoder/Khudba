import { getVerse, verifiedArabic } from './quran'
import { indopakRuns, type Run } from './indopak'

export type SegmentKind = 'quran' | 'hadith'

export interface Segment {
  kind: SegmentKind
  /** Short reference shown beside the text, e.g. "2:155" or "Ṣaḥīḥ al-Bukhārī 3370". */
  ref: string
  /** For Qur'an segments: the verse key in quran-verified.json, e.g. "2:155". */
  verseKey?: string
  /** For Qur'an segments: the ayah number shown in the end-of-ayah marker (omitted for partial verses). */
  ayahMarker?: number
  arabic: string
  /** For Qur'an segments: the Indo-Pak script text, split into tajweed colour runs. */
  indopak?: Run[]
  transliteration: string
  translation: string
}

export interface Recitation {
  id: string
  /** Big label on the card and the recitation screen. */
  title: string
  optional?: boolean
  /** Qur'an passages: the script says to read the English translation aloud. */
  readTranslationAloud: boolean
  segments: Segment[]
  sources: string[]
}

const SAHEEH = 'English translation of the Qur’an: Saheeh International (via tanzil.net).'
const INDOPAK =
  'Indo-Pak script: Quran.com text (text_indopak), checked to have exactly the same letters as the verified KFGQPC text. Tajweed colours: Quran.com tajweed rules. Font: Al Qalam “Al QuranWBW”.'
const KFGQPC =
  'Qur’an Arabic: Uthmani script of the King Fahd Glorious Qur’an Printing Complex (Ḥafṣ ʿan ʿĀṣim), via The Noble Qur’an Encyclopedia (quranenc.com), cross-checked letter-by-letter against the Tanzil Uthmani text.'

interface QuranOptions {
  /** Start the Arabic at this 0-based word of the verse (partial verse). */
  fromWord?: number
  /** The same starting word in the Indo-Pak text, where pause marks count as words. */
  indopakFromWord?: number
  /** Display ayah marker; defaults to true for whole verses. */
  marker?: boolean
}

/**
 * A Qur'an segment. The Arabic comes only from the verified data file; the
 * English is the Saheeh International rendering (with its final punctuation
 * restored) and is checked against the verified text by the test suite.
 */
function quran(key: string, transliteration: string, translation: string, opts: QuranOptions = {}): Segment {
  const verse = getVerse(key)
  const whole = opts.fromWord === undefined
  return {
    kind: 'quran',
    ref: whole ? `${verse.surahName} ${key}` : `${verse.surahName} ${key} (part)`,
    verseKey: key,
    ayahMarker: whole && opts.marker !== false ? verse.ayah : undefined,
    arabic: verifiedArabic(key, opts.fromWord),
    indopak: indopakRuns(key, opts.indopakFromWord),
    transliteration,
    translation,
  }
}

export const RECITATIONS: Record<string, Recitation> = {
  opening: {
    id: 'opening',
    title: 'Khutbah Opening',
    readTranslationAloud: false,
    segments: [
      {
        kind: 'hadith',
        ref: 'Khutbah opening',
        arabic:
          'اَلْحَمْدُ لِلّٰهِ نَحْمَدُهٗ وَنَسْتَعِيْنُهٗ وَنَسْتَغْفِرُهٗ وَنُؤْمِنُ بِهٖ وَنَتَوَكَّلُ عَلَيْهِ، وَنَعُوْذُ بِاللّٰهِ مِنْ شُرُوْرِ اَنْفُسِنَا وَمِنْ سَيِّئَاتِ اَعْمَالِنَا، مَنْ يَّهْدِهِ اللّٰهُ فَلَا مُضِلَّ لَهٗ، وَمَنْ يُّضْلِلْهُ فَلَا هَادِيَ لَهٗ، وَنَشْهَدُ اَنْ لَّا اِلٰهَ اِلَّا اللّٰهُ وَحْدَهٗ لَا شَرِيْكَ لَهٗ، وَنَشْهَدُ اَنَّ مُحَمَّدًا عَبْدُهٗ وَرَسُوْلُهٗ',
        transliteration:
          'Al-hamdu lillaahi nahmaduhu wa nasta‘eenuhu wa nastaghfiruhu wa nu’minu bihee wa natawakkalu ‘alayh. Wa na‘oodhu billaahi min shuroori anfusinaa wa min sayyi’aati a‘maalinaa. Man yahdihil-laahu falaa mudilla lah, wa man yudlilhu falaa haadiya lah. Wa nashhadu al-laa ilaaha illallaahu wahdahu laa shareeka lah, wa nashhadu anna Muhammadan ‘abduhu wa rasooluh.',
        translation:
          'All praise belongs to Allah. We praise Him, seek His help and ask His forgiveness; we believe in Him and put our trust in Him. We seek refuge in Allah from the evils of our souls and from our bad deeds. Whomever Allah guides, no one can lead astray, and whomever He leaves astray, no one can guide. We bear witness that there is no god but Allah alone, with no partner, and we bear witness that Muhammad is His servant and Messenger.',
      },
    ],
    sources: [
      'Khutbah opening: the wording supplied by the khateeb, a common Indo-Pak form of Khuṭbat al-Ḥājah. Its core is reported in Sunan Abī Dāwūd 2118, Sunan al-Nasāʾī 3278 and Ṣaḥīḥ Muslim 868; “wa nuʾminu bihi wa natawakkalu ʿalayh” is a customary addition.',
    ],
  },

  dislike: {
    id: 'dislike',
    title: 'Surah Al-Baqarah 2:216',
    readTranslationAloud: true,
    segments: [
      quran(
        '2:216',
        'Wa ‘asaa an takrahoo shay’aw-wa huwa khayrul-lakum, wa ‘asaa an tuhibboo shay’aw-wa huwa sharrul-lakum. Wallaahu ya‘lamu wa antum laa ta‘lamoon.',
        'Perhaps you hate a thing and it is good for you; and perhaps you love a thing and it is bad for you. And Allah knows, while you know not.',
        { fromWord: 6, indopakFromWord: 6 },
      ),
    ],
    sources: [
      'Al-Baqarah 2:216 is shown from “وَعَسَىٰٓ” (“And perhaps”), the general lesson at the end of the verse.',
      KFGQPC,
      INDOPAK,
      SAHEEH,
    ],
  },

  'yusuf-words': {
    id: 'yusuf-words',
    title: 'Surah Yusuf 12:90',
    readTranslationAloud: true,
    segments: [
      quran(
        '12:90',
        'Innahu may-yattaqi wa yasbir fa innal-laaha laa yudee‘u ajral-muhsineen.',
        'Indeed, he who fears Allah and is patient, then indeed, Allah does not allow to be lost the reward of those who do good.',
        { fromWord: 13, indopakFromWord: 13 },
      ),
    ],
    sources: [
      'Yusuf 12:90 is shown from “إِنَّهُۥ” (“Indeed”), Prophet Yusuf’s words to his brothers when they recognised him.',
      KFGQPC,
      INDOPAK,
      SAHEEH,
    ],
  },

  ease: {
    id: 'ease',
    title: 'Surah Ash-Sharh 94:5–6',
    readTranslationAloud: true,
    segments: [
      quran('94:5', 'Fa inna ma‘al-‘usri yusraa.', 'For indeed, with hardship [will be] ease.'),
      quran('94:6', 'Inna ma‘al-‘usri yusraa.', 'Indeed, with hardship [will be] ease.'),
    ],
    sources: [KFGQPC, INDOPAK, SAHEEH],
  },

  patient: {
    id: 'patient',
    title: 'Surah Al-Baqarah 2:153',
    readTranslationAloud: true,
    segments: [
      quran('2:153', 'Innal-laaha ma‘as-saabireen.', 'Indeed, Allah is with the patient.', {
        fromWord: 6,
        indopakFromWord: 6,
      }),
    ],
    sources: ['Al-Baqarah 2:153 is shown from “إِنَّ ٱللَّهَ” (“Indeed, Allah”), the end of the verse.', KFGQPC, INDOPAK, SAHEEH],
  },

  'second-praise': {
    id: 'second-praise',
    title: 'Praise of Allah & Salawat',
    readTranslationAloud: false,
    segments: [
      quran('1:2', 'Al-hamdu lillaahi rabbil-‘aalameen.', '[All] praise is [due] to Allah, Lord of the worlds.'),
      {
        kind: 'hadith',
        ref: 'Ṣaḥīḥ al-Bukhārī 3370',
        arabic:
          'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ',
        transliteration:
          'Allaahumma salli ‘alaa Muhammadiw-wa ‘alaa aali Muhammad, kamaa sallayta ‘alaa Ibraaheema wa ‘alaa aali Ibraaheem, innaka Hameedum-Majeed.',
        translation:
          'O Allah, send Your prayers upon Muhammad and upon the family of Muhammad, as You sent Your prayers upon Ibrahim and upon the family of Ibrahim; indeed, You are Praiseworthy, Glorious.',
      },
    ],
    sources: [
      'Salawat: the first part of al-ṣalāh al-Ibrāhīmiyyah, narrated by Kaʿb ibn ʿUjrah — Ṣaḥīḥ al-Bukhārī 3370 (also 6357) and Ṣaḥīḥ Muslim 406. Shortened for an 8-minute khutbah; praise of Allah and salawat are both included.',
      KFGQPC,
      INDOPAK,
      SAHEEH,
    ],
  },

  'closing-dua': {
    id: 'closing-dua',
    title: 'Arabic Closing Du‘a',
    optional: true,
    readTranslationAloud: false,
    segments: [
      quran(
        '2:201',
        'Rabbanaa aatinaa fid-dunyaa hasanataw-wa fil-aakhirati hasanataw-wa qinaa ‘adhaaban-naar.',
        'Our Lord, give us in this world [that which is] good and in the Hereafter [that which is] good and protect us from the punishment of the Fire.',
        { fromWord: 3, indopakFromWord: 3 },
      ),
    ],
    sources: [
      'Al-Baqarah 2:201 is shown from the word “رَبَّنَآ” (“Our Lord”), the du‘a part of the verse. It is the same du‘a as the last line of your English du‘a.',
      KFGQPC,
      INDOPAK,
      SAHEEH,
    ],
  },
}
