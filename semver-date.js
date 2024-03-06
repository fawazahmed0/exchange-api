const semver = require('semver')
const dateToday = new Date().toISOString().substring(0, 10)
const dateTodaySemVer = semver.clean(dateToday.replaceAll('-','.'), true)
console.log(dateTodaySemVer)