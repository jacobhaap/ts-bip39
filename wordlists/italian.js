const fs = require('fs');
const path = require('path');

const wordlist = fs.readFileSync(path.join(__dirname, 'italian.txt'), 'utf8').split('\n').map(word => word.trim());
const italian = wordlist;

module.exports = { wordlist, italian };
