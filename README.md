# TypeScript | BIP39 - Iacobus
![NPM Version](https://img.shields.io/npm/v/%40iacobus%2Fbip39) ![GitLab License](https://img.shields.io/gitlab/license/61864089) ![NPM Type Definitions](https://img.shields.io/npm/types/%40iacobus%2Fbip39) ![NPM Unpacked Size](https://img.shields.io/npm/unpacked-size/%40iacobus%2Fbip39)

> An extended implementation of BIP39.

This library supports an extended implementation of the [Bitcoin Improvement Proposal 39](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki), *Mnemonic code for generating deterministic keys*. **TypeScript**, **ESM**, and **CommonJS** compatible. To get started, install the library:
```bash
# Deno
deno add jsr:@iacobus/bip39

# Node.js
npm install @iacobus/bip39
```

**Important Note:** As an extended implementation of BIP39, the `toMnemonic` function of **@iacobus/bip39** supports an optional ***ext*** parameter, that when *true*, permits any initial entropy length that does not exceed 8192 bits, and will generate mnemonic sentences that fall outside the scope of the proposal. When ***ext*** is *undefined* or *false*, only mnemonic sentences within the scope of the proposal may be generated.

# BIP39
TypeScript/ESM import:
```ts
import * as bip39 from "@iacobus/bip39";
```

CommonJS require:
```js
const bip39 = require("@iacobus/bip39");
```

The **@iacobus/bip39** entry point exports functions for mnemonic sentence generation, verification, conversion of mnemonic sentences back to initial entropy, and seed creation. Every function of this entry point requires a wordlist be provided, with the following [BIP39 wordlists](https://github.com/bitcoin/bips/blob/master/bip-0039/bip-0039-wordlists.md) available in this library:
 - **English**, imported as ***english***.
 - **Chinese (Simplified)** imported as ***chinese_simplified***.
 - **Chinese (Traditional)** imported as ***chinese_traditional***.
 - **Czech**, imported as ***czech***.
 - **French**, imported as ***french***.
 - **Italian**, imported as ***italian***.
 - **Japanese**, imported as ***japanese***.
 - **Korean**, imported as ***korean***.
 - **Portuguese**, imported as ***portuguese***.
 - **Spanish**, imported as ***spanish***.

Every supported wordlist is available under its own entry point, following the pattern `@iacobus/bip39/wordlist/{wordlist_name}`. As an example, the English wordlist may be imported as follows:
```ts
import { english } from "@iacobus/bip39/wordlist/english";
```

## Mnemonic Sentence Generation
Two functions are available for mnemonic sentence generation. One supports the creation of random mnemonic sentences, and the other supports the creation of mnemonic sentences from supplied entropy.

### generateMnemonic
A random mnemonic sentence is generated from cryptographically secure entropy obtained internally from the *randomBytes* util of [**@noble/hashes**](https://github.com/paulmillr/noble-hashes?tab=readme-ov-file#utils), using the `generateMnemonic` function.

The *generateMnemonic* function has two input parameters:
```js
function generateMnemonic(wordlist, msLen) {};
```
Where:
 - ***wordlist*** is a BIP39 wordlist (*e.g. the English wordlist*).
 - ***msLen*** is the length of the mnemonic sentence.

The ***wordlist*** parameter is expected as an *array (string[])* containing 2048 words, and the ***msLen*** parameter is expected as a *number*, corresponding to the length of the mnemonic sentence as a number of words (12, 15, 18, 21, or 24). The *generateMnemonic* function is synchronous, and returns a *string*.

*Example use:*
```ts
import { generateMnemonic } from "@iacobus/bip39";
import { english } from "@iacobus/bip39/wordlist/english";

const ms = generateMnemonic(english, 12); // word breeze hope phrase year road nature copy face forest tumble coin
```

### toMnemonic
A mnemonic sentence from supplied entropy is generated using the `toMnemonic` function.

The *toMnemonic* function has three input parameters:
```js
function toMnemonic(wordlist, ent, ext?) {};
```
Where:
 - ***wordlist*** is a BIP39 wordlist (*e.g. the English wordlist*).
 - ***ent*** is initial entropy (*raw entropy without a checksum applied*).
 - ***ext*** is an optional value to enable the extended implementation.

The ***wordlist*** parameter is expected as an *array (string[])* containing 2048 words, the ***ent*** parameter is expected as a *Uint8Array* of the initial entropy, and the ***ext*** parameter is expected as a *boolean* value, that when *true* enables the extended implementation of BIP39. When enabled, any initial entropy length that does not exceed 8192 bits is supported, padding is applied to the initial entropy when it is not suitable for mnemonic sentence generation as supplied, and sentences at lengths other than 12, 15, 18, 21, and 24 words may be generated. The *toMnemonic* function is synchronous, and returns a string.

*Example use, non-extended:*
```ts
import { toMnemonic } from "@iacobus/bip39";
import { english } from "@iacobus/bip39/wordlist/english";

const ent: Uint8Array = Uint8Array.from([66, 111, 101, 105, 110, 103, 32, 65, 51, 50, 49, 32, 77, 65, 88, 33]);
const ms = toMnemonic(english, ent); // draw kite fog system improve calm smoke economy cake head figure drastic
```

## Mnemonic Sentence Verification
Mnemonic sentences are verified for validity via the verification of their appended checksums, using the `verifyMnemonic` function.

The *verifyMnemonic* function has two input parameters:
```js
function verifyMnemonic(wordlist, ms) {};
```
Where:
 - ***wordlist*** is a BIP39 wordlist (*e.g. the English wordlist*).
 - ***ms*** is a mnemonic sentence.

The ***wordlist*** parameter is expected as an *array (string[])* containing 2048 words, and the ***ms*** parameter expects a mnemonic sentence as a *string*. The *verifyMnemonic* function is synchronous, and returns the verification result as a *boolean* value.

*Example use:*
```ts
import { verifyMnemonic } from "@iacobus/bip39";
import { english } from "@iacobus/bip39/wordlist/english";

const ms: string = "draw kite fog system improve calm smoke economy cake head figure drastic";
const verified = verifyMnemonic(english, ms); // true
```

## Mnemonic Sentence to Entropy
A mnemonic sentence can be converted back to the initial entropy (as a bitstream string) from which it was generated using the `fromMnemonic` function.

The *fromMnemonic* function has two input parameters:
```js
function fromMnemonic(wordlist, ms) {};
```
Where:
 - ***wordlist*** is a BIP39 wordlist (*e.g. the English wordlist*).
 - ***ms*** is a mnemonic sentence.

The ***wordlist*** parameter is expected as an *array (string[])* containing 2048 words, and the ***ms*** parameter expects a mnemonic sentence as a *string*. The *fromMnemonic* function is synchronous, and returns a Uint8Array.

*Example use:*
```ts
const { fromMnemonic } = require("@iacobus/bip39");
const { english } = require("@iacobus/bip39/wordlist/english");

const ms: string = "draw kite fog system improve calm smoke economy cake head figure drastic";
const ent = fromMnemonic(english, ms); // Uint8Array(16) [66, 111, 101, 105, 110, 103, 32, 65, 51, 50, 49, 32, 77, 65, 88, 33]
```

## Creating a Seed
A 64 byte seed can be created from a mnemonic sentence and optional passphrase using the `createSeed` function. An asynchronous version of this function also exists, as the `createSeedAsync` function. For demonstration purposes, the synchronous version will be used.

The *createSeed* function has three input parameters:
```js
function createSeed(wordlist, ms, passphrase?) {};
```
Where:
 - ***wordlist*** is a BIP39 wordlist (*e.g. the English wordlist*).
 - ***ms*** is a mnemonic sentence.
 - ***passphrase*** is an optional passphrase.

The ***wordlist*** parameter is expected as an *array (string[])* containing 2048 words, the ***ms*** parameter expects a mnemonic sentence as a *string*, and the optional ***passphrase*** parameter expects a passphrase as a *string*. The *createSeed* function is synchronous, and returns a *Uint8Array*. The *createSeedAsync* function is asynchronous, and returns a Promise that resolves to a *Uint8Array*.

Example use, without a passphrase:
```ts
import { createSeed } from "@iacobus/bip39";
import { english } from "@iacobus/bip39/wordlist/english";

const ms: string = "draw kite fog system improve calm smoke economy cake head figure drastic";
const seed = createSeed(english, ms);

/*
Uint8Array(64) [
  253,  45, 107, 175, 229, 231, 200, 244, 219, 156,
  214, 195,  80, 123, 225, 239,  74, 191, 246, 248,
  124, 112, 215,  56, 230, 179, 228, 122, 213, 131,
  223, 214, 162, 143,  65, 209,  58,  65, 155, 186,
  174,  37,  33,  27,  13, 218,  11, 124, 237, 231,
  165, 224, 183, 218,  60,  70, 238, 138,  62, 205,
   18, 148,  30, 121
]
*/
```

# BIP39 Lite
TypeScript/ESM import:
```ts
import * as bip39 from "@iacobus/bip39/lite";
```

CommonJS require:
```js
const bip39 = require("@iacobus/bip39/lite");
```
The **@iacobus/bip39/lite** entry point exports lite functions for mnemonic generation, verification, and seed creation. Lite denotes that these functions are more minimal than those of the **@iacobus/bip39** entry point, with the main distinction being that the lite functions do not accept a ***wordlist*** parameter, instead only using the English wordlist. This aims to provide a simple "one stop" option for core functionality.

## Mnemonic Sentence Generation
Mnemonic sentences can be generated with internally obtained or supplied entropy using the `generateMnemonic` function. This acts as a combination of the `generateMnemonic` and `toMnemonic` (without the ***ext*** option) functions from the **@iacobus/bip39** entry point.

The *generateMnemonic* function has two input parameters:
```js
function generateMnemonic(msLen, ent?) {};
```
Where:
 - ***msLen*** is the length of the mnemonic sentence.
 - ***ent*** is the optional initial entropy (*raw entropy without a checksum applied*).

The ***msLen*** parameter is expected as a *number*, corresponding to the length of the mnemonic sentence as a number of words (12, 15, 18, 21, or 24), and the optional ***ent*** parameter is expected as a *Uint8Array* of the initial entropy. The *generateMnemonic* function is synchronous, returning a *string*.

*Example use, with entropy provided:*
```ts
import { generateMnemonic } from "@iacobus/bip39/lite";

const ent: Uint8Array = Uint8Array.from([66, 111, 101, 105, 110, 103, 32, 65, 51, 50, 49, 32, 77, 65, 88, 33]);
const ms = generateMnemonic(12, ent); // draw kite fog system improve calm smoke economy cake head figure drastic
```

## Other Lite Functions
The remainder of the functions from the **@iacobus/bip39/lite** entry point are near identical to those from the **@iacobus/bip39** entry point, with the only difference being the lack of a ***wordlist*** parameter. Internally, they are exactly the same. They replace the need to obtain a wordlist from a parameter with direct use of the English wordlist. For this reason, example use of these functions is not needed, as their use mirrors the non-lite functions of the same name, just with the ***wordlist*** parameter removed.

*Verifying a mnemonic sentence:*
```ts
function verifyMnemonic(ms: string): boolean {};
```

*Creating a seed:*
```ts
// Synchronous
function createSeed(ms: string, passphrase?: string): Uint8Array {};

// Asynchronous
async function createSeedAsync(ms: string, passphrase?: string): Promise<Uint8Array> {};
```

# Utilities
TypeScript/ESM import:
```ts
import * as utils from "@iacobus/bip39/utils";
```

CommonJS require:
```js
const utils = require("@iacobus/bip39/utils");
```
BIP39 utility functions are available under the **@iacobus/bip39/utils** entry point. This includes functionality for bitstream conversion, checksum calculation & verification, entropy padding, mnemonic sentence conversion, and the creation of seeds from mnemonic sentences.

## Bitstream String Conversion
Two functions are included for the conversion between **Uint8Arrays** and **Bitstream Strings**. The `toBitstream` function accepts a *Uint8Array* and returns a bitstream *string*, and the `fromBitstream` function accepts a bitstream *string* and returns a *Uint8Array*.

*Convert from a Uint8Array to a bitstream string:*
```ts
import { toBitstream } from "@iacobus/bip39/utils";

const bytes: Uint8Array = Uint8Array.from([9, 8, 7, 6]);
const bits = toBitstream(bytes); // 00001001000010000000011100000110
```

*Convert from a bitstream string to a Uint8Array:*
```ts
import { fromBitstream } from "@iacobus/bip39/utils";

const bits: string = "00001001000010000000011100000110";
const bytes = fromBitstream(bits); // Uint8Array(4) [ 9, 8, 7, 6 ]
```

## Checksum Calculation & Verification
Two functions are included for **Bitstream String** checksum calculation and verification of appended checksums. The `calcCsum` function accepts a bitstream *string* and returns a bitstream *string* of the checksum, and the `verifyCsum` function accepts a bitstream *string* and returns the verification result as a *boolean* value.

*Calculate a checksum:*
```ts
import { calcCsum } from "@iacobus/bip39/utils";

const bits: string = "01000010011011110110010101101001011011100110011100100000010000010011001100110010001100010010000001001101010000010101100000100001"
const csum = calcCsum(bits); // 0010
```

*Verify an appended checksum:*
```ts
import { verifyCsum } from "@iacobus/bip39/utils";

const bits: string = "010000100110111101100101011010010110111001100111001000000100000100110011001100100011000100100000010011010100000101011000001000010010"
const verified = verifyCsum(bits); // true
```

## Padding
Two functions are included for applying padding to **Uint8Arrays** and **Bitstream Strings**. The `padBytes` function accepts a *Uint8Array* and returns a padded *Uint8Array*, padding to reach a permitted initial entropy length (ENT), so that `ENT / 32` can yield an integer `CS`, and that `ENT + CS` are a multiple of 11. The `padBits` function accepts a bitstream *string* and returns a padded bitstream *string*, padding to reach a multiple of 11.

*Apply padding to a Uint8Array:*
```ts
import { padBytes } from "@iacobus/bip39/utils";

const ent: Uint8Array = Uint8Array.from([68, 105, 110, 111, 115, 97, 117, 114, 115]);
const padded = padBytes(ent); // Uint8Array(12) [68, 105, 110, 111, 115, 97, 117, 114, 115, 0, 0, 0]
```

*Apply padding to a bitstream string:*
```ts
import { padBitstream } from "@iacobus/bip39/utils";

const ent: string = "010001000110100101101110011011110111001101100001011101010111001001110011";
const padded = padBitstream(ent); // 01000100011010010110111001101111011100110110000101110101011100100111001100000
```

## Mnemonic Sentence Conversion
Two functions are included for the conversion between **Bitstream Strings** and **Mnemonic Sentences**. The `bitstreamToMs` function accepts a bitstream *string* and returns a mnemonic sentence *string*, and the `msToBitstream` function accepts a mnemonic sentence *string* and returns a bitstream *string*. Unlike the mnemonic generation functions of the **@iacobus/bip39** and **@iacobus/bip39/lite** entry points, no internal validation takes place before returning the mnemonic sentence from the `bitstreamToMs` function.

*Convert from a bitstream string to a mnemonic sentence:*
```ts
import { bitstreamToMs } from "@iacobus/bip39/utils";
import { english } from "@iacobus/bip39/wordlist/english";

const bits: string = "01000010011011110110010101101001011011100110";
const ms = bitstreamToMs(english, bits); // draw kite fog system
```

*Convert from a mnemonic sentence to a bitstream string:*
```ts
import { msToBitstream } from "@iacobus/bip39/utils";
import { english } from "@iacobus/bip39/wordlist/english";

const ms: string = "draw kite fog system";
const bits = msToBitstream(english, ms); // 01000010011011110110010101101001011011100110
```

## Creating a Seed
A 64 byte seed can be created from a mnemonic sentence and optional passphrase using the `msToSeed` function. An asynchronous version of this function also exists, as the `msToSeedAsync` function. Unlike the `createSeed` and `createSeedAsync` functions of the **@iacobus/bip39** and **@iacobus/bip39/lite** entry points, no internal validation takes place.

*Create a seed (synchronous):*
```ts
import { msToSeed } from "@iacobus/bip39/utils";

const ms: string = "draw kite fog system improve calm smoke economy cake head figure drastic";
const seed = msToSeed(ms); // Uint8Array(64) [253, 45, 107, 175...]
```

*Create a seed (asynchronous):*
```ts
import { msToSeedAsync } from "@iacobus/bip39/utils";

const ms: string = "draw kite fog system improve calm smoke economy cake head figure drastic";
const seed = await msToSeedAsync(ms); // Uint8Array(64) [253, 45, 107, 175...]
```
