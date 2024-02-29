const startMonth = -2
const endMonths = -12
const dateToday = new Date()
dateToday.setMonth(dateToday.getMonth()+startMonth)
let datesArr = []
for(let i=startMonth;i>=endMonths;i--){
    dateToday.setMonth(dateToday.getMonth()-1)
    datesArr.push(`${dateToday.toLocaleString("sv-SE", {  dateStyle: 'short'}).slice(0,7).replace('-','\\-')}\\-[0-9]+`)
}
console.log(datesArr.map(e=>`--path-regex ${e}`).join(' '))
