/**
 * @fileoverview Provides functions for checksum calculation and verification.
 * @author Jacob V. B. Haap <iacobus.xyz>
 * @license MIT
 */

import { sha256 } from "npm:@noble/hashes@1.7.1/sha2";
import { toBitstream, fromBitstream } from "./bitstream.ts";

/**
 * Calculate a checksum for a bitstream string.
 * @example
 * const bits: string = "010000100110111101100101...";
 * const csum = calcCsum(bits); // 0010
 */
export function calcCsum(bits: string): string {
    const ent = BigInt(bits.length); // Get the initial entropy length (ENT)

    // Throw an error if 'ent' is not divisible by 32
    if (ent % 32n !== 0n) {
        throw new Error(`Bitstream invalid length for checksum calculation: ${ent}`);
    }

    const cs = ent / 32n; // Determine checksum length (CS)
    const byteArray = fromBitstream(bits); // Create Uint8Array 'byteArray' from the bitstream
    const hash = sha256(byteArray); // Take a sha256 of 'byteArray'
    const csum = toBitstream(hash).slice(0, Number(cs)); // Extract checksum of length 'cs' from the hash
    return csum; // Return the checksum
}

/**
 * Verify a bitstream string's appended checksum.
 * @example
 * const bits: string = "010000100110111101100101...0010";
 * const verified = verifyCsum(bits); // true
 */
export function verifyCsum(bits: string): boolean {
    const bitLen = BigInt(bits.length); // Get the total ENT + CS length

    // Throw an error if 'bitLen' is not divisible by 33
    if (bitLen % 33n !== 0n) {
        throw new Error(`Bitstream invalid length for checksum verification: ${bitLen}`);
    }

    const entLen = Number((bitLen * 32n) / 33n); // Determine the ENT length
    const entBits = bits.slice(0, entLen); // Isolate initial entropy from checksum
    const csum1 = bits.slice(entLen); // Extract checksum 'csum1'
    const csum2 = calcCsum(entBits); // Recalculate checksum 'csum2' for initial entropy
    return csum1 === csum2; // Check if checksums match
}
