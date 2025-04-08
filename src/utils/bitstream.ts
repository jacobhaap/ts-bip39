/**
 * @fileoverview Provides functions for conversion between Uint8Arrays and bitstream strings.
 * @author Jacob V. B. Haap <iacobus.xyz>
 * @license MIT
 */

/**
 * Convert from a Uint8Array to a bitstream string.
 * @example
 * const bytes: Uint8Array = Uint8Array.from([9, 8, 7, 6]);
 * const bits = toBitstream(bytes); // 00001001000010000000011100000110
 */
export function toBitstream(bytes: Uint8Array): string {
    return Array.from(bytes).map(byte => byte.toString(2).padStart(8, '0')).join('');
}

/**
 * Convert from a bitstream string to a Uint8Array.
 * @example
 * const bits: string = "00001001000010000000011100000110";
 * const bytes = fromBitstream(bits); // Uint8Array(4) [ 9, 8, 7, 6 ]
 */
export function fromBitstream(bits: string): Uint8Array {
    const ent = bits.length;
    const bytes = new Uint8Array(ent / 8);
    for (let i = 0; i < ent / 8; i++) {
        bytes[i] = parseInt(bits.slice(i * 8, i * 8 + 8), 2);
    }
    return bytes;
}
