import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "@redux/store";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import React from "react";
import Exercises from "./index";
import { EmojiProvider } from "react-apple-emojis";
import emojiData from "react-apple-emojis/lib/data.json";

const ExercisesWrapper: React.FC = () => {
  return (
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
  test("Monday is visible", async () => {
    render(<ExercisesWrapper />);

    const card = await screen.findByTestId("monday");
    expect(card).toBeInTheDocument();
    expect(card).toBeVisible();
  });
});
