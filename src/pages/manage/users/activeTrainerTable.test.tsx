import "@testing-library/react";
import { render, screen } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { store } from "../../../redux/store";
import ActiveTrainerTable from "./activeTrainerTable";

const renderActiveTrainerTable = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ActiveTrainerTable />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
};

describe("<ActiveTrainerTable />", () => {
  test("should render", () => {
    render(renderActiveTrainerTable());
  });

  test("should render the table", async () => {
    render(renderActiveTrainerTable());

    const table = await screen.findByRole("table");
    expect(table).toBeInTheDocument();
    expect(table).toBeVisible();
  });
});
