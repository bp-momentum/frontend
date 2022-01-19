/* eslint-disable react/jsx-key */
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "antd/dist/antd.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import { store, persistor } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { HashRouter } from "react-router-dom";
import { MultiProvider } from "react-pendulum";
import "./i18n";

ReactDOM.render(
  <React.StrictMode>
    <MultiProvider
      providers={[
        <Provider store={store} />,
        <PersistGate loading={null} persistor={persistor} />,
        <HashRouter />,
      ]}
    >
      <App />
    </MultiProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
