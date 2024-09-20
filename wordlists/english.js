const fs = require('fs');
const path = require('path');

const wordlist = fs.readFileSync(path.join(__dirname, 'english.txt'), 'utf8').split('\n').map(word => word.trim());
const english = wordlist;

module.exports = { wordlist, english };
