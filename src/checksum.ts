import * as crypto from "node:crypto";
import { Buffer } from "node:buffer";

export function getChecksum(ent: string, checksumLength: number): string {
    if (!ent) {
        throw new Error(`Initial Entropy parameter 'ent' is required.`);
    } else if ((ent.length + checksumLength) < 11 || (ent.length + checksumLength) > 506) {
        throw new Error(`ent + checksum combined length must be at least 11 bits and no longer than 506 bits.`);
    } else if ((ent.length + checksumLength) % 11 !== 0) {
        throw new Error(`ent + checksum combined length must be a multiple of 11.`);
    }

    const byteArray: number[] = [];
    for (let i = 0; i < ent.length; i += 8) {
        byteArray.push(parseInt(ent.slice(i, i + 8), 2));
    }

    const hash: Buffer = crypto.createHash('sha256').update(Buffer.from(byteArray)).digest();
    const checksum: string = Array.from(hash.values() as Iterable<number>)
        .map((byte) => byte.toString(2).padStart(8, '0'))
        .join('')
        .slice(0, checksumLength);

    const combinedEntropy: string = ent + checksum;

    return combinedEntropy;
};

export function verifyChecksum(entropy: string, checksumLength: number): boolean {
    if (!entropy) {
        throw new Error(`Parameter 'entropy' is required.`);
    } else if (entropy.length < 11 || entropy.length > 506) {
        throw new Error(`Entropy must be at least 11 bits and no longer than 506 bits.`);
    } else if (entropy.length % 11 !== 0) {
        throw new Error(`Entropy must be a multiple of 11.`);
    }

    const totalBits: number = entropy.length;
    const entropyLength: number = totalBits - checksumLength;
    const entropyBits: string = entropy.slice(0, entropyLength);
    const actualChecksum: string = entropy.slice(entropyLength, totalBits);

    const expectedCombinedEntropy: string = getChecksum(entropyBits, checksumLength);
    const expectedChecksum: string = expectedCombinedEntropy.slice(entropyLength, totalBits);

    return actualChecksum === expectedChecksum;
};
