import EngliTranslation from "./EngliTranslation";
import englishIPAToEngli from "./englishIPAToEngli";
import knownTranslations from "./KnownTranslations";

enum Capitalization {
    Lowercase,
    Uppercase,
    StartCase,
};

function getCapitalization(word: string): Capitalization {
    if (word === word.toLowerCase()) {
        return Capitalization.Lowercase;
    }
    else if (word === word.toUpperCase()) {
        return Capitalization.Uppercase;
    }
    else if (word[0] === word[0].toUpperCase() && word.slice(1) === word.slice(1).toLowerCase()) {
        return Capitalization.StartCase;
    }
    else {
        return Capitalization.Lowercase;
    }
}

function wouldBeInstant(text: string): boolean {
    const words = text.split(' ');
    for (const w of words) {
        let word = w;
        word = word.replace(/^\W+/, '').replace(/\W+$/, '').toLowerCase();
        if (knownTranslations[word] === undefined) {
            return false;
        }
    }
    return true;
}

async function englishToEngli(text: string): Promise<EngliTranslation> {
    // split into words
    const words = text.split(' ');
    // convert each word to IPA with https://api.dictionaryapi.dev/api/v2/entries/en/<word>
    const translations: EngliTranslation[] = await Promise.all(words.map(async (word) => {
        // strip punctuation but save it in puncPrefix and puncSuffix
        const puncPrefix = word.match(/^\W+/)?.[0] || '';
        const puncSuffix = word.match(/\W+$/)?.[0] || '';
        word = word.replace(/^\W+/, '').replace(/\W+$/, '');
        // save capitalization
        const capitalization = getCapitalization(word);

        word = word.toLowerCase();

        let result = knownTranslations[word];
        let confidence = 1;

        if (result === undefined) {
            confidence = 0;

            const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
            const json = await response.json();
            if (json.length === 0 || json.length === undefined) {
                result = word;
            }
            else {
                if (json[0].phonetic) {
                    console.log('using phonetic', json[0].phonetic)
                    result = englishIPAToEngli(json[0].phonetic.replaceAll('/', ''));
                }
                else {
                    const phonetics: any[] = json[0].phonetics;
                    if (phonetics.length === 0) {
                        result = word;
                    }
                    else {
                        // find a phonetic that has .text
                        const phonetic: any | undefined = phonetics.find((phonetic) => phonetic.text);
                        if (phonetic === undefined) {
                            result = word;
                        }
                        else {
                            const text = phonetic.text.replaceAll('/', '');
                            console.log('using phonetic', text)
                            result = englishIPAToEngli(text);
                        }
                    }
                }
            }
        }
        // restore capitalization
        if (capitalization === Capitalization.Uppercase) {
            result = result.toUpperCase();
        }
        else if (capitalization === Capitalization.StartCase) {
            result = result[0].toUpperCase() + result.slice(1).toLowerCase();
        }
        // restore punctuation
        result = puncPrefix + result + puncSuffix;

        // remove any duplicate letters that are next to each other, turns to one
        result = result.replace(/(.)\1+/g, '$1');

        // remove ˈ and '
        result = result.replace(/ˈ/g, '').replace(/'/g, '');

        return {
            engli: result,
            confidence,
        };
    }));
    // join em back together
    const engliString = translations.map((translation) => translation.engli).join(' ');
    return {
        engli: engliString,
        // amount of known words / total words
        confidence: translations.reduce((acc, translation) => acc + translation.confidence, 0) / translations.length,
    }
}

export default englishToEngli;
export {
    wouldBeInstant,
    englishToEngli,
};