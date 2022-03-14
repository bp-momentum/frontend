/* eslint-disable react/jsx-key */
import React from "react";
import ReactDOM from "react-dom";
import "@styles/index.css";
import "antd/dist/antd.min.css";
import LocalizedApp from "./App";
import { Provider } from "react-redux";
import { store, persistor } from "@redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { HashRouter } from "react-router-dom";
import { EmojiProvider } from "react-apple-emojis";
import emojiData from "react-apple-emojis/lib/data.json";
import { MultiProvider } from "react-pendulum";
import { ConfigProvider } from "antd";
import EmptyDataRender from "@shared/emptyDataRender";
import "@util/i18n";

ReactDOM.render(
  <React.StrictMode>
    <MultiProvider
      providers={[
        <Provider store={store} />,
        <PersistGate loading={null} persistor={persistor} />,
        <HashRouter />,
        <EmojiProvider data={emojiData} />,
        <ConfigProvider renderEmpty={() => <EmptyDataRender />} />,
      ]}
    >
      <LocalizedApp />
    </MultiProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
