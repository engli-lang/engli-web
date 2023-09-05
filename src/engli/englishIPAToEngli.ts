export default function englishIPAToEngli(ipaString: string): string {
    const ipaToEngliMap: Record<string, string> = {
        p: 'p',
        b: 'b',
        t: 't',
        d: 'd',
        k: 'k',
        g: 'g',
        f: 'f',
        v: 'v',
        θ: 'f', // Represents both /θ/ and /ð/ as 'f' in Engli
        ð: 'c', // Represents both /θ/ and /ð/ as 'c' in Engli
        s: 's',
        z: 'z',
        ʃ: 'x', // Represents both /ʃ/ and /ʒ/ as 'x' in Engli
        ʒ: 'x', // Represents both /ʃ/ and /ʒ/ as 'x' in Engli
        h: 'h',
        m: 'm',
        n: 'n',
        ŋ: 'q',
        l: 'l',
        ɹ: 'r',
        j: 'j',
        w: 'w',
        i: 'y',
        ɪ: 'y',
        e: 'e',
        ɛ: 'e',
        æ: 'a',
        ʌ: 'a',
        ɑ: 'o',
        ɔ: 'o',
        u: 'u',
        ʊ: 'u',
        ə: 'u',
        ŏ: 'w'
    };

    const engliString = ipaString
        .split('')
        .map((ipaChar) => ipaToEngliMap[ipaChar] || ipaChar)
        .join('');

    return engliString;
}