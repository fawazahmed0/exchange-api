### Migration Guide
1. Change the URL from `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@{apiVersion}/{date}/{endpoint}`<br> to<br> `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@{date}/{apiVersion}/{endpoint}`

2. change `date` from `YYYY-MM-DD` to `YYYY.M.D` . Eg: `2024-03-02` becomes `2024.3.2` 

3. There is no  `/currencies/{currencyCode}/{currencyCode}` endpoint in this new API, so please only use `/currencies/{currencyCode}` endpoint. For example:

```js
json = fetchJSON(`/currencies/{fromCurrency}/{toCurrency}`)
rate = json[toCurrency]
```
becomes
```js
json = fetchJSON(`/currencies/{fromCurrency}`)
rate = json[fromCurrency][toCurrency]
```

4. (Optional Step) Add [Fallback mechanism](https://github.com/fawazahmed0/exchange-api/blob/main/README.md#additional-fallback-url-on-cloudflare:~:text=Additional%20Fallback%20URL%20on%20CloudFlare%3A) in your code, to avoid any issue in the future.
