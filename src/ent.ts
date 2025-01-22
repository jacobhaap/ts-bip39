import type { Buffer } from "node:buffer";

export function entFromString(str: string): string {
    return str.split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join('');
};

export function entFromBuffer(buf: Buffer): string {
    return Array.from(buf as Uint8Array).map((byte: number) => byte.toString(2).padStart(8, '0')).join('');
};

export function entFromUint8Array(uint8Array: Uint8Array): string {
    return Array.from(uint8Array).map(byte => byte.toString(2).padStart(8, '0')).join('');
};

export function entFromHex(hex: string): string {
    const matches: string[] | null = hex.match(/.{1,2}/g);
    if (!matches) {
        throw new Error(`Invalid hex string encountered.`);
    }
    return matches.map(byte => parseInt(byte, 16).toString(2).padStart(8, '0')).join('');
};
