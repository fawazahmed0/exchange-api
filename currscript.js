const fs = require('fs-extra')
const path = require('path')
const { firefox, devices } = require('playwright')
const semver = require('semver')


// spaces to be used for prettify/json.stringify
const indent = '\t'

// By market capitalization
// Ref: https://coinmarketcap.com/all/views/all/
let topCryptoCurrency = ["BTC","ETH","ADA","BNB","USDT","XRP","SOL","DOT","DOGE","USDC","UNI","LUNA","LINK","AVAX","LTC","BUSD","AAVE","FRAX","HBAR",
                         "BCH","ALGO","WBTC","ICP","MATIC","FIL","TRX","FTT","XLM","VET","ATOM","ETC","THETA","DAI","XMR","MANA","ZEC","TUSD","EOS","AXS",
                         "ONE","EGLD","CHZ","GRT","1INCH","INJ","ENJ","KSM","CRO","SHIB","LEO","NEAR","BTCB","FLOW","XTZ","KCS", "SAND","KLAY","MKR",
                        "HT","DFI","TTT","WAVES","HNT","BSV","USDP","MIOTA","FTM","XEC","RUNE","QNT","NEO","CAKE","STX","LRC","OKB","NEXO","ZIL","DASH",
                        "PAXG","CELO","BAT","CVX","CRV","KAVA","GALA","DCR","GNO","AMP","XDC","WEMIX","XEM","MINA","HOT","AR","GT","FEI","COMP","QTUM",
                        "KNC","BTG","KDA","mBTC","uBTC","mETH","XCH","BSW","BAKE","KAS", "TON", "RVN","LDO","MNT","APT","ARB","OP","USDD","IMX","APE","SNX",
                         "RNDR","RPL","XAUt","FXS","PEPE","CFX","CSPR","BTT","SUI","LUNC","GUSD","TWT","GMX","AKT","NFT","FLR","DYDX","WOO","MBX","AGIX",
                         "ORDI","1000SATS"]

let currencyCodesToRemove = ["CLF"]

let currLink, currLink2, currLink3, currLink3Key, cryptoLink
if (process.env.CI) {
  currLink = process.env.currlink
  currLink2 = process.env.currlink2
  currLink3 = process.env.currlink3
  currLink3Key = process.env.currlink3key
  cryptoLink = process.env.cryptolink
} else {
  [currLink, currLink2, currLink3, currLink3Key, cryptoLink] = fs.readFileSync(path.join(__dirname, 'links.ini')).toString().split(/\r?\n/).map(e => e.trim())
}
// curr means currency
// stores consolidated currencies in currcode:currname format i.e USD:US Dollar
let allcurr = fs.readFileSync(path.join(__dirname, 'allcurrencies.min.json')).toString()
allcurr = JSON.parse(allcurr)

// Takes allcurr and have all the keys in uppercase
const allcurrKeyUpper = {}
for (const [key, value] of Object.entries(allcurr)) { allcurrKeyUpper[key.toUpperCase()] = value }

// Takes allcurr and store in lowercase currname:currcode format i.e. us dollar:usd
const allcurrLower = {}
for (const [key, value] of Object.entries(allcurr)) { allcurrLower[value.toLowerCase()] = key.toLowerCase() }

const dateToday = new Date().toISOString().substring(0, 10)
const dateTodaySemVer = semver.clean(dateToday.replaceAll('-','.'), true)

const pathToSkeletonPackage = path.join(__dirname, 'skeleton-package.json')

const apiVersion = 1

const rootDir = path.join(__dirname, 'package', `v${apiVersion}`)

begin()
// Begins the program
async function begin() {
  // launch the browser
 // await launchBrowser()



  const currJSON = await getCurrencies()
  // Get & Save All the available currencies in api
  const availCurrListObj = await getAvailCurrencyJSON(currJSON)
  fs.outputFileSync(path.join(rootDir, 'currencies.min.json'), JSON.stringify(availCurrListObj))
  fs.writeFileSync(path.join(rootDir, 'currencies.json'), JSON.stringify(availCurrListObj, null, indent))

  // Generate API files
  await generateFiles(currJSON)

  // Set package version to dateToday
  let barePackage = fs.readJsonSync(pathToSkeletonPackage)
  barePackage['version'] = dateTodaySemVer
  fs.writeJSONSync(path.join(rootDir, '..' ,"package.json"), barePackage)
  fs.writeFileSync(path.join(rootDir, '..' ,"index.js"),  "")

  fs.copyFileSync(path.join(__dirname, 'country.json'), path.join(rootDir, 'country.json'))

  // Close the browser
//  await browser.close()
}


// Returns all the available currencies in the API
async function getAvailCurrencyJSON(CurrObj) {
  const availCurrListObj = {}
  for (const key of Object.keys(CurrObj)) { 
    availCurrListObj[key] = allcurrKeyUpper[key.toUpperCase()] || ""
    if(!allcurrKeyUpper[key.toUpperCase()])
    console.log(key,"currency code doesn't exist in allcurrencies.min.json")
   }

  return availCurrListObj
}

