### Migration Guide
1. Change the URL
```diff
- https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/{date}/{endpoint}
+ https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@{date}/v1/{endpoint}
```
2. Change `/currencies/{currencyCode}/{currencyCode}` -> `/currencies/{currencyCode}`
```diff
- json = fetchJSON(`/currencies/{fromCurrency}/{toCurrency}`)
+ json = fetchJSON(`/currencies/{fromCurrency}`)
- rate = json[toCurrency]
+ rate = json[fromCurrency][toCurrency]
```

3. (Optional Step) Add [Fallback mechanism](https://github.com/fawazahmed0/exchange-api/blob/main/README.md#additional-fallback-url-on-cloudflare:~:text=Additional%20Fallback%20URL%20on%20Cloudflare%3A) in your code, to avoid any issue in the future.


Refer [Readme](https://github.com/fawazahmed0/exchange-api#endpoints) for URL examples and refer [this](https://github.com/fawazahmed0/exchange-api/issues/89) to know why migration was necessary
