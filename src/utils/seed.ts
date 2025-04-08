/**
 * @fileoverview Provides functions for creating seeds from mnemonic sentences.
 * @author Jacob V. B. Haap <iacobus.xyz>
 * @license MIT
 */

import { type Pbkdf2Opt, pbkdf2, pbkdf2Async } from 'npm:@noble/hashes@1.7.1/pbkdf2';
import { sha512 } from "npm:@noble/hashes@1.7.1/sha2";

/**
 * Create a seed from a mnemonic sentence (synchronous).
 * @example
 * const ms: string = "draw kite fog system improve calm smoke economy cake head figure drastic";
 * const seed = msToSeed(ms); // Uint8Array(64) [174, 41, 10, 203...]
 */
export function msToSeed(ms: string, passphrase?: string): Uint8Array {
    const password = ms.normalize("NFKD"); // Password of the mnemonic sentence (in UTF-8 NFKD)
    const salt = ("mnemonic" + passphrase).normalize("NFKD"); // Salt of "mnemonic" + passphrase (in UTF-8 NFKD)
    const opts: Pbkdf2Opt = { c: 2048, dkLen: 64 }; // Iteration count of 2048, key length of 64 bytes
    return pbkdf2(sha512, password, salt, opts); // Derive with PBKDF2-HMAC-SHA512 and return key
}

/**
 * Create a seed from a mnemonic sentence (asynchronous).
 * @example
 * const ms: string = "draw kite fog system improve calm smoke economy cake head figure drastic";
 * const seed = await msToSeedAsync(ms); // Uint8Array(64) [174, 41, 10, 203...]
 */
export async function msToSeedAsync(ms: string, passphrase?: string): Promise<Uint8Array> {
    const password = ms.normalize("NFKD"); // Password of the mnemonic sentence (in UTF-8 NFKD)
    const salt = ("mnemonic" + passphrase).normalize("NFKD"); // Salt of "mnemonic" + passphrase (in UTF-8 NFKD)
    const opts: Pbkdf2Opt = { c: 2048, dkLen: 64 }; // Iteration count of 2048, key length of 64 bytes
    return await pbkdf2Async(sha512, password, salt, opts); // Derive with PBKDF2-HMAC-SHA512 and return key
}
