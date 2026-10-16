"""Extract the verses used by the khutbah from the `quran-json` npm package.

Source data (quran-json@3.1.2, CC-BY-SA 4.0):
  * Arabic: Uthmani text (King Fahd Complex / Hafs) via The Noble Qur'an Encyclopedia (quranenc.com)
  * English: Saheeh International, via tanzil.net (en.sahih)

Usage:
  npm pack quran-json@3.1.2 && tar xzf quran-json-3.1.2.tgz
  python3 scripts/extract-quran.py package/dist > src/data/quran-verified.json

The output is committed so the website never depends on a network request.
"""
import json
import sys

VERSES = {
    1: [2],
    2: [153, 201, 216],
    12: [90],
    94: [5, 6],
}

dist = sys.argv[1]
out = {
    "_source": {
        "package": "quran-json@3.1.2 (https://github.com/risan/quran-json, CC-BY-SA 4.0)",
        "arabic": "Uthmani script (King Fahd Glorious Qur'an Printing Complex, Hafs) via The Noble Qur'an Encyclopedia, quranenc.com",
        "english": "Saheeh International (Umm Muhammad), via tanzil.net/trans/en.sahih",
        "crossCheck": "Base letters cross-checked against the independent Tanzil Uthmani text (npm package quran@0.0.9)",
    },
    "verses": {},
}
for surah, ayahs in VERSES.items():
    with open(f"{dist}/chapters/en/{surah}.json", encoding="utf-8") as f:
        chapter = json.load(f)
    for v in chapter["verses"]:
        if v["id"] in ayahs:
            out["verses"][f"{surah}:{v['id']}"] = {
                "surah": surah,
                "surahName": chapter["transliteration"],
                "ayah": v["id"],
                "arabic": v["text"],
                "translation": v["translation"],
            }
json.dump(out, sys.stdout, ensure_ascii=False, indent=2)
sys.stdout.write("\n")
