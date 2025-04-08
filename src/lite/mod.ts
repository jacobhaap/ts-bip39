/**
 * @fileoverview Entry point for @iacobus/bip39/lite.
 * Exports lite functions for mnemonic sentence generation, validation, and seed creation. Lite denotes that this
 * entry point is more minimal than @iacobus/bip39, with the most notable difference being the lack of wordlist
 * parameters in functions, instead only using the English wordlist
 * @module
 * @author Jacob V. B. Haap <iacobus.xyz>
 * @license MIT
 */

import { randomBytes } from "npm:@noble/hashes@1.7.1/utils";
import { english } from "../wordlists/english.ts";
import { toBitstream } from "../utils/bitstream.ts";
import { calcCsum, verifyCsum } from "../utils/checksum.ts";
import { bitstreamToMs, msToBitstream } from "../utils/mnemonic.ts";
import { msToSeed, msToSeedAsync } from "../utils/seed.ts";

/**
 * Verify that a mnemonic sentence is valid.
 * @example
 * const ms: string = "draw kite fog system improve calm smoke economy cake head figure drastic";
 * const verified = verifyMnemonic(ms); // true
 */
export function verifyMnemonic(ms: string): boolean {
    const bitstream = msToBitstream(english, ms); // Get bitstream string from mnemonic sentence
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
 * Generate a mnemonic sentence at a length of `msLen` words. Cryptographically secure entropy
 * is obtained internally from {@link randomBytes}, or entropy is provided via the `ent` parameter.
 * The English wordlist is used for mnemonic generation.
 * @example
 * const ent: Uint8Array = Uint8Array.from([66, 111, 101, 105, 110, 103, 32, 65, 51, 50, 49, 32, 77, 65, 88, 33]);
 * const ms = generateMnemonic(12, ent); // draw kite fog system improve calm smoke economy cake head figure drastic
 */
export function generateMnemonic(msLen: number, ent?: Uint8Array): string {
    // Use the 'msLen' number to obtain an ENT number based on the 'msToEntMap' map
    const entLen = msToEntMap[msLen] ?? (() => {
        // Throw an error if the msLen is invalid
        throw new Error(`Invalid 'msLen' for mnemonic generation.`);
    })();

    // Use provided entropy, or derive from 'randomBytes' when 'ent' is undefined
    let initEnt: string; // Initialize 'initEnt' let as a string
    if (ent) { // If 'ent' is provided
        const entBits = toBitstream(ent); // Convert 'ent' to a bitstream string
        initEnt = entBits.slice(0, entLen); // Slice the bistream to 'entLen' length, assign to 'initEnt'
    } else { // If 'ent' is undefined
        const byteLen = entLen / 8; // Convert the 'entLen' number from bits to bytes
        const bytes = randomBytes(byteLen); // Get 'byteLen' of initial entropy from 'randomBytes'
        initEnt = toBitstream(bytes); // Convert 'bytes' to bitstream, assign to 'initEnt'
    }

    const csum = calcCsum(initEnt); // Calculate a checksum
    const entropy = initEnt + csum; // Append the checksum to the initial entropy
    const ms = bitstreamToMs(english, entropy) // Generate mnemonic sentence from 'entropy' bitstream
    const valid = verifyMnemonic(ms); // Verify that the generated mnemonic sentence is valid
    if (valid) return ms; // Return the mnemonic sentence if valid
    else throw new Error(`Invalid mnemonic sentence generated.`); // Throw an error if verification fails
}

/**
 * Create a 64 byte seed from a mnemonic sentence + optional passphrase (synchronous).
 * @example
 * const ms: string = "draw kite fog system improve calm smoke economy cake head figure drastic";
 * const seed = createSeed(ms); // Uint8Array(64) [174, 41, 10, 203...]
 */
export function createSeed(ms: string, passphrase?: string): Uint8Array {
    const valid = verifyMnemonic(ms); // Verify that the provided mnemonic sentence is valid
    if (valid) return msToSeed(ms, passphrase); // Create and return a seed if the mnemonic sentence if valid
    else throw new Error(`Invalid mnemonic sentence.`); // Throw an error if verification fails
}

/**
 * Create a 64 byte seed from a mnemonic sentence + optional passphrase (asynchronous).
 * @example
 * const ms: string = "draw kite fog system improve calm smoke economy cake head figure drastic";
 * const seed = await createSeedAsync(ms); // Uint8Array(64) [174, 41, 10, 203...]
 */
export async function createSeedAsync(ms: string, passphrase?: string): Promise<Uint8Array> {
    const valid = verifyMnemonic(ms); // Verify that the provided mnemonic sentence is valid
    if (valid) return await msToSeedAsync(ms, passphrase); // Create and return a seed if the mnemonic sentence if valid
    else throw new Error(`Invalid mnemonic sentence.`); // Throw an error if verification fails
}
