import "@testing-library/react";
import { render, screen } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { store } from "../../../redux/store";
import InvitedUserTable from "./invitedUserTable";

const renderInvitedUserTable = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<InvitedUserTable />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
};

describe("<InvitedUserTable />", () => {
  test("should render", () => {
    render(renderInvitedUserTable());
  });

  test("should render the table", async () => {
    render(renderInvitedUserTable());

    const table = await screen.findByRole("table");
    expect(table).toBeInTheDocument();
    expect(table).toBeVisible();
  });
});
