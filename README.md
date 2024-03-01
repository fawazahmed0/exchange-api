<h1 align="center">Free Currency Exchange Rates API</h1> 

<p align="center">
  <img width="460" height="300" src="https://github.com/fawazahmed0/currency-api/raw/1/money.jpg">
</p>

[![Publish-Currencies](https://github.com/fawazahmed0/exchange-api/actions/workflows/run.yml/badge.svg)](https://github.com/fawazahmed0/exchange-api/actions/workflows/run.yml)


**Features:**
- Free & Blazing Fast response
- No Rate limits
- 150+ Currencies, Including Common Cryptocurrencies
- Daily Updated


**URL Structure:**

`https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@{date}/{apiVersion}/{endpoint}`

**Formats:**

`date`

The date should either be `latest` or in `YYYY.M.D` format <br>

The Endpoints Supports HTTP GET Method and returns the data in two formats:

`/{endpoint}.json`

`/{endpoint}.min.json`

The above formats also work for fallback i.e if `.min.json` link fails, you can use `.json` link and vice versa


**Endpoints:**

- `/currencies`<br>
> Lists all the available currencies in prettified json format:<br>
 https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.json <br>

> Get a minified version of it:<br>
https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.min.json <br>

- `/currencies/{currencyCode}`<br>
> Get the currency list with EUR as base currency:<br>
https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/eur.json <br>

> Get the currency list with EUR as base currency on date 2024-03-02:<br>
https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@2024.3.2/v1/currencies/eur.json <br>

> Get the currency list with BTC as base currency:<br>
https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/btc.json <br>

> Get the currency list with BTC as base currency in minified format:<br>
https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/btc.min.json <br>

**Additional Fallback URL on CloudFlare:** <br>
This fallback URL only returns latest currencies and does not have `date` option

`https://currency-api.pages.dev/{apiVersion}/{endpoint}`

> Get the currency list with BTC as base currency:<br>
https://currency-api.pages.dev/v1/currencies/btc.json
<br>

**Migrating from Previous Currency API:** [Read this](https://github.com/fawazahmed0/exchange-api/blob/main/MIGRATION.md)


