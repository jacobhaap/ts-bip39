/**
 * @fileoverview Test script for the exports of the @iacobus/bip39/utils entry point.
 * @author Jacob V. B. Haap <iacobus.xyz>
 * @license MIT
 */

import { bytesToHex } from "npm:@noble/hashes@1.7.1/utils";
import {
    toBitstream, fromBitstream, calcCsum, verifyCsum, padBytes,
    padBitstream, bitstreamToMs, msToBitstream, msToSeed, msToSeedAsync
} from "../../src/utils/mod.ts";

/** Use the English wordlist for mnemonic sentence tests */
import { english } from "../../src/wordlists/english.ts";

// Test for 'toBitstream' util function.
// Converts a Uint8Array to a bitstream string. Assigns the expected result to a 'control' const.
// console.assert checks that the bitstream matches the control.
Deno.test(`Util function 'toBitstream' converts a Uint8Array to a bitstream`, () => {
    const bytes: Uint8Array = Uint8Array.from([9, 8, 7, 6]); // Define Uint8Array
    const bits = toBitstream(bytes); // Convert Uint8Array to bitstream
    const control = "00001001000010000000011100000110"; // Expected conversion result as the control
    console.assert(bits === control, `Util function 'toBitstream' failed to convert a Uint8Array to a bitstream`);
});

// Test for 'fromBitstream' util function.
// Converts a bitstream string to a Uint8Array. Assigns the expected result to a 'control' const.
// console.assert checks that the Uint8Array matches the control.
Deno.test(`Util function 'fromBitstream' converts a bitstream to a Uint8Array`, () => {
    const bits: string = "00001001000010000000011100000110"; // Define bitstream string
    const bytes = fromBitstream(bits); // Convert bitstream to Uint8Array
    const control = Uint8Array.from([9, 8, 7, 6]); // Expected conversion result as the control
    console.assert(bytes.every((byte, i) => byte === control[i]), `Util function 'fromBitstream' failed to convert a bitstream to a Uint8Array`);
});

// Test for 'calcCsum' util function.
// Calculate a checksum for a bitstream string. Assigns the expected checksum to a 'control' const.
// console.assert checks that the calculated checksum matches the control.
Deno.test(`Util function 'calcCsum' calculates a checksum`, () => {
    // Define bitstream string
    const bits: string = "01000010011011110110010101101001011011100110011100100000010000010011001100110010001100010010000001001101010000010101100000100001";
    const csum = calcCsum(bits); // Calculate checksum for the bitstream
    const control = "0010"; // Expected checksum as the control
    console.assert(csum === control, `Util function 'calcCsum' failed to calculate a checksum`);
});

// Test for 'verifyCsum' util function.
// Verifies the checksum appended to a bitstream string.
// console.assert checks that the verification result is 'true'.
Deno.test(`Util function 'verifyCsum' verifies an appended checksum`, () => {
    // Define bitstream string with an appended checksum
    const bits: string = "010000100110111101100101011010010110111001100111001000000100000100110011001100100011000100100000010011010100000101011000001000010010";
    const verified = verifyCsum(bits); // Verify the bitstream's appended checksum
    console.assert(verified === true, `Util function 'verifyCsum' failed to verify an appended checksum`);
});

// Test for 'padBytes' util function.
// Applies padding to a Uint8Array to pad to an accepted initial entropy length. Assigns the expected padded Uint8Array
// to a 'control' const.
// console.assert checks that the padded Uint8Array matches the control.
Deno.test(`Util function 'padBytes' applies padding to initial entropy (Uint8Array)`, () => {
    const ent: Uint8Array = Uint8Array.from([68, 105, 110, 111, 115, 97, 117, 114, 115]); // Create Uint8Array
    const padded = padBytes(ent); // Apply padding to the Uint8Array
    const control = Uint8Array.from([68, 105, 110, 111, 115, 97, 117, 114, 115, 0, 0, 0]); // Expected padded Uint8Array as the control
    console.assert(padded.every((byte, i) => byte === control[i]), `Util function 'padBytes' failed to apply padding to initial entropy`);
});

