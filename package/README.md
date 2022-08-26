# Fiat to crypto widget
Exohood allows your users to buy cryptocurrency with fiat, directly from your website or app.

For docs and examples visit: [docs.exohood.com](https://docs.exohood.com/)

###### Installation

```shell
# Using yarn
$ yarn add @exohood/fiat-to-crypto

# Using npm
$ npm install @exohood/fiat-to-crypto
```

###### Code snippet
```javascript
import ExohoodWidget from "@exohood/fiat-to-crypto";

export default function ExohoodWidgetContainer() {
  return (
    <div style={{maxWidth: '482px',  maxHeight: '660px',  height: '100%',  width: '100%'}}>
      <OnramperWidget
        color="#0316C1"
        defaultAmount={200}
        defaultCrypto="BTC"
        API_KEY="pk_live_YOUR-API-KEY"
      />
    </div>
  )
}
```
###### Live example & customization
While importing the widget as a React component, you can customize it using the component props below. 

#### Component props
| Name           | Type      | Example                              | Default value |
| -------------- | --------- | ------------------------------------ | ------------- |
| defaultCrypto  | String?   | `"ETH"`                              | undefined     |
| defaultAmount  | Number?   | `500`                                | 100           |
| defaultAddrs   | Object?   | `{"BTC":["ADDR1"], "ETH":["ADDR2"]}` | {}            |
| onlyCryptos    | String[]? | `["BTC", "ETH", "NEO"]`              | undefined     |
| excludeCryptos | String[]? | `["ETH", "NEO"]`                     | undefined     |
| onlyGateways   | String[]? | `["Moonpay", "Wyre"]`                | undefined     |
| color          | String?   | `"#000000"`                          | "#31a5ff"     |
| API_KEY        | String    | `"pk_live_YOUR-API-KEY"`             | -             |
| selectGatewayBy| String    | `"performance"`                      | "price"       |

## Customize
You can pass the following arguments to customize the widget

| Parameter      | Description    |
| -------------- | -------------- |
| defaultCrypto  | Select a specific cryptocurrency by default. Should be specified the cryptocurrency code. |
| defaultAmount  | Positive integer representing the base amount of fiat to be filled in the widget. Should be indicated in USD, for other currencies, a rounded aproximated conversion will be automatically applied.|
| addresses      | A stringified JSON with the wallet addresses of the user. The keys should be the cryptocurrency code and the value a list containing the user addresses. Can be more than one address per wallet and more than one cryptocurrency. |
| onlyCryptos    | A comma-separated list of crypto codes to include. Only this cryptos will be shown to the user.|
| excludeCryptos | A comma-separated list of crypto codes to exclude. This cryptos will be excluded from the list of available cryptos..|
| onlyGateways   | A comma-separated list of gateways to enable. Only these gateways will be shown to the user for selection.|
| color          | Color to change the highlight of the widget. Should be an hex color.|
