import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "@redux/store";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import React from "react";
import Exercises from ".";

const ExercisesWrapper: React.FC = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Exercises />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
};

describe("<Exercises/>", () => {
  test("Monday is visible", async () => {
    render(<ExercisesWrapper />);

    const card = await screen.findByTestId("monday");
    expect(card).toBeInTheDocument();
    expect(card).toBeVisible();
  });
});
