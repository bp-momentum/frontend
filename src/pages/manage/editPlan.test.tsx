import React from "react";
import { render, waitFor, screen, fireEvent } from "@testing-library/react";
import "@/i18n";
import { store } from "@redux/store";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import EditPlan from "./editPlan";

const PlanEditorWrapper: React.FC = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<EditPlan />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
};

describe("<EditPlan />", () => {
  test("The Test Exercise should be in the store.", async () => {
    render(<PlanEditorWrapper />);

    const addButton = await screen.findByText("Test Exercise", undefined, {
      timeout: 10000,
    });
    expect(addButton).toBeInTheDocument();
  });

  test("The garbage Sider should be visible while dragging.", async () => {
    render(<PlanEditorWrapper />);

    const addButton = await screen.findByText("Test Exercise", undefined, {
      timeout: 10000,
    });
    const garbage = await screen.findByTestId("garbage", undefined, {
      timeout: 10000,
    });

    expect(garbage).not.toBeVisible();

    fireEvent.mouseDown(addButton, {
      clientX: 10,
      clientY: 20,
      buttons: 1,
      bubbles: true,
    });
    fireEvent.mouseMove(addButton, {
      clientX: 10,
      clientY: 120,
      buttons: 1,
      bubbles: true,
    });

    await waitFor(() => expect(garbage).toBeVisible(), { timeout: 1000 });
  });
});
