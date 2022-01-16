import "@testing-library/react";
import { render, screen } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { store } from "../../../redux/store";
import InvitedTrainerTable from "./invitedTrainerTable";

const renderInvitedTrainerTable = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<InvitedTrainerTable />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
};

describe("<InvitedTrainerTable />", () => {
  test("should render", () => {
    render(renderInvitedTrainerTable());
  });

  test("should render the table", async () => {
    render(renderInvitedTrainerTable());

    const table = await screen.findByRole("table");
    expect(table).toBeInTheDocument();
    expect(table).toBeVisible();
  });
});
