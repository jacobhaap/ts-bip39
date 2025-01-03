const { verifyChecksum } = require('./checksum');

function toMnemonic(wordlist, entropy) {
    if (!wordlist) {
        throw new Error(`Parameter 'wordlist' is required.`);
    } if (!entropy) {
        throw new Error(`Parameter 'entropy' is required.`);
    }

    if (entropy.length < 11 || entropy.length > 506) {
        throw new Error(`Entropy must be at least 11 bits and no longer than 506 bits.`);
    } if (entropy.length % 11 !== 0) {
        throw new Error(`Entropy must be a multiple of 11.`);
    }

    const words = [];
    for (let i = 0; i < entropy.length; i += 11) {
        const index = parseInt(entropy.slice(i, i + 11), 2);
        words.push(wordlist[index]);
    }
    const mnemonic = words.join(' ');
    return mnemonic;
}

function fromMnemonic(wordlist, mnemonic) {
    if (!wordlist) {
        throw new Error(`Parameter 'wordlist' is required.`);
    } if (!mnemonic) {
        throw new Error(`Parameter 'mnemonic' is required.`);
    }

    const words = mnemonic.split(' ');
    const length = words.length;
    if (length < 1 || length > 46) {
        throw new Error(`Mnemonic must be at least 1 word and no longer than 46 words.`);
    }

    let entropy = '';
    words.forEach(word => {
        const index = wordlist.indexOf(word);
        if (index === -1) {
            throw new Error(`Word '${word}' not found in wordlist.`);
        }
        entropy += index.toString(2).padStart(11, '0');
    });

    return entropy;
}

function validateMnemonic(wordlist, mnemonic, checksumLength) {
    if (!mnemonic) {
        throw new Error(`Parameter 'mnemonic' is required.`)
    } if (!checksumLength) {
        throw new Error(`Parameter 'checksumLength' is required.`)
    }

    const entropy = fromMnemonic(wordlist, mnemonic);
    const verified = verifyChecksum(entropy, checksumLength);
    return verified;
}

module.exports = { toMnemonic, fromMnemonic, validateMnemonic };
