import "@testing-library/react";
import { render, screen } from "@testing-library/react";
import React, { useState } from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { store } from "../../../redux/store";
import InvitedUserTable from "./invitedUserTable";

const RenderInvitedUserTable = () => {
  const [updateValue, setUpdateValue] = useState(0);
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <InvitedUserTable
                updateValue={updateValue}
                setUpdateValue={setUpdateValue}
              />
            }
          />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
};

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
