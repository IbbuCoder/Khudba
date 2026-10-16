import { getVerse, verifiedArabic } from './quran'

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
  transliteration: string
  translation: string
}

export interface Recitation {
  id: string
  /** Big label on the card and the recitation screen. */
  title: string
  subtitle: string
  optional?: boolean
  /** Qur'an passages: the script says to read the English translation aloud. */
  readTranslationAloud: boolean
  /** One-line instruction shown before the Arabic. */
  instruction: string
  segments: Segment[]
  sources: string[]
}

const SAHEEH = 'English translation of the Qur’an: Saheeh International (via tanzil.net).'
const KFGQPC =
  'Qur’an Arabic: Uthmani script of the King Fahd Glorious Qur’an Printing Complex (Ḥafṣ ʿan ʿĀṣim), via The Noble Qur’an Encyclopedia (quranenc.com), cross-checked letter-by-letter against the Tanzil Uthmani text.'

interface QuranOptions {
  /** Start the Arabic at this 0-based word of the verse (partial verse). */
  fromWord?: number
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
    transliteration,
    translation,
  }
}

export const RECITATIONS: Record<string, Recitation> = {
  opening: {
    id: 'opening',
    title: 'Khutbah Opening',
    subtitle: 'Khuṭbat al-Ḥājah — opening of the first khutbah',
    readTranslationAloud: false,
    instruction: 'Recite the Arabic opening. The English meaning below is for your reference only.',
    segments: [
      {
        kind: 'hadith',
        ref: 'Khuṭbat al-Ḥājah',
        arabic:
          'إِنَّ الْحَمْدَ لِلَّهِ، نَحْمَدُهُ وَنَسْتَعِينُهُ وَنَسْتَغْفِرُهُ، وَنَعُوذُ بِاللَّهِ مِنْ شُرُورِ أَنْفُسِنَا وَمِنْ سَيِّئَاتِ أَعْمَالِنَا، مَنْ يَهْدِهِ اللَّهُ فَلَا مُضِلَّ لَهُ، وَمَنْ يُضْلِلْ فَلَا هَادِيَ لَهُ، وَأَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ',
        transliteration:
          'Innal-hamda lillaah, nahmaduhu wa nasta‘eenuhu wa nastaghfiruh, wa na‘oodhu billaahi min shuroori anfusinaa wa min sayyi’aati a‘maalinaa. Man yahdihil-laahu falaa mudilla lah, wa man yudlil falaa haadiya lah. Wa ashhadu al-laa ilaaha illallaahu wahdahu laa shareeka lah, wa ashhadu anna Muhammadan ‘abduhu wa rasooluh.',
        translation:
          'Indeed, all praise belongs to Allah. We praise Him, we seek His help, and we ask His forgiveness. We seek refuge in Allah from the evils of our own souls and from our bad deeds. Whomever Allah guides, no one can lead astray, and whomever He leaves astray, no one can guide. I bear witness that there is no god but Allah alone, with no partner, and I bear witness that Muhammad is His servant and Messenger.',
      },
      quran(
        '3:102',
        'Yaa ayyuhal-ladheena aamanut-taqul-laaha haqqa tuqaatihee wa laa tamootunna illaa wa antum muslimoon.',
        'O you who have believed, fear Allah as He should be feared and do not die except as Muslims [in submission to Him].',
      ),
      quran(
        '4:1',
        'Yaa ayyuhan-naasut-taqoo rabbakumul-ladhee khalaqakum min nafsiw-waahidatiw-wa khalaqa minhaa zawjahaa wa baththa minhumaa rijaalan katheeraw-wa nisaa’aa. Wat-taqul-laahal-ladhee tasaa’aloona bihee wal-arhaam. Innal-laaha kaana ‘alaykum raqeebaa.',
        'O mankind, fear your Lord, who created you from one soul and created from it its mate and dispersed from both of them many men and women. And fear Allah, through whom you ask one another, and the wombs. Indeed Allah is ever, over you, an Observer.',
      ),
      quran(
        '33:70',
        'Yaa ayyuhal-ladheena aamanut-taqul-laaha wa qooloo qawlan sadeedaa.',
        'O you who have believed, fear Allah and speak words of appropriate justice.',
      ),
      quran(
        '33:71',
        'Yuslih lakum a‘maalakum wa yaghfir lakum dhunoobakum. Wa may-yuti‘il-laaha wa rasoolahu faqad faaza fawzan ‘azeemaa.',
        'He will [then] amend for you your deeds and forgive you your sins. And whoever obeys Allah and His Messenger has certainly attained a great attainment.',
      ),
      {
        kind: 'hadith',
        ref: 'Transition',
        arabic: 'أَمَّا بَعْدُ',
        transliteration: 'Ammaa ba‘d.',
        translation: 'As for what follows…',
      },
    ],
    sources: [
      'Khuṭbat al-Ḥājah: narrated by ʿAbdullāh ibn Masʿūd — Sunan Abī Dāwūd 2118, Sunan al-Nasāʾī 3278 (graded ṣaḥīḥ by al-Albānī). The wording shown is the commonly recited form compiled by al-Albānī; some narrations are slightly shorter. English rendering of the opening is a plain-meaning translation.',
      'Qur’an verses recited with it in the narration: Āl ʿImrān 3:102, An-Nisāʾ 4:1, Al-Aḥzāb 33:70–71.',
      KFGQPC,
      SAHEEH,
    ],
  },

  baqarah: {
    id: 'baqarah',
    title: 'Surah Al-Baqarah 2:155–157',
    subtitle: 'Tests are part of life — glad tidings for the patient',
    readTranslationAloud: true,
    instruction: 'Recite the Arabic, then read the English translation aloud.',
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
    sources: [KFGQPC, SAHEEH],
  },

  talaq: {
    id: 'talaq',
    title: 'Surah At-Talaq 65:2–3',
    subtitle: 'Whoever is mindful of Allah — He will make a way out',
    readTranslationAloud: true,
    instruction: 'Recite the Arabic, then read the English translation aloud.',
    segments: [
      quran(
        '65:2',
        'Fa idhaa balaghna ajalahunna fa amsikoohunna bima‘roofin aw faariqoohunna bima‘roofiw-wa ashhidoo dhaway ‘adlim-minkum wa aqeemush-shahaadata lillaah. Dhaalikum yoo‘azu bihee man kaana yu’minu billaahi wal-yawmil-aakhir. Wa may-yattaqil-laaha yaj‘al lahu makhrajaa.',
        'And when they have [nearly] fulfilled their term, either retain them according to acceptable terms or part with them according to acceptable terms. And bring to witness two just men from among you and establish the testimony for [the acceptance of] Allah. That is instructed to whoever should believe in Allah and the Last day. And whoever fears Allah - He will make for him a way out',
      ),
      quran(
        '65:3',
        'Wa yarzuqhu min haythu laa yahtasib. Wa may-yatawakkal ‘alal-laahi fahuwa hasbuh. Innal-laaha baalighu amrih. Qad ja‘alal-laahu likulli shay’in qadraa.',
        'And will provide for him from where he does not expect. And whoever relies upon Allah - then He is sufficient for him. Indeed, Allah will accomplish His purpose. Allah has already set for everything a [decreed] extent.',
      ),
    ],
    sources: [
      KFGQPC,
      SAHEEH,
      'Note: 65:2 opens with rulings on divorce; the khutbah’s point is its closing sentence, “And whoever fears Allah – He will make for him a way out,” which continues into 65:3.',
    ],
  },

  'second-praise': {
    id: 'second-praise',
    title: 'Praise of Allah & Salawat',
    subtitle: 'Opening of the second khutbah',
    readTranslationAloud: false,
    instruction: 'Recite the Arabic praise and salawat. The English meaning below is for your reference only.',
    segments: [
      quran('1:2', 'Al-hamdu lillaahi rabbil-‘aalameen.', '[All] praise is [due] to Allah, Lord of the worlds.'),
      quran(
        '33:56',
        'Innal-laaha wa malaa’ikatahu yusalloona ‘alan-nabiyy. Yaa ayyuhal-ladheena aamanoo salloo ‘alayhi wa sallimoo tasleemaa.',
        'Indeed, Allah confers blessing upon the Prophet, and His angels [ask Him to do so]. O you who have believed, ask [Allah to confer] blessing upon him and ask [Allah to grant him] peace.',
      ),
      {
        kind: 'hadith',
        ref: 'Ṣaḥīḥ al-Bukhārī 3370',
        arabic:
          'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ، اللَّهُمَّ بَارِكْ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ',
        transliteration:
          'Allaahumma salli ‘alaa Muhammadiw-wa ‘alaa aali Muhammad, kamaa sallayta ‘alaa Ibraaheema wa ‘alaa aali Ibraaheem, innaka Hameedum-Majeed. Allaahumma baarik ‘alaa Muhammadiw-wa ‘alaa aali Muhammad, kamaa baarakta ‘alaa Ibraaheema wa ‘alaa aali Ibraaheem, innaka Hameedum-Majeed.',
        translation:
          'O Allah, send Your prayers upon Muhammad and upon the family of Muhammad, as You sent Your prayers upon Ibrahim and upon the family of Ibrahim; indeed, You are Praiseworthy, Glorious. O Allah, send Your blessings upon Muhammad and upon the family of Muhammad, as You sent Your blessings upon Ibrahim and upon the family of Ibrahim; indeed, You are Praiseworthy, Glorious.',
      },
    ],
    sources: [
      'Al-ṣalāh al-Ibrāhīmiyyah: narrated by Kaʿb ibn ʿUjrah — Ṣaḥīḥ al-Bukhārī 3370 (also 6357) and Ṣaḥīḥ Muslim 406. English rendering of the salawat is a plain-meaning translation.',
      KFGQPC,
      SAHEEH,
    ],
  },

  'closing-dua': {
    id: 'closing-dua',
    title: 'Arabic Closing Du‘a',
    subtitle: 'Optional — Qur’anic du‘as',
    optional: true,
    readTranslationAloud: false,
    instruction: 'Optional. Recite any of these Qur’anic du‘as in Arabic, or skip this page.',
    segments: [
      quran(
        '7:126',
        'Rabbanaa afrigh ‘alaynaa sabraw-wa tawaffanaa muslimeen.',
        'Our Lord, pour upon us patience and let us die as Muslims [in submission to You].',
        { fromWord: 10 },
      ),
      quran(
        '2:201',
        'Rabbanaa aatinaa fid-dunyaa hasanataw-wa fil-aakhirati hasanataw-wa qinaa ‘adhaaban-naar.',
        'Our Lord, give us in this world [that which is] good and in the Hereafter [that which is] good and protect us from the punishment of the Fire.',
        { fromWord: 3 },
      ),
      quran('37:180', 'Subhaana rabbika rabbil-‘izzati ‘ammaa yasifoon.', 'Exalted is your Lord, the Lord of might, above what they describe.'),
      quran('37:181', 'Wa salaamun ‘alal-mursaleen.', 'And peace upon the messengers.'),
      quran('37:182', 'Wal-hamdu lillaahi rabbil-‘aalameen.', 'And praise to Allah, Lord of the worlds.'),
    ],
    sources: [
      'Al-Aʿrāf 7:126 and Al-Baqarah 2:201 are shown from the word “رَبَّنَآ” (“Our Lord”) — the du‘a portion of each verse.',
      KFGQPC,
      SAHEEH,
    ],
  },
}