async function getCurrencies() {
let currDataObj = await getCurrData(currLink)
currDataObj = toLowerCaseKeysBaseCurr(currDataObj)

let currDataObj3 = toLowerCaseKeysBaseCurr( (await getCurrData3()) )
// we need to convert base usd to eur
currDataObj3 = 'eur' in currDataObj3 ? toLowerCaseKeysBaseCurr(currDataObj3, 1/currDataObj3['eur']) : {}

let cryptoDataObj = await getCryptoData()
// we also need to convert base usd to eur
cryptoDataObj = toLowerCaseKeysBaseCurr(cryptoDataObj,currDataObj['usd'])
  let CurrJSON = { ...currDataObj, ...cryptoDataObj, ...currDataObj3, eur: 1 }
  currencyCodesToRemove.forEach(e=>delete CurrJSON?.[e.toLowerCase()])
  // return sorted object
  return sortObjByKeys(CurrJSON)
}

// Euro as base rates
async function getCurrData(link){
  let response = await fetch(link)
  let data = await response.json()
  return data.rates
}

// USD as base rates
async function getCryptoData(){
  let response = await fetch(cryptoLink)
  let data = await response.json()
  let cleanJSON = {}
  for(let value of data.data.reverse())
    cleanJSON[value.symbol] = value.quote.USD.price

  return Object.fromEntries(                                                           // Dividing value by 1 to convert to 1 USD as base rate
    Object.entries(cleanJSON).filter(([k, v]) => topCryptoCurrency.includes(k)).map(([k,v])=>[k,1/v]) )
}

async function getCurrData3(){

    const browser = await firefox.launch({headless: true});
    let arrRes = []
    try{

    const context = await browser.newContext({ ...devices['Desktop Firefox'] });
    const page = await context.newPage();

    const reg = new RegExp(currLink3Key, "gi")
    page.on('response', async res => reg.test(res.url()) ? arrRes.push(await res.json().catch(console.error)) : '' );
    for(let i=0;i<3;i++){
        try{
            await page.goto(currLink3)
            break;
        }catch(e){}
    }

    arrRes = arrRes.filter(e=>e?.rates?.USD == 1)
    return arrRes.length > 0 ? arrRes[0].rates : {}

    }catch(e){
        console.error(e)
        return {}
    }finally{
        await browser.close()
    }
}

// convert object keys to lowercase and values to float
// tocurr parameter
// convert object having a base currency value to object of another base currency value
// For example: pass object with base currency as usd, pass tocurr as 1Eur to 1.17USD i.e 1.17 to convert object to base currency as EUR
function toLowerCaseKeysBaseCurr(obj, tocurr=1){
let newobj = {}
for(let [key,value] of Object.entries(obj)){
    let tempValue = parseFloat(value)*parseFloat(tocurr)
    if(Number.isFinite(tempValue))
    newobj[key.toLowerCase()] = tempValue
}
return newobj
}


// Sorts an object by keys and returns the sorted object
function sortObjByKeys(obj) {
  const sortedObj = {}
  const sortedKeys = Object.keys(obj).sort()
  for (const key of sortedKeys) { sortedObj[key] = obj[key] }
  return sortedObj
}

// Generates the api files
async function generateFiles(googBingCurrJSON) {
  const currenciesDir = path.join(rootDir, 'currencies')
  fs.mkdirSync(currenciesDir, {
    recursive: true
  })
  for (const [fromKey, fromValue] of Object.entries(googBingCurrJSON)) {
    const tempObj = {}
    tempObj['date'] = dateToday;
    tempObj[fromKey] = {}

    for (const [toKey, toValue] of Object.entries(googBingCurrJSON)) 
      tempObj[fromKey][toKey] = currencyValue(fromValue, toValue)
    
    fs.writeFileSync(path.join(currenciesDir, fromKey + '.min.json'), JSON.stringify(tempObj))
    fs.writeFileSync(path.join(currenciesDir, fromKey + '.json'), JSON.stringify(tempObj, null, indent))
  }
}

// return 1 fromCurr as base currency for toCurr
// fromCurr & toCurr is against 1 USD or 1 EUR or something common
// For example, if you pass 74 INR & 0.84 EUR and 1 INR = 0.011 Eur
// It returns 0.011 , with numbers upto 20 decimal places
function currencyValue(fromCurr, toCurr) {
  return getSignificantNum(toCurr / fromCurr)
}

// If the value is very small, then return more significant digits
function getSignificantNum(num){
    let minSignificantDigits = 8
    if(num >= 0.1)
        return parseFloat(num.toFixed(minSignificantDigits))
    let strNum = num.toFixed(100)
    let numOfZeros = strNum.match(/^0\.0+/i)[0].length-2
    return parseFloat(num.toFixed(minSignificantDigits+numOfZeros))
}
