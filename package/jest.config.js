module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom-fifteen',
  moduleNameMapper:{
    "\\.(css|sass|scss)$": "identity-obj-proxy",
  },
  transform: {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/fileTransformer.js"
  }
};