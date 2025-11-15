const fs = require('fs/promises')
async function begin(){

  let data = await fetch('https://www.six-group.com/dam/download/financial-information/data-center/iso-currrency/lists/list-one.xml').then(res=>res.text())
  console.log([...new Set(data.match(/<Ccy>(.{3})<\/Ccy>/g).map(e=>e.trim().slice(5,8)))])
  await fs.writeFile('isocodes.json',JSON.stringify([...new Set(data.match(/<Ccy>(.{3})<\/Ccy>/g).map(e=>e.trim().slice(5,8)))]))
}
begin()
