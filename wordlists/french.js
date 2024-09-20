const fs = require('fs');
const path = require('path');

const wordlist = fs.readFileSync(path.join(__dirname, 'french.txt'), 'utf8').split('\n').map(word => word.trim());
const french = wordlist;

module.exports = { wordlist, french };
