/* eslint-disable react/jsx-key */
import React from "react";
import { createRoot } from "react-dom/client";
import "@styles/index.css";
import LocalizedApp from "./App";
import { Provider } from "react-redux";
import { store, persistor } from "@redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { HashRouter } from "react-router-dom";
import { MultiProvider } from "react-pendulum";
import { ConfigProvider } from "antd";
import EmptyDataRender from "@shared/emptyDataRender";
import "@util/i18n";

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(document.getElementById("root")!);

root.render(
  <Provider store={store}>
    <MultiProvider
      providers={[
        <PersistGate loading={null} persistor={persistor} />,
        <HashRouter />,
        <ConfigProvider renderEmpty={() => <EmptyDataRender />} />,
      ]}
    >
      <LocalizedApp />
    </MultiProvider>
  </Provider>
);
