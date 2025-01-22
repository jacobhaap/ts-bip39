import { verifyChecksum } from "./checksum.ts";

export function toMnemonic(wordlist: string[], entropy: string): string {
    if (!wordlist) {
        throw new Error(`Parameter 'wordlist' is required.`);
    } else if (!entropy) {
        throw new Error(`Parameter 'entropy' is required.`);
    }

    if (entropy.length < 11 || entropy.length > 506) {
        throw new Error(`Entropy must be at least 11 bits and no longer than 506 bits.`);
    } else if (entropy.length % 11 !== 0) {
        throw new Error(`Entropy must be a multiple of 11.`);
    }

    const words: string[] = [];
    for (let i = 0; i < entropy.length; i += 11) {
        const index: number = parseInt(entropy.slice(i, i + 11), 2);
        words.push(wordlist[index]);
    }
    const mnemonic: string = words.join(' ');
    return mnemonic;
};

export function fromMnemonic(wordlist: string[], mnemonic: string): string {
    if (!wordlist) {
        throw new Error(`Parameter 'wordlist' is required.`);
    } else if (!mnemonic) {
        throw new Error(`Parameter 'mnemonic' is required.`);
    }

    const words: string[] = mnemonic.split(' ');
    const length: number = words.length;
    if (length < 1 || length > 46) {
        throw new Error(`Mnemonic must be at least 1 word and no longer than 46 words.`);
    }

    let entropy = '';
    words.forEach(word => {
        const index: number = wordlist.indexOf(word);
        if (index === -1) {
            throw new Error(`Word '${word}' not found in wordlist.`);
        }
        entropy += index.toString(2).padStart(11, '0');
    });

    return entropy;
};

export function validateMnemonic(wordlist: string[], mnemonic: string, checksumLength: number): boolean {
    if (!mnemonic) {
        throw new Error(`Parameter 'mnemonic' is required.`)
    } else if (!checksumLength) {
        throw new Error(`Parameter 'checksumLength' is required.`)
    }

    const entropy: string = fromMnemonic(wordlist, mnemonic);
    const verified: boolean = verifyChecksum(entropy, checksumLength);
    return verified;
};
