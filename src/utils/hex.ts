/**
 * @fileoverview Provides functions for conversion between Uint8Arrays and Hexadecimal strings.
 * @author Jacob V. B. Haap <iacobus.xyz>
 * @license MIT
 */

/**
 * Convert a Uint8Array to a Hexadecimal string.
 * @example
 * const bytes: Uint8Array = Uint8Array.from([11, 19, 13, 17]);
 * const hex = toHex(bytes); // 0b130d11
 */
export function toHex(bytes: Uint8Array): string {
    return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Convert a Hexadecimal string to a Uint8Array.
 * @example
 * const hex: string = "0b130d11";
 * const bytes = fromHex(hex); // Uint8Array(4) [ 11, 19, 13, 17 ]
 */
export function fromHex(hex: string): Uint8Array {
    if (hex.length % 2 !== 0) throw new Error("Invalid hex string");
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
        bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16);
    }
    return bytes;
}
