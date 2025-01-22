import { bip39 } from "../src/mod.ts";
import { Buffer } from "node:buffer";

Deno.test("bip39.wordlist has valid wordlists", () => {
    const czech = bip39.wordlist.czech;
    const english = bip39.wordlist.english;
    const french = bip39.wordlist.french;
    const italian = bip39.wordlist.italian;
    const portuguese = bip39.wordlist.portuguese;
    const spanish = bip39.wordlist.spanish;
    console.assert(!!czech, "Czech wordlist invalid/undefined");
    console.assert(!!english, "English wordlist invalid/undefined");
    console.assert(!!french, "French wordlist invalid/undefined");
    console.assert(!!italian, "Italian wordlist invalid/undefined");
    console.assert(!!portuguese, "Portuguese wordlist invalid/undefined");
    console.assert(!!spanish, "Spanish wordlist invalid/undefined");
});

Deno.test("bip39.core functionality", () => {
    const entropy: string = "01000010011011110110010101101001011011100110011100100000010000010011001100110010001100010010000001001101010000010101100000100001";
    const mnemonic: string = bip39.core.toMnemonic(bip39.wordlist.english, entropy);
    const valid: boolean = bip39.core.validate(bip39.wordlist.english, mnemonic);
    console.assert(!!mnemonic, "Core mnemonic generation failed");
    console.assert(valid === true, "Core mnemonic failed validation");
});

Deno.test("bip39.ext functionality", () => {
    const ent: string = "0101100101101111011101010010000001101010011101010111001101110100001000000110110001101111011100110111010000100000011101000110100001100101001000000110011101100001011011010110010100100";
    const entropy: string = bip39.ent.checksum(ent, 6);
    const mnemonic: string = bip39.ext.toMnemonic(bip39.wordlist.english, entropy);
    const valid: boolean = bip39.ext.validate(bip39.wordlist.english, mnemonic, 6);
    console.assert(!!mnemonic, "Extended mnemonic generation failed");
    console.assert(valid === true, "Extended mnemonic failed validation");
});

Deno.test("bip39.ent checksum & verification", () => {
    const ent: string = "01000010011011110110010101101001011011100110011100";
    const withChecksum: string = bip39.ent.checksum(ent, 5);
    const verify: boolean = bip39.ent.verify(withChecksum, 5);
    console.assert(!!withChecksum, "Checksum calculation failed");
    console.assert(verify === true, "Checksum verification failed");
});

Deno.test("bip39.ent data conversions", () => {
    const str: string = "Between the click of the light and the start of the dream";
    const buf: Buffer = Buffer.from('Greetings Fellow Human', 'utf8');
    const uint8Array: Uint8Array = new TextEncoder().encode('Nothing Matters :)');
    const hex: string = "4265747765656E2074686520636C69636B206F6620746865206C6967687420616E6420746865207374617274206F662074686520647265616D";
    console.assert(!!bip39.ent.fromString(str), "String conversion failed");
    console.assert(!!bip39.ent.fromBuffer(buf), "Buffer conversion failed");
    console.assert(!!bip39.ent.fromUint8Array(uint8Array), "Uint8Array conversion failed");
    console.assert(!!bip39.ent.fromHex(hex), "Hex conversion failed");
});
