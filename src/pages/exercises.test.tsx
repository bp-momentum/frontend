import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import React from "react";
import Exercises from "./exercises";
import { EmojiProvider } from "react-apple-emojis";
import emojiData from "react-apple-emojis/lib/data.json";

const renderExercises = () => {
  return render(
    <Provider store={store}>
      <BrowserRouter>
        <EmojiProvider data={emojiData}>
          <Routes>
            <Route path="/" element={<Exercises />} />
          </Routes>
        </EmojiProvider>
      </BrowserRouter>
    </Provider>
  );
};

describe("<Exercises/>", () => {
  test("Button to go to next exercise is visible", async () => {
    renderExercises();

    const button = await screen.findByRole("button", {
      name: "nextExerciseButton",
    });
    expect(button).toBeInTheDocument();
  });

  test("Monday is visible", async () => {
    renderExercises();

    const card = await screen.findByTestId("monday");
    expect(card).toBeInTheDocument();
    expect(card).toBeVisible();
  });
});
