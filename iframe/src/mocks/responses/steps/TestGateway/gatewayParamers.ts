export default {
  identifier: "TestGateway",
  paymentMethods: ["creditCard", "bankTransfer"],
  fiatCurrencies: [
    {
      code: "USD",
      id: "USD",
      precision: 2,
    },
    {
      code: "EUR",
      id: "EUR",
      precision: 2,
    },
    {
      code: "GBP",
      id: "GBP",
      precision: 2,
    },
    {
      code: "CAD",
      id: "CAD",
      precision: 2,
    },
  ],
  cryptoCurrencies: [
    {
      code: "BTC",
      id: "BTC",
      precision: 5,
    },
    {
      code: "ETH",
      id: "ETH",
      precision: 4,
    },
  ],
};
