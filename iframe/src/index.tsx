import "react-app-polyfill/ie9";
import "react-app-polyfill/stable";
import React from "react";
import ReactDOM from "react-dom";
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

Sentry.init({
  dsn:
    "https://44e974f8b9e24b448bc6f0b7c3ea2c12@o506512.ingest.sentry.io/5596296",
  integrations: [new Integrations.BrowserTracing()],
  environment: window.location.origin.split(".")[2] === "com" ? "prod" : "test",

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,
});

if (process.env.REACT_APP_STAGE === "demo") {
  const { worker } = require("./mocks");
  worker.start();
}
ReactDOM.render(
  <React.StrictMode>
    <React.Suspense fallback="">
      <App />
    </React.Suspense>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
if (process.env.REACT_APP_STAGE !== "demo") serviceWorker.unregister();
