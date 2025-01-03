function entFromString(str) {
    return str.split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join('');
}

function entFromBuffer(buf) {
    return Array.from(buf).map(byte => byte.toString(2).padStart(8, '0')).join('');
}

function entFromUint8Array(uint8Array) {
    return Array.from(uint8Array).map(byte => byte.toString(2).padStart(8, '0')).join('');
}

function entFromHex(hex) {
    return hex.match(/.{1,2}/g).map(byte => parseInt(byte, 16).toString(2).padStart(8, '0')).join('');
}

module.exports = { entFromString, entFromBuffer, entFromUint8Array, entFromHex };
