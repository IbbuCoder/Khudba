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

  baqarah: {
    id: 'baqarah',
    title: 'Surah Al-Baqarah 2:155–157',
    readTranslationAloud: true,
    segments: [
      quran(
        '2:155',
        'Wa lanabluwannakum bishay’im-minal-khawfi wal-joo‘i wa naqsim-minal-amwaali wal-anfusi wath-thamaraat. Wa bashshiris-saabireen.',
        'And We will surely test you with something of fear and hunger and a loss of wealth and lives and fruits, but give good tidings to the patient,',
      ),
      quran(
        '2:156',
        'Alladheena idhaa asaabat-hum museebatun qaaloo innaa lillaahi wa innaa ilayhi raaji‘oon.',
        'Who, when disaster strikes them, say, “Indeed we belong to Allah, and indeed to Him we will return.”',
      ),
      quran(
        '2:157',
        'Ulaa’ika ‘alayhim salawaatum-mir-rabbihim wa rahmah. Wa ulaa’ika humul-muhtadoon.',
        'Those are the ones upon whom are blessings from their Lord and mercy. And it is those who are the [rightly] guided.',
      ),
    ],
    sources: [KFGQPC, INDOPAK, SAHEEH],
  },

  talaq: {
    id: 'talaq',
    title: 'Surah At-Talaq 65:2–3',
    readTranslationAloud: true,
    segments: [
      quran(
        '65:2',
        'Wa may-yattaqil-laaha yaj‘al lahu makhrajaa,',
        'And whoever fears Allah - He will make for him a way out',
        { fromWord: 24, indopakFromWord: 26 },
      ),
      quran(
        '65:3',
        'Wa yarzuqhu min haythu laa yahtasib. Wa may-yatawakkal ‘alal-laahi fahuwa hasbuh. Innal-laaha baalighu amrih. Qad ja‘alal-laahu likulli shay’in qadraa.',
        'And will provide for him from where he does not expect. And whoever relies upon Allah - then He is sufficient for him. Indeed, Allah will accomplish His purpose. Allah has already set for everything a [decreed] extent.',
      ),
    ],
    sources: [
      KFGQPC,
      INDOPAK,
      SAHEEH,
      'At-Talaq 65:2 is shown from “وَمَن يَتَّقِ ٱللَّهَ” (“And whoever fears Allah”), the sentence that continues into 65:3. The start of the verse is about divorce rulings and is not needed for this khutbah.',
    ],
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
