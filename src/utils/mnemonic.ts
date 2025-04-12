/**
 * @fileoverview Provides utilities for entropy padding, generation of mnemonic sentences from entropy,
 * and conversion of mnemonic sentences back to entropy.
 * @author Jacob V. B. Haap <iacobus.xyz>
 * @license MIT
 */

/**
 * Apply padding to a Uint8Array to reach a permitted initial entropy length (ENT), so that
 * `ENT / 32` can yield an integer `CS`, and that `ENT + CS` are a multiple of 11 for mnemonic
 * sentence generation.
 * @example
 * const ent: Uint8Array = Uint8Array.from([68, 105, 110, 111, 115, 97, 117, 114, 115]);
 * const padded = padBytes(ent); // Uint8Array(12) [68, 105, 110, 111, 115, 97, 117, 114, 115, 0, 0, 0]
 */
export function padBytes(ent: Uint8Array): Uint8Array {
    const entLen = ent.length * 8; // Get byte entropy length in bits
    let padLen = (((entLen + 31) / 32) | 0) * 32; // Round up to next multiple of 32

    // Increment until (ENT + CS) is divisible by 11
    while ((padLen + (padLen / 32 | 0)) % 11 !== 0) {
        padLen += 32;
    }

    const byteLen = padLen / 8; // Convert final padding length from bits to bytes
    const padding = new Uint8Array(byteLen); // Create Uint8Array at padded size
    padding.set(ent); // Insert 'ent' at the start of the padded Uint8Array
    return padding; // Return the padded Uint8Array
}

/**
 * Apply padding to a bitstream string to reach a multiple of 11 for mnemonic sentence generation.
 * @example
 * const ent: string = "010001000110100101101110011011110111001101100001011101010111001001110011";
 * const padded = padBitstream(ent); // 01000100011010010110111001101111011100110110000101110101011100100111001100000
 */
export function padBitstream(ent: string): string {
    const entLen = ent.length; // Get bitstream entropy length
    const rem = entLen % 11; // Remainder to reach next multiple of 11
    const padLen = (11 - rem) % 11; // Calculate padding length
    return ent + '0'.repeat(padLen); // Apply padding and return padded bitstream
}

/**
 * Convert a bitstream string to a mnemonic sentence.
 * When the optional `ext` parameter is *true*, any entropy length will be accepted, and padding will
 * be applied internally to meet the requirements for mnemonic sentence generation.
 * @example
 * const bits: string = "01000010011011110110010101101001011011100110";
 * const ms = bitstreamToMs(english, bits); // draw kite fog system
 */
export function bitstreamToMs(wordlist: string[], ent: string, ext?: boolean): string {
    const entLen = ent.length; // Get current entropy length
    let bitstream: string; // Initialize 'bitstream' let as a string

    // Check if 'ent' is divisible by 11
    if (entLen % 11 == 0) {
        bitstream = ent; // Directly use 'ent' as bitstream when divisible by 11
    } else {
        if (ext) {
            // Apply padding when 'entLen' is not divisible by 11 and 'ext' is true
            bitstream = padBitstream(ent);
        } else {
            // Throw an error if 'entLen' is not divisible by 11 and 'ext' is false/undefined
            throw new Error(`Invalid entropy length for mnemonic generation: ${entLen} is not divisible by 11.`);
        }
    }

    // Create a mnemonic sentence by selecting words from 'wordlist'
    // Use 11 bit segments from 'ent' bitstream string to encode a number from 0-2047
    // Use number to select a word from 'wordlist' at that index
    const words: string[] = []; // Initialize 'words' as an empty array
    for (let i = 0; i < entLen; i += 11) {
        const indexBits = bitstream.slice(i, i + 11);
        const index = parseInt(indexBits, 2);
        words.push(wordlist[index]);
    }
    const japanese = /^[\u3040-\u309F]+$/.test(wordlist[0]); // Check if the wordlist is Japanese
    const joiner = japanese ? "\u3000" : " "; // Use ideographic spaces for Japanese, space otherwise
    return words.join(joiner); // Join and return selected words as the mnemonic sentence
}

/**
 * Convert a mnemonic sentence to a bitstream string.
 * @example
 * const ms: string = "draw kite fog system";
 * const bits = msToBitstream(english, ms); // 01000010011011110110010101101001011011100110
 */
export function msToBitstream(wordlist: string[], ms: string): string {
    const japanese = /^[\u3040-\u309F]+$/.test(wordlist[0]); // Check if the wordlist is Japanese
    const separator = japanese ? "\u3000" : " "; // Use ideographic spaces for Japanese, space otherwise
    const words = ms.split(separator); // Split mnemonic sentence into array of words

    // Reconstruct the original bitstream by converting words back to indexes
    // Look up each word in 'wordlist' to get its 11 bit index
    // Pad each index to 11 bits and append to the bitstream string
    let bits = ""; // Initialize 'bits' as an empty string
    words.forEach(word => {
        const index = wordlist.indexOf(word);
        if (index === -1) {
            throw new Error(`Word not found in wordlist: ${word}`);
        }
        bits += index.toString(2).padStart(11, '0');
    })
    return bits; // Return the bitstream string
}
