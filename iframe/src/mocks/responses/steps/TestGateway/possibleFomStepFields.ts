import { BASE_API } from "../../../constants";

const testIcon =
  "data:image/png;base64,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";
const testIcon2Btc =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAhFBMVEUAhvv// /8AgPsAfvsAhPukyv0AgvsAfPvG3/74/P8AiPvi7/77/v8AevvX6P7O4/6u0f2fyP3M4v5Infzw9/+Lvf1kqfwYjPtRoPxGnPyUwv3s9f/c7P59svxlqvyozv2Guv02lvspkfvA2/621f2RwP1xsPwYi/uwz/0zk/t+tfwAdvutiviUAAAMUElEQVR4nOWdiXbjKhKGbcDIS+LYSbxn4iWO3fG8// uNJDudhaKgpAKhnv/0Oel7Wjf4MwIKqKXTjaTNtGfVtG88vrU/3ZuSGu5wEbjUuxdW3R9/Pz1AnpZPpIajEc5Vx6ps8PvpvrQ/LXqkhqMRIoBqbzy90/bH5Qup4ViEY6RT9Lvx+B75Qs60lmMRTgXSKQ+/n37Gvo8TreVYhEvsLb37/fQR+T6EMS3hikWIfGS1NJ6+IMMwe6a1HInwAZsbzfVtgXwfB2LTkQjXWKcYc+MIG4Y7YtORCFfIMBwaT0+wacm0f3DFIRwgXQjMja/I96EN68ChOISoiTIxHh/an1Y0k60bi3CGmSib30+PMqQLaWZ3NxYhZqKYc2MPG4ZjattRCAdYp5hzI2ak0z9vFMI32tyI8KlXcuNRCLGdgjDmRsxIB6Yll4IT3m36W8xEMU021Eg3piWnghKOt5f9UErkE+fr/Wo3+Tl7YEb6gv4hQhEOHmernE1jk8atF7WQ8um9// dtxUy2C/2TBCHc9JZaesB9x5R62RsV// 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";

const creditCardFormFieldsGroup = [
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
];

const phoneNumberFormFieldsGroup = [
  {
    type: "integer",
    name: "phoneCountryCode",
    humanName: "Phone country code",
  },
  {
    type: "integer",
    name: "phoneNumber",
    humanName: "Phone number",
    hint: "Landlines and VoIP are not accepted. Please use a mobile phone number",
  },
];

const personalInfoFields = [
  {
    type: "string",
    name: "firstName",
    humanName: "First name",
  },
  {
    type: "string",
    name: "lastName",
    humanName: "Last name",
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
    type: "date",
    name: "dateOfBirth",
    humanName: "Date of Birth",
    data: [
      {
        type: "integer",
        humanName: "Day",
        name: "day",
      },
      {
        type: "integer",
        humanName: "Month",
        name: "month",
      },
      {
        type: "integer",
        humanName: "Year",
        name: "year",
      },
    ],
  },
  {
    type: "string",
    name: "email",
    humanName: "Email",
    hint: "Hint for email field.",
  },
  {
    type: "string",
    name: "identityDocumentLastName",
    humanName: "Last name as on the identity document",
  },
];

const allFormFields = [
  {
    type: "string",
    name: "cryptocurrencyAddress",
    humanName: "Cryptocurrency wallet address",
    hint: "This is a test hint for cypto address",
  },
  {
    type: "string",
    name: "verifyCreditCard",
    humanName: "Credit Card verification code",
    hint: "For the time being, most likely I'm not visible because I'm replaced by a text in the frontend!",
  },
  {
    type: "string",
    name: "verifyPhoneCode",
    humanName: "Phone verification code",
    hint: "A verification code was sent to your phone number. Fill it in here.",
  },
  {
    type: "string",
    name: "verifyEmailCode",
    humanName: "Email verification code",
    hint: "This is a test hint for email code which here is required on purpose",
    isRequired: true,
  },
  {
    type: "select",
    name: "name for select",
    humanName: "Select's label - with icons",
    hint: "Select's hint",
    options: [
      { humanName: "Test option onramper #1", value: "#1", icon: testIcon },
      { humanName: "Test option btc icon #2", value: "#2", icon: testIcon2Btc },
    ],
  },
  {
    type: "select",
    name: "name for select (1 item)",
    humanName: "Select's label (1 item)",
    hint: "Select's hint",
    options: [{ humanName: "Test option #1", value: "#1" }],
  },
  {
    name: "country",
    humanName: "Select country",
    type: "select",
    placeholder: "A placeholder",
    options: [
      { humanName: "Algeria", value: "DZ" },
      { humanName: "Argentina", value: "AR" },
      { humanName: "Australia", value: "AU" },
      { humanName: "United Kingdom", value: "GB" },
      { humanName: "United States of America", value: "US" },
      { humanName: "Vietnam", value: "VN" },
    ],
  },
  {
    name: "country",
    humanName: "Select country (1 item)",
    type: "select",
    placeholder: "A placeholder",
    options: [{ humanName: "Algeria", value: "DZ" }],
  },
  {
    type: "string",
    name: "state",
    humanName: "Select state",
    required: false,
  },
  {
    type: "choice",
    humanName: "Type of identity document (choice)",
    name: "documentType",
    options: ["Identity card", "Passport"],
  },
  {
    type: "choice",
    humanName: "Type of identity document (choice - 1 item)",
    name: "documentType",
    options: ["Identity card"],
  },
  ...creditCardFormFieldsGroup,
  ...phoneNumberFormFieldsGroup,
  ...personalInfoFields,
  {
    type: "string",
    name: "cryptocurrencyAddressTag",
    humanName: "Cryptocurrency address tag",
    required: false,
  },
  {
    type: "string",
    name: "password",
    humanName: "Test password input",
    placeholder: "A placeholder for password input...",
    hint: "Hint for test password input",
  },
  {
    type: "text",
    name: "a test name",
    humanName: "Label test input",
    placeholder: "Test input placeholder...",
    hint: "Hint for test input (matching the last condition)",
  },
  {
    type: "text",
    name: "a test name",
    humanName: "Label test input 2",
    placeholder: "Test input placeholder...",
    hint: "Hint for test input (matching the last condition) - icon",
    icon: testIcon,
  },
  {
    type: "text",
    name: "a test name 2",
    humanName: "Label test input 3",
    placeholder: "Test input placeholder...",
    hint: "Hint for test input 3 (matching the last condition) - icon end",
    icon: testIcon,
    iconPosition: "end",
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
        url: "https://www.notion.so/Transak-Terms-of-Service-6d89598211644402b3be63bc3f1468b4",
        humanName: "Transak Terms of Service",
      },
      {
        url: "https://onramper.com/privacy-policy/",
        humanName: "Additional test item added here",
      },
    ],
  },
];

export default {
  type: "form",
  progress: 59,
  humanName: "Possible form fields",
  data: allFormFields,
  url: `${BASE_API}/GoTo/TestGateway/orderComplete/WyJHWHVZZGVBb1B6SF9JcXJWQXh6R3ZRLS0iLDEwMCwiRVVSIiwiQlRDIiwiY3JlZGl0Q2FyZCJd`,
};
