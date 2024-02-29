const fs = require('fs')
const path = require('path')
// Requires for md5 hash generations for fonts to check duplicates
const crypto = require('crypto')

currcodes = fs.readFileSync(path.join(__dirname, 'currencies2.json')).toString()
currcodes = JSON.parse(currcodes)

mergecodes = fs.readFileSync(path.join(__dirname, 'mergecurr4.json')).toString()
mergecodes = JSON.parse(mergecodes)

const newcurrobj = {}

for (const [key, value] of Object.entries(mergecodes)) {
  // mergecodes[value.cc] = value.name

  newcurrobj[key.toLowerCase()] = value.toLowerCase()
}

console.log(newcurrobj)

fs.writeFileSync('mergecurr5lower.json', JSON.stringify(newcurrobj))
