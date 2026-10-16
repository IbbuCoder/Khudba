"""Build src/data/quran-indopak.json: the Indo-Pak script text of the verses
used in the khutbah, with tajweed colour runs.

Source data comes from the `alfurqan` npm package (MIT), which bundles the
Quran.com API's `text_indopak` and `text_uthmani_tajweed` fields. The package
is parsed as text (never executed).

Safety checks (the script refuses to write output if any fail):
  * every Indo-Pak verse has exactly the same letters as the verified
    KFGQPC text in src/data/quran-verified.json, once purely orthographic
    differences are normalised (hamza seat/marking, tatweel, small waw/ya,
    long-vowel alifs);
  * the Quran.com tajweed text lines up letter-for-letter with the
    Indo-Pak text, so each tajweed rule lands on the right letter.

Usage:
  npm pack alfurqan@0.0.3 && tar xzf alfurqan-0.0.3.tgz
  python3 scripts/extract-indopak.py package/dist/index.js > src/data/quran-indopak.json
"""
import html
import json
import re
import sys
import unicodedata

VERSES = ['1:2', '2:153', '2:201', '2:216', '12:90', '94:5', '94:6']

# Quran.com tajweed classes shown in colour, grouped like Indo-Pak colour-coded mushafs.
TAJWEED_GROUPS = {
    'ghunnah': 'ghunnah',
    'idgham_ghunnah': 'idgham',
    'idgham_wo_ghunnah': 'idgham',
    'idgham_shafawi': 'idgham',
    'idgham_mutajanisayn': 'idgham',
    'idgham_mutaqaribayn': 'idgham',
    'ikhafa': 'ikhfa',
    'ikhafa_shafawi': 'ikhfa',
    'iqlab': 'iqlab',
    'qalaqah': 'qalqalah',
}

# Orthographic normalisation for comparing scripts: letters that Uthmani and
# Indo-Pak spell differently but which are the same Qur'anic word.
NORMALISE = {
    'ٱ': '', 'ا': '', 'أ': '', 'إ': '', 'آ': '', 'ٲ': '', 'ء': '', 'ـ': '', 'ۥ': '', 'ۦ': '',
    'ى': 'ي', 'ی': 'ي', 'ئ': 'ي', 'ٮ': 'ي', 'ؤ': 'و', 'ة': 'ه', 'ک': 'ك',
}


def skeleton_positions(text):
    """(index, normalised letter) for every letter that survives normalisation."""
    out = []
    for i, ch in enumerate(text):
        if not unicodedata.category(ch).startswith('L'):
            continue
        n = NORMALISE.get(ch, ch)
        if n:
            out.append((i, n))
    return out


def parse_tajweed(markup):
    """Quran.com tajweed markup -> (plain text, per-character class list)."""
    markup = html.unescape(markup)
    markup = re.sub(r'<span class=end>.*?</span>', '', markup)
    text, classes = [], []
    pos = 0
    for m in re.finditer(r'<tajweed class=([a-z_]+)>(.*?)</tajweed>', markup):
        for ch in markup[pos:m.start()]:
            text.append(ch)
            classes.append(None)
        for ch in m.group(2):
            text.append(ch)
            classes.append(m.group(1))
        pos = m.end()
    for ch in markup[pos:]:
        text.append(ch)
        classes.append(None)
    plain = ''.join(text)
    if '<' in plain:
        raise SystemExit('Unparsed tajweed markup: ' + plain)
    return plain, classes


def section(src, name):
    start = src.index(f'var {name} = [')
    return src[start:src.index('\n];', start)]


def main():
    src = open(sys.argv[1], encoding='utf-8').read()
    pattern = re.compile(r'verseKey: "(\d+:\d+)",\s*text: "((?:[^"\\]|\\.)*)"')

    def load(name):
        return {k: json.loads('"' + t + '"') for k, t in pattern.findall(section(src, name)) if k in VERSES}

    indopak, tajweed = load('VERSES_INDOPAK'), load('VERSES_UTHMANITAJWEED')
    verified = json.load(open('src/data/quran-verified.json', encoding='utf-8'))['verses']

    out = {
        '_source': {
            'text': "Indo-Pak script text from the Quran.com API (text_indopak), via the alfurqan npm package (MIT)",
            'tajweed': "Tajweed rules from the Quran.com API (text_uthmani_tajweed), via the alfurqan npm package, aligned letter-by-letter onto the Indo-Pak text",
            'check': "Every verse has the same letters as the verified KFGQPC text (src/data/quran-verified.json) after orthographic normalisation",
        },
        'verses': {},
    }
    for key in VERSES:
        ip = indopak[key]
        ver = [n for _, n in skeleton_positions(verified[key]['arabic'])]
        ip_pos = skeleton_positions(ip)
        if ver != [n for _, n in ip_pos]:
            raise SystemExit(f'{key}: Indo-Pak text does not match the verified text')

        tj_text, tj_classes = parse_tajweed(tajweed[key])
        tj_pos = skeleton_positions(tj_text)
        if [n for _, n in tj_pos] != ver:
            raise SystemExit(f'{key}: tajweed text does not line up with the verified text')

        # Class for each Indo-Pak character: a letter takes the class of the
        # matching tajweed letter; its marks follow it.
        letter_class = {}
        for (ip_i, _), (tj_i, _) in zip(ip_pos, tj_pos):
            cls = tj_classes[tj_i]
            letter_class[ip_i] = TAJWEED_GROUPS.get(cls) if cls else None
        # Letters only Indo-Pak spells (e.g. the hamza in شَىۡءٍ) join a rule
        # when the letters on both sides of them belong to it.
        kept = [i for i, _ in ip_pos]
        for i, ch in enumerate(ip):
            if unicodedata.category(ch).startswith('L') and i not in letter_class:
                before = [k for k in kept if k < i]
                after = [k for k in kept if k > i]
                if before and after and letter_class[before[-1]] == letter_class[after[0]]:
                    letter_class[i] = letter_class[before[-1]]
        runs, current = [], None
        for i, ch in enumerate(ip):
            cat = unicodedata.category(ch)
            if i in letter_class:
                current = letter_class[i]
            elif cat.startswith('L') or not cat.startswith('M'):
                current = None
            if runs and runs[-1][1] == current:
                runs[-1][0] += ch
            else:
                runs.append([ch, current])
        out['verses'][key] = {'text': ip, 'runs': runs}

    json.dump(out, sys.stdout, ensure_ascii=False, indent=1)
    sys.stdout.write('\n')


main()
