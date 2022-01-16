import "@testing-library/react";
import { render, screen } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { store } from "../../../redux/store";
import ActiveUserTable from "./activeUserTable";

const renderActiveUserTable = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ActiveUserTable />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
};

describe("<ActiveUserTable />", () => {
  test("should render", () => {
    render(renderActiveUserTable());
  });

  test("should render the table", async () => {
    render(renderActiveUserTable());

    const table = await screen.findByRole("table");
    expect(table).toBeInTheDocument();
    expect(table).toBeVisible();
  });
});
