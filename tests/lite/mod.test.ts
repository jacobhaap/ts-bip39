/**
 * @fileoverview Test script for the exports of the @iacobus/bip39/lite entry point.
 * @author Jacob V. B. Haap <iacobus.xyz>
 * @license MIT
 */

import { verifyMnemonic, generateMnemonic, createSeed, createSeedAsync } from "../../src/lite/mod.ts";
import { toHex } from "../../src/utils/hex.ts";

/**
 * Test for 'verifyMnemonic' lite function.
 * 
 * Uses a sample mnemonic sentence to pass to the verification function, assigning the boolean
 * verification result to the 'verified' const.
 * 
 * Console.assert checks that 'verified' is true.
 */
Deno.test(`Lite function 'verifyMnemonic' verifies a valid mnemonic sentence`, () => {
    const ms: string = "draw kite fog system improve calm smoke economy cake head figure drastic"; // Define mnemonic sentence
    const verified = verifyMnemonic(ms); // Verify the mnemonic sentence
    console.assert(verified, `Lite function 'verifyMnemonic' failed to verify a valid mnemonic sentence`);
});

/**
 * Test for 'generateMnemonic' lite function.
 * 
 * Creates a Uint8Array of 16 bytes to generates a mnemonic sentence with an 'msLen' of 12.
 * Assigns the expected result to a 'control' const.
 * 
 * Console.assert checks that the mnemonic sentence matches the control.
 */
Deno.test(`Lite function 'generateMnemonic' generates a mnemonic sentence`, () => {
    const ent: Uint8Array = Uint8Array.from([66, 111, 101, 105, 110, 103, 32, 65, 51, 50, 49, 32, 77, 65, 88, 33]); // Define Uint8Array
    const ms = generateMnemonic(12, ent); // Generate a 12 word mnemonic sentence from 'ent'
    const control = "draw kite fog system improve calm smoke economy cake head figure drastic"; // Expected mnemonic sentence as the control
    console.assert(ms === control, `Lite function 'generateMnemonic' failed to generate a mnemonic sentence`);
});

/**
 * Test for 'createSeed' lite function (synchronous).
 * 
 * Creates a 64 byte seed from a mnemonic sentence. Assigns the expected seed to a 'control' const as a hex string.
 * 
 * Console.assert checks that the seed (converted to hex) matches the control.
 */
Deno.test(`Lite function 'createSeed' creates a seed from a mnemonic sentence (synchronous)`, () => {
    const ms: string = "draw kite fog system improve calm smoke economy cake head figure drastic"; // Define mnemonic sentence
    const seed = createSeed(ms); // Create seed from mnemonic sentence
    // Expected seed represented as a hex string as the control
    const control = "ae290acb10004461d3e3c07c4e534a6619e68524f401bdbcaa8f0d6c02509645cb2221aaf238578c59c218e090662ba326d8182839a20499404c6a8431a430ed";
    console.assert(toHex(seed) === control, `Lite function 'createSeed' failed to create a seed from a mnemonic sentence`);
});

/**
 * Test for 'createSeedAsync' lite function (asynchronous).
 * 
 * Creates a 64 byte seed from a mnemonic sentence. Assigns the expected seed to a 'control' const as a hex string.
 * 
 * Console.assert checks that the seed (converted to hex) matches the control.
 */
Deno.test(`Lite function 'createSeedAsync' creates a seed from a mnemonic sentence (asynchronous)`, async () => {
    const ms: string = "draw kite fog system improve calm smoke economy cake head figure drastic"; // Define mnemonic sentence
    const seed = await createSeedAsync(ms); // Create seed from mnemonic sentence
    // Expected seed represented as a hex string as the control
    const control = "ae290acb10004461d3e3c07c4e534a6619e68524f401bdbcaa8f0d6c02509645cb2221aaf238578c59c218e090662ba326d8182839a20499404c6a8431a430ed";
    console.assert(toHex(seed) === control, `Lite function 'createSeedAsync' failed to create a seed from a mnemonic sentence`);
});
