import { BASE_API } from "../../../constants";

let waited = 0;
const getNextStep = (currentStep: string) => {
  waited++;
  switch (currentStep) {
    case "firstStep":
      return firstStep;
    case "createOrder":
      return verificationCodesStep;
    case "wait":
      return waitStep(waited);
    case "verify":
      return completedStep;
  }
};

const waitStep = (count: number) => ({
  type: "wait",
  url: `${BASE_API}/transaction/Wyre/${
    count > 60 ? "createOrder" : "wait"
  }/WyJuUGxEVGF2djFJaXR6MU9jZVNZTHVRLS0iLDEwMCwiRVVSIiwiQlRDIiwiY3JlZGl0Q2FyZCJd`,
});

const firstStep = {
  type: "form",
  url: `${BASE_API}/transaction/Wyre/createOrder/WyJuUGxEVGF2djFJaXR6MU9jZVNZTHVRLS0iLDEwMCwiRVVSIiwiQlRDIiwiY3JlZGl0Q2FyZCJd`,
  data: [
    {
      type: "string",
      name: "cryptocurrencyAddress",
      humanName: "Cryptocurrency wallet address",
    },
    {
      type: "string",
      name: "firstName",
      humanName: "First name",
    },
    {
      type: "string",
      name: "lastName",
      humanName: "Last Name",
    },
    {
      type: "string",
      name: "email",
      humanName: "Email",
    },
    {
      type: "integer",
      name: "phoneCountryCode",
      humanName: "Phone country code",
    },
    {
      type: "integer",
      name: "phoneNumber",
      humanName: "Phone number",
    },
    {
      type: "string",
      name: "street",
      humanName: "Street",
    },
    {
      type: "string",
      name: "town",
      humanName: "City",
    },
    {
      type: "string",
      name: "postCode",
      humanName: "Postal Code",
    },
    {
      type: "string",
      name: "country",
      humanName: "Country",
    },
    {
      type: "string",
      name: "state",
      humanName: "State",
      hint: "Only required if your address is in the US",
      required: false,
    },
    {
      type: "string",
      name: "ccNumber",
      humanName: "Credit Card Number",
    },
    {
      type: "string",
      name: "ccMonth",
      humanName: "Credit Card Expiration Month",
    },
    {
      type: "string",
      name: "ccYear",
      humanName: "Credit Card Expiration Year",
    },
    {
      type: "string",
      name: "ccCVV",
      humanName: "Credit Card CVV",
    },
    {
      type: "boolean",
      name: "termsOfUse",
      terms: [
        {
          url: "https://onramper.com/terms-of-use/",
          humanName: "Onramper's Terms Of Use",
        },
        {
          url: "https://onramper.com/privacy-policy/",
          humanName: "Onramper's Privacy Policy",
        },
        {
          url: "https://www.sendwyre.com/user-agreement/",
          humanName: "Wyre's User Agreement, Privacy Policy and Refund Policy",
        },
      ],
    },
  ],
};

const verificationCodesStep = {
  type: "form",
  url: `${BASE_API}/transaction/Wyre/verify/WyJVbVhFMVBDNUdXelhWa05TQ09ZRlF3LS0iLCJXT19BTTgyN0ZRTjNHIiwiRzNYUFlXVjI4QzIyVU5aV0RBNzYiXQ==`,
  data: [
    {
      type: "string",
      name: "verifyPhoneCode",
      humanName: "Phone verification code",
    },
    {
      type: "string",
      name: "verifyCreditCard",
      humanName: "Credit Card verification code",
    },
  ],
};

const completedStep = {
  type: "completed",
  trackingUrl: "https://onramper.com",
};

export default {
  getNextStep,
};
