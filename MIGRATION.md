### Migration Guide
1. Change the URL from `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@{apiVersion}/{date}/{endpoint}`<br> to<br> `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@{date}/{apiVersion}/{endpoint}`

2. change `date` from `YYYY-MM-DD` to `YYYY.M.D` . Eg: `2024-03-01` becomes `2024.3.1` 

3. There is no  `/currencies/{currencyCode}/{currencyCode}` endpoint in this new API, so please only use `/currencies/{currencyCode}`