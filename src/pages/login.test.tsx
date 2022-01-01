import "@testing-library/react";
import { render } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { store } from "../redux/store";
import Login from "./login";

const renderLogin = () =>(
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
      </Routes>
    </BrowserRouter>
  </Provider>
);

describe("<Login>", () => {
  test("should render the form", async () => {
    render(renderLogin());


  });
});