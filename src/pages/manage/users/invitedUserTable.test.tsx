import "@testing-library/react";
import { render, screen } from "@testing-library/react";
import React, { useState } from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { store } from "../../../redux/store";
import InvitedUserTable from "./invitedUserTable";

const InvitedUserTableWrapper = () => {
  const [updateValue, setUpdateValue] = useState(0);
  return (
    <InvitedUserTable
      updateValue={updateValue}
      setUpdateValue={setUpdateValue}
    />
  );
};

const RenderInvitedUserTable = () => (
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<InvitedUserTableWrapper />} />
      </Routes>
    </BrowserRouter>
  </Provider>
);

describe("<InvitedUserTable />", () => {
  test("should render", () => {
    render(RenderInvitedUserTable());
  });

  test("should render the table", async () => {
    render(RenderInvitedUserTable());

    const table = await screen.findByRole("table");
    expect(table).toBeInTheDocument();
    expect(table).toBeVisible();
  });
});