// Test for 'padBitstream' util function.
// Applies padding to a bitstream string to pad to an accepted initial entropy length. Assigns the expected padded bitstream
// to a 'control' const.
// console.assert checks that the padded bitstream matches the control.
Deno.test(`Util function 'padBitstream' applies padding to initial entropy (bitstream)`, () => {
    const ent: string = "010001000110100101101110011011110111001101100001011101010111001001110011"; // Define bitstream string
    const padded = padBitstream(ent); // Apply padding to the bitstream
    const control = "01000100011010010110111001101111011100110110000101110101011100100111001100000"; // Expected padded bitstream as the control
    console.assert(padded === control, `Util function 'padBitstream' failed to apply padding to initial entropy`);
});

// Test for 'bitstreamToMs' util function.
// Converts a bitstream string to a mnemonic sentence. Assigns the expected mnemonic sentence to a 'control' const.
// console.assert checks that the mnemonic sentence matches the control.
Deno.test(`Util function 'bitstreamToMs' converts a bitstream to a mnemonic sentence`, () => {
    const bits: string = "01000010011011110110010101101001011011100110"; // Define bitstream string
    const ms = bitstreamToMs(english, bits); // Convert to mnemonic sentence using the English wordlist
    const control = "draw kite fog system"; // Expected mnemonic sentence as the control
    console.assert(ms === control, `Util function 'bitstreamToMs' failed to convert a bitstream to a mnemonic sentence`);
});

// Test for 'msToBitstream' util function.
// Converts a mnemonic sentence to a bitstream string. Assigns the expected bitstream to a 'control' const.
// console.assert checks that the bitstream string matches the control.
Deno.test(`Util function 'msToBitstream' converts a mnemonic sentence to bitstream`, () => {
    const ms: string = "draw kite fog system"; // Define mnemonic sentence
    const bits = msToBitstream(english, ms); // Convert to bitstream using the English wordlist
    const control = "01000010011011110110010101101001011011100110"; // Expected bitstream as the control
    console.assert(bits === control, `Util function 'msToBitstream' failed to convert a mnemonic sentence to bitstream`);
});

// Test for 'msToSeed' util function (synchronous).
// Creates a 64 byte seed from a mnemonic sentence. Assigns the expected seed to a 'control' const as a hex string.
// console.assert checks that the seed (converted to hex) matches the control.
Deno.test(`Util function 'msToSeed' creates a seed from a mnemonic sentence (synchronous)`, () => {
    const ms: string = "draw kite fog system improve calm smoke economy cake head figure drastic"; // Define mnemonic sentence
    const seed = msToSeed(ms); // Create seed from mnemonic sentence
    // Expected seed represented as a hex string as the control
    const control = "fd2d6bafe5e7c8f4db9cd6c3507be1ef4abff6f87c70d738e6b3e47ad583dfd6a28f41d13a419bbaae25211b0dda0b7cede7a5e0b7da3c46ee8a3ecd12941e79";
    console.assert(bytesToHex(seed) === control, `Util function 'msToSeed' failed to create a seed from a mnemonic sentence`);
});

// Test for 'msToSeed' util function (asynchronous).
// Creates a 64 byte seed from a mnemonic sentence. Assigns the expected seed to a 'control' const as a hex string.
// console.assert checks that the seed (converted to hex) matches the control.
Deno.test(`Util function 'msToSeedAsync' creates a seed from a mnemonic sentence (asynchronous)`, async () => {
    const ms: string = "draw kite fog system improve calm smoke economy cake head figure drastic"; // Define mnemonic sentence
    const seed = await msToSeedAsync(ms); // Create seed from mnemonic sentence
    // Expected seed represented as a hex string as the control
    const control = "fd2d6bafe5e7c8f4db9cd6c3507be1ef4abff6f87c70d738e6b3e47ad583dfd6a28f41d13a419bbaae25211b0dda0b7cede7a5e0b7da3c46ee8a3ecd12941e79";
    console.assert(bytesToHex(seed) === control, `Util function 'msToSeedAsync' failed to create a seed from a mnemonic sentence`);
});
