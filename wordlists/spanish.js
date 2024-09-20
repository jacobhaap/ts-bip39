const fs = require('fs');
const path = require('path');

const wordlist = fs.readFileSync(path.join(__dirname, 'spanish.txt'), 'utf8').split('\n').map(word => word.trim());
const spanish = wordlist;

module.exports = { wordlist, spanish };
