import "@testing-library/react";
import { render, screen } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { store } from "@redux/store";
import Login from "./index";

const LoginWrapper: React.FC = () => (
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
    render(<LoginWrapper />);

    const username = await screen.findByPlaceholderText("user.username");
    const password = await screen.findByPlaceholderText("user.password");

    expect(username).toBeInTheDocument();
    expect(password).toBeInTheDocument();
  });
});
