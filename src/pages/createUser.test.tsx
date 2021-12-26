import "@testing-library/react";
import React from "react";
import { render, screen } from "@testing-library/react";
import CreateUser from "./createUser";
import { Provider } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { store } from "../redux/store";

const createUserWrapper = () => (
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CreateUser />} />
      </Routes>
    </BrowserRouter>
  </Provider>
);

describe("CreateUser", () => {
  it("should render", async () => {
    render(createUserWrapper());

    const t = await screen.findByRole("input", { name: "first_name" });
    //const t = await screen.findByText("Create a new User", undefined, {
    //  timeout: 10000,
    //});
    expect(t).toBeInTheDocument();
  });

  it("should render the form", async () => {
    render(createUserWrapper());

    const first = await screen.findByPlaceholderText("First Name");
    const last = await screen.findByPlaceholderText("Last Name");
    const mail = await screen.findByPlaceholderText("Email");

    expect(first).toBeInTheDocument();
    expect(last).toBeInTheDocument();
    expect(mail).toBeInTheDocument();
    expect(first).toBeVisible();
    expect(last).toBeVisible();
    expect(mail).toBeVisible();
  });
});
