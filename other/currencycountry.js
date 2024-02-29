// data taken from https://www.iban.com/currency-codes
// https://www.iban.com/country-codes

const fs = require('fs')
const path = require('path')

let countryArr = fs.readFileSync(path.join(__dirname, 'country.csv')).toString().trim().toLowerCase().split(/\r?\n/).slice(1).map(e=>e.split(',').map(e=>e.replaceAll('"','')))
let currencyArr = fs.readFileSync(path.join(__dirname, 'currency.csv')).toString().trim().toLowerCase().split(/\r?\n/).slice(1).map(e=>e.split(',').map(e=>e.replaceAll('"','')))

countryObj = Object.fromEntries(countryArr.map(e=>[e[0], e.slice(1)]))
let bigJSON = {}
for(let [countryName, currencyName, currencyCode, currencyNumber] of currencyArr){
    try{
    let [iso2,iso3,isoNumeric] = countryObj[countryName]
    if(iso2 in bigJSON)
    console.log(countryName)
    else
    bigJSON[iso2] = {"country_name": countryName, "country_iso3":iso3, "country_iso_numeric":isoNumeric ,"currency_name": currencyName, "currency_code": currencyCode, "currency_number": currencyNumber}
    }catch(e){}
}

fs.writeFileSync(path.join(__dirname, 'bigJSON.json'), JSON.stringify(bigJSON, null, '\t'))

