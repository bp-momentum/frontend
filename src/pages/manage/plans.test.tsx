import React from "react";
import { render, screen } from "@testing-library/react";
import "@util/i18n";
import { store } from "@redux/store";
import ManagePlans from "./plans";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";

const PlanManagerWrapper: React.FC = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ManagePlans />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
};

describe("<ManagePlans />", () => {
  test("An add plan button should be visible.", async () => {
    render(<PlanManagerWrapper />);

    const addButton = await screen.findByRole(
      "button",
      { name: "planAddingButton" },
      { timeout: 10000 }
    );
    expect(addButton).toBeInTheDocument();
  });

  test("A plan should be visible.", async () => {
    render(<PlanManagerWrapper />);

    const plan = await screen.findByText("Test Plan", undefined, {
      timeout: 10000,
    });
    expect(plan).toBeInTheDocument();
  });
});
