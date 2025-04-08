/**
 * @fileoverview Entry point for @iacobus/bip39.
 * Exports core functions for mnemonic sentence generation, validation, conversions back to initial entropy,
 * and seed creation.
 * @module
 * @author Jacob V. B. Haap <iacobus.xyz>
 * @license MIT
 */

import { randomBytes } from "npm:@noble/hashes@1.7.1/utils";
import { toBitstream, fromBitstream } from "./utils/bitstream.ts";
import { calcCsum, verifyCsum } from "./utils/checksum.ts";
import { padBytes, bitstreamToMs, msToBitstream } from "./utils/mnemonic.ts";
import { msToSeed, msToSeedAsync } from "./utils/seed.ts";

/**
 * Verify that a mnemonic sentence is valid.
 * @example
 * const ms: string = "draw kite fog system improve calm smoke economy cake head figure drastic";
 * const verified = verifyMnemonic(english, ms); // true
 */
export function verifyMnemonic(wordlist: string[], ms: string): boolean {
    const bitstream = msToBitstream(wordlist, ms); // Get bitstream string from mnemonic sentence
    return verifyCsum(bitstream); // Verify bitstream with 'verify' function, return result
}

/** Map of valid MS lengths to ENT lengths. */
const msToEntMap: Record<number, number> = {
    12: 128,
    15: 160,
    18: 192,
    21: 224,
    24: 256,
}

/**
 * Generate a mnemonic sentence with cryptographically secure entropy obtained from {@link randomBytes},
 * based on a provided wordlist, at a length of `msLen` words.
 * @example
 * const ms = generateMnemonic(english, 12); // word breeze hope phrase year road nature copy face forest tumble coin
 */
export function generateMnemonic(wordlist: string[], msLen: number): string {
    // Use the 'msLen' number to obtain an ENT number based on the 'msToEntMap' map
    const entLen = msToEntMap[msLen] ?? (() => {
        // Throw an error if the msLen is invalid
        throw new Error(`Invalid 'msLen' for mnemonic generation.`);
    })();
    const byteLen = entLen / 8; // Convert the 'entLen' number from bits to bytes
    const bytes = randomBytes(byteLen); // Get 'byteLen' of initial entropy from 'randomBytes'
    const ent = toBitstream(bytes); // Convert 'bytes' to bitstream string 'ent'
    const csum = calcCsum(ent); // Calculate a checksum
    const entropy = ent + csum; // Append the checksum to the initial entropy
    const ms = bitstreamToMs(wordlist, entropy); // Generate mnemonic sentence from 'entropy' bitstream
    const valid = verifyMnemonic(wordlist, ms); // Verify that the generated mnemonic sentence is valid
    if (valid) return ms; // Return the mnemonic sentence if valid
    else throw new Error(`Invalid mnemonic sentence generated.`); // Throw an error if verification fails
}

/**
 * Generate a mnemonic sentence from initial entropy.
 * When the optional `ext` parameter is *true*, any initial entropy length will be accepted, and padding will
 * be applied internally to meet the requirements for mnemonic sentence generation.
 * @example
 * const ent: Uint8Array = Uint8Array.from([66, 111, 101, 105, 110, 103, 32, 65, 51, 50, 49, 32, 77, 65, 88, 33]);
 * const ms = toMnemonic(english, ent); // draw kite fog system improve calm smoke economy cake head figure drastic
 */
export function toMnemonic(wordlist: string[], ent: Uint8Array, ext?: boolean): string {
    let initEnt: Uint8Array; // Initialize 'initEnt' let as a Uint8Array
    if (ext) initEnt = padBytes(ent); // Pad 'ent' and use as initial entropy when 'ext' is true
    else initEnt = ent; // Directly use 'ent' as initial entropy when 'ext' is false/undefined
    const entBits = toBitstream(initEnt); // Convert 'ent' to a bitstream string
    const entLen = BigInt(entBits.length); // Get the length of 'entBits'

    // Throw an error if the entropy is more than 8192 bits
    if (entLen > 8192n) {
        throw new Error(`Initial entropy cannot exceed 8192 bits, got ${entLen} bits.`);
    }

    // Throw an error if 'entLen' is not divisible by 32
    if ((entLen % 32n !== 0n)) {
        throw new Error(`Invalid initial entropy length: ${entLen} is not divisible by 32.`);
    }

    // Throw an error if the initial entropy length is not 128, 160, 192, 224, or 256
    if (!ext && ![128n, 160n, 192n, 224n, 256n].includes(entLen)) {
        throw new Error(`Invalid initial entropy length: got ${entLen}, expected 128, 160, 192, 224, or 256`);
    }

    const csum = calcCsum(entBits); // Calculate a checksum
    const entropy = entBits + csum; // Append the checksum to the initial entropy
    const ms = bitstreamToMs(wordlist, entropy) // Generate mnemonic sentence from 'entropy' bitstream
    const valid = verifyMnemonic(wordlist, ms); // Verify that the generated mnemonic sentence is valid
    if (valid) return ms; // Return the mnemonic sentence if valid
    else throw new Error(`Invalid mnemonic sentence generated.`); // Throw an error if verification fails
}

/**
 * Convert a mnemonic sentence back to the initial entropy from which it was generated.
 * @example
 * const ms: string = "draw kite fog system improve calm smoke economy cake head figure drastic";
 * const ent = fromMnemonic(english, ms); // Uint8Array(16) [66, 111, 101, 105, 110, 103, 32, 65, 51, 50, 49, 32, 77, 65, 88, 33]
 */
export function fromMnemonic(wordlist: string[], ms: string): Uint8Array {
    const bits = msToBitstream(wordlist, ms); // Get bitstream string from mnemonic sentence
    const bitLen = bits.length; // Get the total ENT + CS length
    const entLen = (32 * bitLen) / 33; // Determine the ENT length
    const entBits = bits.slice(0, entLen); // Isolate initial entropy 
    return fromBitstream(entBits); // Return initial entropy as Uint8Array
}

/**
 * Create a 64 byte seed from a mnemonic sentence + optional passphrase (synchronous).
 * @example
 * const ms: string = "draw kite fog system improve calm smoke economy cake head figure drastic";
 * const seed = createSeed(english, ms); // Uint8Array(64) [174, 41, 10, 203...]
 */
export function createSeed(wordlist: string[], ms: string, passphrase?: string): Uint8Array {
    const valid = verifyMnemonic(wordlist, ms); // Verify that the provided mnemonic sentence is valid
    if (valid) return msToSeed(ms, passphrase); // Create and return a seed if the mnemonic sentence if valid
    else throw new Error(`Invalid mnemonic sentence.`); // Throw an error if verification fails
}

/**
 * Create a 64 byte seed from a mnemonic sentence + optional passphrase (asynchronous).
 * @example
 * const ms: string = "draw kite fog system improve calm smoke economy cake head figure drastic";
 * const seed = await createSeedAsync(english, ms); // Uint8Array(64) [174, 41, 10, 203...]
 */
export async function createSeedAsync(wordlist: string[], ms: string, passphrase?: string): Promise<Uint8Array> {
    const valid = verifyMnemonic(wordlist, ms); // Verify that the provided mnemonic sentence is valid
    if (valid) return await msToSeedAsync(ms, passphrase); // Create and return a seed if the mnemonic sentence if valid
    else throw new Error(`Invalid mnemonic sentence.`); // Throw an error if verification fails
}
