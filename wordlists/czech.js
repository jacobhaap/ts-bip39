const fs = require('fs');
const path = require('path');

const wordlist = fs.readFileSync(path.join(__dirname, 'czech.txt'), 'utf8').split('\n').map(word => word.trim());
const czech = wordlist;

module.exports = { wordlist, czech };
