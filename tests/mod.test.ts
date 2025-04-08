/**
 * @fileoverview Test script for the exports of the @iacobus/bip39 entry point.
 * @author Jacob V. B. Haap <iacobus.xyz>
 * @license MIT
 */

import { vectors } from "./vectors.ts";
import { fromHex, toHex } from "../src/utils/hex.ts";
import { verifyMnemonic, generateMnemonic, toMnemonic, fromMnemonic, createSeed, createSeedAsync } from "../src/mod.ts";

// Import all wordlists
import { english } from "../src/wordlists/english.ts";
import { chinese_simplified } from "../src/wordlists/chinese_simplified.ts";
import { chinese_traditional } from "../src/wordlists/chinese_traditional.ts";
import { czech } from "../src/wordlists/czech.ts";
import { french } from "../src/wordlists/french.ts";
import { italian } from "../src/wordlists/italian.ts";
import { japanese } from "../src/wordlists/japanese.ts";
import { korean } from "../src/wordlists/korean.ts";
import { portuguese } from "../src/wordlists/portuguese.ts";
import { spanish } from "../src/wordlists/spanish.ts";

/** All wordlists as listed in the BIP39 spec. */
const wordlists: Record<string, string[]> = {
    english,
    chinese_simplified,
    chinese_traditional,
    czech,
    french,
    italian,
    japanese,
    korean,
    portuguese,
    spanish
}

/**
 * Test for 'verifyMnemonic' function.
 * 
 * Iterates over all mnemonic sentences from the test vectors, for each using the corresponding wordlist
 * to complete the verification. The boolean verification result of each iteration is assigned
 * to the 'valid' const.
 * 
 * Console.assert checks that 'valid' is true.
 */
Deno.test(`Function 'verifyMnemonic' verifies valid mnemonic sentences`, () => {
    for (const [lang, tests] of Object.entries(vectors)) { // Iterate over each language and its test vectors
        const wordlist = wordlists[lang]; // Select the wordlist for the current language
        for (const [, ms] of tests) { // Use the mnemonic sentence 'ms' from each test vector
            const valid = verifyMnemonic(wordlist, ms); // Verify the validity of 'ms' with 'verifyMnemonic'
            console.assert(valid, `Mnemonic failed validation: ${ms}`);
        }
    }
});

/**
 * Test for 'generateMnemonic' function.
 * 
 * Using the English wordlist, iterates over valid mnemonic sentence lengths to generate random mnemonic sentences.
 * 
 * Console.assert checks that 'ms' is a type of string.
 */
Deno.test(`Function 'generateMnemonic' generates a random mnemonic sentence`, () => {
    const lengths = [ 12, 15, 18, 21, 24 ]; // Define valid mnemonic sentence lengths
    for (const msLen of lengths) { // Iterate over valid mnemonic sentence lengths
        const ms = generateMnemonic(wordlists.english, msLen); // Generate a random English mnemonic sentence
        console.assert(typeof ms === 'string', `Invalid sentence generated, 'generateMnemonic' must return a string`);
    }
});

/**
 * Test for 'toMnemonic' function.
 * 
 * Iterates over all hexadecimal entropy and mnemonic sentences from the test vectors, for each using the
 * corresponding wordlist to generate a mnemonic sentence for the given hexadecimal entropy.
 * 
 * Console.assert checks that the newly generated mnemonic sentence matches the vector mnemonic sentence.
 */
Deno.test(`Function 'toMnemonic' generates mnemonic sentences`, () => {
    for (const [lang, tests] of Object.entries(vectors)) { // Iterate over each language and its test vectors
        const wordlist = wordlists[lang]; // Select the wordlist for the current language
        for (const [hex, vectorMs] of tests) { // Use the entropy 'hex' and mnemonic sentence 'vectorMs' from each test vector
            const ent = fromHex(hex); // Convert the entropy to a Uint8Array 'ent'
            const ms = toMnemonic(wordlist, ent); // Generate a mnemonic sentence from 'ent' using the current language wordlist
            console.assert(ms === vectorMs, `Mismatch in ${lang}: expected "${vectorMs}", got "${ms}"`);
        }
    }
});

/**
 * Test for 'fromMnemonic' function.
 * 
 * Iterates over all hexadecimal entropy and mnemonic sentences from the test vectors, for each using the
 * corresponding wordlist to convert the mnemonic sentence back to entropy, then converting the reobtained
 * entropy from a Uint8Array to a hexadecimal string.
 * 
 * Console.assert checks that the reobtained entropy matches the vector hexadecimal entropy.
 */
Deno.test(`Function 'fromMnemonic' converts mnemonic sentences to entropy`, () => {
    for (const [lang, tests] of Object.entries(vectors)) { // Iterate over each language and its test vectors
        const wordlist = wordlists[lang]; // Select the wordlist for the current language
        for (const [vectorHex, ms] of tests) { // Use entropy 'vectorHex' and mnemonic sentence 'ms' from each test vector
            const ent = fromMnemonic(wordlist, ms); // Convert 'ms' to entropy 'ent'
            const hex = toHex(ent); // Convert 'ent' Uint8Array to hex string
            console.assert(hex === vectorHex, `Mismatch in ${lang}: expected "${vectorHex}", got "${hex}"`);
        }
    }
});

/**
 * Test for 'createSeed' function.
 * 
 * Iterates over all mnemonic sentences and seeds from the test vectors, for each using the corresponding wordlist
 * to create a 64 byte seed from the mnemonic sentence, using a passphrase of "TREZOR".
 * 
 * Console.assert checks that the created seed matches the vector seed.
 */
Deno.test(`Function 'createSeed' creates seeds from mnemonic sentences`, () => {
    for (const [lang, tests] of Object.entries(vectors)) { // Iterate over each language and its test vectors
        const wordlist = wordlists[lang]; // Select the wordlist for the current language
        for (const [, ms, vectorSeed] of tests) { // Use mnemonic sentence 'ms' and seed 'vectorSeed' from each test vector
            const seed = createSeed(wordlist, ms, "TREZOR"); // Create a seed from 'ms' with a passphrase of "TREZOR"
            const hexSeed = toHex(seed); // Convert the seed to a hexadecimal string
            console.assert(hexSeed === vectorSeed, `Mismatch in ${lang}: expected "${vectorSeed}", got "${hexSeed}"`);
        }
    }
});

/**
 * Test for 'createSeedAsync' function.
 * 
 * Iterates over all mnemonic sentences and seeds from the test vectors, for each using the corresponding wordlist
 * to create a 64 byte seed from the mnemonic sentence, using a passphrase of "TREZOR".
 * 
 * Console.assert checks that the created seed matches the vector seed.
 */
Deno.test(`Function 'createSeedAsync' creates seeds from mnemonic sentences`, async () => {
    for (const [lang, tests] of Object.entries(vectors)) { // Iterate over each language and its test vectors
        const wordlist = wordlists[lang]; // Select the wordlist for the current language
        for (const [, ms, vectorSeed] of tests) { // Use mnemonic sentence 'ms' and seed 'vectorSeed' from each test vector
            const seed = await createSeedAsync(wordlist, ms, "TREZOR"); // Create a seed from 'ms' with a passphrase of "TREZOR"
            const hexSeed = toHex(seed); // Convert the seed to a hexadecimal string
            console.assert(hexSeed === vectorSeed, `Mismatch in ${lang}: expected "${vectorSeed}", got "${hexSeed}"`);
        }
    }
});
