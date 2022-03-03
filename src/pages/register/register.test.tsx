import { render, screen } from "@testing-library/react";
import React from "react";
import Register from "./register";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "@redux/store";

const RegisterWrapper: React.FC = () => (
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Register registerToken="a" />} />
      </Routes>
    </BrowserRouter>
  </Provider>
);

describe("<Register />", () => {
  test("should render", () => {
    render(<RegisterWrapper />);
  });

  test("should render the register form", async () => {
    render(<RegisterWrapper />);

    const username = await screen.findByPlaceholderText("user.username");
    const password = await screen.findAllByPlaceholderText("user.password");

    expect(username).toBeInTheDocument();
    expect(password).toHaveLength(2);
  });
});
