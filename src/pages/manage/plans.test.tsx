import React from "react";
import { render, screen } from "@testing-library/react";
import "../../i18n";
import { store } from "../../redux/store";
import ManagePlans from "./plans";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";

const renderPlanManager = () => {
  return render(
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
    renderPlanManager();

    const addButton = await screen.findByRole(
      "button",
      { name: "planAddingButton" },
      { timeout: 10000 }
    );
    expect(addButton).toBeInTheDocument();
  });

  test("A plan should be visible.", async () => {
    renderPlanManager();

    const plan = await screen.findByText("Test Plan", undefined, {
      timeout: 10000,
    });
    expect(plan).toBeInTheDocument();
  });
});
