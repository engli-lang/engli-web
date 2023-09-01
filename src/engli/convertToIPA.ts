export default function convertToIPA(word: string): string {
    const ipaMap: Record<string, string> = {
        a: 'ɑ',
        b: 'b',
        c: 'ʧ',
        d: 'd',
        e: 'ɛ',
        f: 'f',
        g: 'ɡ',
        h: 'h',
        i: 'i',
        j: 'ʤ',
        k: 'k',
        l: 'l',
        m: 'm',
        n: 'n',
        o: 'ɔ',
        p: 'p',
        q: 'ŋ',
        r: 'r',
        s: 's',
        t: 't',
        u: 'ʌ',
        v: 'v',
        w: 'u',
        x: 'ʃ',
        y: 'i',
        z: 'z',
    };

    const ipaWord = word
        .split('')
        .map((char) => ipaMap[char] || char) // Use the IPA mapping or keep the original character if not found
        .join('');

    return `/${ipaWord}/`;
}