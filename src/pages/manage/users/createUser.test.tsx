import "@testing-library/react";
import React, { useState } from "react";
import { render, screen } from "@testing-library/react";
import CreateUser from "./createUser";
import { Provider } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { store } from "@redux/store";

const CreateUserWrapper: React.FC = () => {
  const [updateValue, setUpdateValue] = useState(0);
  return (
    <CreateUser updateValue={updateValue} setUpdateValue={setUpdateValue} />
  );
};

const CreateUserWrapperWrapper: React.FC = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CreateUserWrapper />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
};

describe("CreateUser", () => {
  test("should render the form", async () => {
    render(<CreateUserWrapperWrapper />);

    const first = await screen.findByTestId("first_name");
    const last = await screen.findByTestId("last_name");
    const email = await screen.findByTestId("email_address");
    const submit = await screen.findByTestId("create_submit");

    expect(first).toBeInTheDocument();
    expect(last).toBeInTheDocument();
    expect(email).toBeInTheDocument();
    expect(submit).toBeInTheDocument();
    expect(first).toBeVisible();
    expect(last).toBeVisible();
    expect(email).toBeVisible();
    expect(submit).toBeVisible();
  });
});
