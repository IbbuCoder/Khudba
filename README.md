# Khutbah Reader

A private reading script for delivering the Friday khutbah **“Everything Has a Reason — Trusting Allah’s Wisdom”** from a phone, tablet or laptop. It is not a slideshow and it never reads anything aloud.

## Using it

- **Read the English** as normal paragraphs. The paragraph you are on is marked with a green bar; the top bar shows the current section and the thin line at the very top shows progress.
- **Boxed cues are never spoken.** ⏸️ PAUSE, 🪑 SIT BRIEFLY, 🧍 STAND UP, 🤲 MAKE DU‘A and 🏁 END are private instructions.
- **Arabic style:** the Arabic pages use the Indo-Pak script on a ruled, framed mushaf-style page, with tajweed colours by default. Go to **Aa → Arabic style** to switch to the Uthmani (Madani) script, or **Aa → Tajweed colours** to turn the colours off.
- **Arabic recitation:** when you reach a green 📖 RECITE ARABIC card, press **Open Arabic** (or the card’s button). The Arabic page has three plain steps: **1 · Recite the Arabic** (one mushaf page, with the transliteration below it), **2 · Read the English** (Qur’an passages only), then **↩️ Back to khutbah**. Nothing advances on its own. Press **↩️ Return to khutbah** to go to the exact next paragraph. Press **← Khutbah** in the top corner to go back to the card instead.
- **Previous / Next** step one block at a time. Arrow keys, Space, Page Up/Down and most Bluetooth page turners also work.
- **☰ Contents** jumps to any section. **Aa** changes text size (English and Arabic separately), theme (light, dark or device) and keeps the screen awake. **⛶ Present** hides the menus. Press ✕ in the bottom bar to leave presentation mode.
- Your place and settings are **saved on the device**. If the page reloads, it reopens where you were, even on the Arabic page.
- **Offline:** open the site once with a connection. After that it loads without signal. On iPhone, use *Share → Add to Home Screen* to open it full-screen like an app.

## Sources and accuracy

| Content | Source |
| --- | --- |
| Qur’an Arabic (all verses) | Uthmani text of the King Fahd Glorious Qur’an Printing Complex (Ḥafṣ), via The Noble Qur’an Encyclopedia ([quranenc.com](https://quranenc.com)), from the [`quran-json`](https://github.com/risan/quran-json) package (CC-BY-SA 4.0). Cross-checked letter by letter against the independent Tanzil Uthmani text. Stored in `src/data/quran-verified.json`. |
| Qur’an Arabic, Indo-Pak script (default display) | Quran.com Indo-Pak text (`text_indopak`), from the [`alfurqan`](https://github.com/ariefsn/alquran-ts) package (MIT), stored in `src/data/quran-indopak.json`. Every verse is checked to have **exactly the same letters** as the verified KFGQPC text above. Only spelling conventions are allowed to differ: hamza marking, tatweel, small waw/ya and long-vowel alifs. |
| Tajweed colours | Quran.com tajweed rules (`text_uthmani_tajweed`), matched letter by letter onto the Indo-Pak text: ghunnah (red), idghām (green), ikhfāʾ (blue), iqlāb (purple), qalqalah (orange). |
| Indo-Pak font | Al Qalam “Al QuranWBW” (© Al Qalam; credits Abdul Majeed Khan, Arif Karim, Shakir-ul-Qadree), distributed free for Qur’an use, from the `arabic-fonts` package |
| Qur’an English | **Saheeh International**, via [tanzil.net](https://tanzil.net/trans/en.sahih) |
| Khutbah opening | Khuṭbat al-Ḥājah, narrated by ʿAbdullāh ibn Masʿūd. Sources: Sunan Abī Dāwūd 2118 and Sunan al-Nasāʾī 3278. Recited with 3:102, 4:1 and 33:70–71. |
| Salawat (second khutbah) | Al-ṣalāh al-Ibrāhīmiyyah, narrated by Kaʿb ibn ʿUjrah. Sources: Ṣaḥīḥ al-Bukhārī 3370 and Ṣaḥīḥ Muslim 406. Preceded by 1:2 and 33:56. |
| Optional Arabic du‘a | 7:126 and 2:201, each from “رَبَّنَآ”, then 37:180–182 |
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
