const fs = require('fs');
const path = require('path');

const wordlist = fs.readFileSync(path.join(__dirname, 'portuguese.txt'), 'utf8').split('\n').map(word => word.trim());
const portuguese = wordlist;

module.exports = { wordlist, portuguese };
