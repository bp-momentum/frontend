import "@testing-library/react";
import { render, screen } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { store } from "../../../redux/store";
import ActiveUserTable from "./activeUserTable";

const ActiveUserTableWrapper: React.FC = () => {
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
    render(<ActiveUserTableWrapper />);
  });

  test("should render the table", async () => {
    render(<ActiveUserTableWrapper />);

    const table = await screen.findByRole("table");
    expect(table).toBeInTheDocument();
    expect(table).toBeVisible();
  });
});
