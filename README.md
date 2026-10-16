# Khutbah Reader

A private reading script for delivering the Friday khutbah **“Everything Has a Reason — Trusting Allah’s Wisdom”** from a phone, tablet or laptop. It is not a slideshow and it never reads anything aloud.

## Using it

- **One continuous script** of about 10 minutes, in delivery order. The Arabic sits right in the script, so there are no separate pages to open.
- **Read your English** as normal paragraphs. A green bar marks where you are, the top bar shows the section, and the thin line at the very top shows progress.
- **📖 Recite in Arabic** blocks show the Arabic on a mushaf-style page (Indo-Pak script with tajweed colours), with the transliteration underneath. For Qur’an passages a **🇬🇧 Read the English** block follows.
- **Boxed cues are never spoken:** ⏸️ Pause, 🪑 Sit briefly, 🧍 Stand up, 🤲 Make du‘a, 🏁 End of khutbah.
- **Next / Previous** move one block at a time. If a block is taller than the screen, Next scrolls through it first, so nothing is skipped. Arrow keys, Space and Bluetooth page turners work too.
- **⏱ Timer** in the bottom bar starts when you first press Next and shows the time left (estimated). Tap it to pause or resume. It turns orange after 10 minutes, keeps running if the page reloads, and resets from **Aa → Timer**.
- **☰ Contents** jumps to any section and shows roughly how long each one takes.
- **Paper backup:** **Aa → Print / save PDF** prints the whole script (Arabic included) without the buttons, in case your phone dies.
- **Aa** sets text sizes, light or dark mode, Arabic style (Indo-Pak or Uthmani), tajweed colours and keep-screen-awake. **⛶ Present** hides the menus.
- Your place and settings are **saved on the device**. After the first visit the script **works offline**. On iPhone, use *Share → Add to Home Screen*.

## Sources and accuracy

| Content | Source |
| --- | --- |
| Qur’an Arabic (all verses) | Uthmani text of the King Fahd Glorious Qur’an Printing Complex (Ḥafṣ), via The Noble Qur’an Encyclopedia ([quranenc.com](https://quranenc.com)), from the [`quran-json`](https://github.com/risan/quran-json) package (CC-BY-SA 4.0). Cross-checked letter by letter against the independent Tanzil Uthmani text. Stored in `src/data/quran-verified.json`. |
| Qur’an Arabic, Indo-Pak script (default display) | Quran.com Indo-Pak text (`text_indopak`), from the [`alfurqan`](https://github.com/ariefsn/alquran-ts) package (MIT), stored in `src/data/quran-indopak.json`. Every verse is checked to have **exactly the same letters** as the verified KFGQPC text above. Only spelling conventions are allowed to differ: hamza marking, tatweel, small waw/ya and long-vowel alifs. |
| Tajweed colours | Quran.com tajweed rules (`text_uthmani_tajweed`), matched letter by letter onto the Indo-Pak text: ghunnah (red), idghām (green), ikhfāʾ (blue), iqlāb (purple), qalqalah (orange). |
| Indo-Pak font | Al Qalam “Al QuranWBW” (© Al Qalam; credits Abdul Majeed Khan, Arif Karim, Shakir-ul-Qadree), distributed free for Qur’an use, from the `arabic-fonts` package |
| Qur’an English | **Saheeh International**, via [tanzil.net](https://tanzil.net/trans/en.sahih) |
| Khutbah opening | The khateeb’s own text: a common Indo-Pak form of Khuṭbat al-Ḥājah (core in Sunan Abī Dāwūd 2118, Sunan al-Nasāʾī 3278 and Ṣaḥīḥ Muslim 868). |
| Qur’an quotes in the khutbah | Al-Baqarah 2:216 (from “wa ʿasā”), Yusuf 12:90 (from “innahu”), Ash-Sharh 94:5–6, Al-Baqarah 2:153 (from “inna Allāha”). Yaʿqub’s words “So patience is most fitting” (12:18) are quoted in English. |
| Salawat (second khutbah) | First part of al-ṣalāh al-Ibrāhīmiyyah, narrated by Kaʿb ibn ʿUjrah. Sources: Ṣaḥīḥ al-Bukhārī 3370 and Ṣaḥīḥ Muslim 406. Preceded by 1:2. |
| Optional Arabic du‘a | 2:201 from “رَبَّنَآ” |
| Hadith of the believer’s affairs | Ṣaḥīḥ Muslim 2999, narrated by Ṣuhayb. The khutbah paraphrases it in plain English. |
| Transliterations | Simplified, readable transliterations written for this script |

Safeguards (enforced by `npm test`):

- Qur’anic Arabic is never typed by hand. It always comes from the verified data file. Partial verses are sliced by word position.
- Every Qur’an translation must match the Saheeh International wording.
- Spoken paragraphs may not contain bracketed stage directions, and every cue from the original script must be present.

The Indo-Pak data is regenerated with `scripts/extract-indopak.py`. The script will not write output if any verse differs from the verified text, or if the tajweed rules don't line up letter for letter.

Display note: the KFGQPC text writes the open tanween with U+0656, U+0657 and U+065E. When the page draws these verses, they are mapped to the standard U+08F0–U+08F2 so the bundled Amiri Quran font shows the right marks. The stored text is not changed.

## Development

```bash
npm install
npm run dev      # local dev server
npm test         # content & accuracy checks
npm run build    # production build in dist/
npm run preview  # serve the production build
```

The khutbah text is in `src/data/script.ts`. The recitation pages are in `src/data/recitations.ts`.

## Deployment (GitHub Pages)

`.github/workflows/deploy.yml` tests, builds and deploys on every push to `main`. One-time setup: **Settings → Pages → Build and deployment → Source: GitHub Actions**. The site uses relative paths, so it works at `https://<user>.github.io/<repo>/`.
