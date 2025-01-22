import { getChecksum, verifyChecksum } from "./checksum.ts";
import { toMnemonic, fromMnemonic, validateMnemonic } from "./mnemonic.ts";
import { entFromString, entFromBuffer, entFromUint8Array, entFromHex } from "./ent.ts";
import { czech } from "./wordlists/czech.ts";
import { english } from "./wordlists/english.ts";
import { french } from "./wordlists/french.ts";
import { italian } from "./wordlists/italian.ts";
import { portuguese } from "./wordlists/portuguese.ts";
import { spanish } from "./wordlists/spanish.ts";

export function bip39() {
    throw new Error(`'bip39' requires a method.`);
};

bip39.core = {
    toMnemonic: function(wordlist: string[], ent: string): string {
        if (!wordlist) {
            throw new Error(`Parameter 'wordlist' is required.`);
        } else if (!ent) {
            throw new Error(`Initial Entropy parameter 'ent' is required.`);
        } else if (ent.length < 128 || ent.length > 256) {
            throw new Error(`Initial Entropy must be at least 128 bits and no longer than 256 bits.`);
        } else if (ent.length % 32 !== 0) {
            throw new Error(`Initial Entropy must be a multiple of 32.`);
        }

        const checksumLength: number = ent.length / 32;
        const entropy: string = getChecksum(ent, checksumLength);
        const mnemonic: string = toMnemonic(wordlist, entropy);
        const valid: boolean = validateMnemonic(wordlist, mnemonic, checksumLength);
        if (valid) {
            return mnemonic;
        } else {
            throw new Error(`Invalid mnemonic returned.`)
        }
    },
    validate: function(wordlist: string[], mnemonic: string): boolean {
        if (!wordlist) {
            throw new Error(`Parameter 'wordlist' is required.`);
        } else if (!mnemonic) {
            throw new Error(`Parameter 'mnemonic' is required.`);
        }

        const lengths: number[] = [ 12, 15, 18, 21, 24 ];
        const words: number = mnemonic.split(' ').length;
        if (!lengths.includes(words)) {
            throw new Error(`Invalid mnemonic length.`);
        }

        function getChecksumLength(mnemonic: string) {
            const lengths: { [key: number]: number } = { 12: 4, 15: 5, 18: 6, 21: 7, 24: 8 };
            const words: number = mnemonic.split(' ').length;
            if (lengths[words]) return lengths[words];
            throw new Error(`Invalid mnemonic length.`);
        }
        const checksumLength = getChecksumLength(mnemonic);
        const valid: boolean = validateMnemonic(wordlist, mnemonic, checksumLength);
        return valid;
    }
};

bip39.ext = {
    toMnemonic: toMnemonic,
    validate: validateMnemonic
};

bip39.ent = {
    fromMnemonic: fromMnemonic,
    fromString: entFromString,
    fromBuffer: entFromBuffer,
    fromUint8Array: entFromUint8Array,
    fromHex: entFromHex,
    checksum: getChecksum,
    verify: verifyChecksum
};

bip39.wordlist = {
    czech,
    english,
    french,
    italian,
    portuguese,
    spanish
};
