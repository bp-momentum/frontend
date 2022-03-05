import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../../../redux/store";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import React from "react";
import Profile from "./index";

const ProfileWrapper: React.FC = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Profile />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
};

describe("<Index/>", () => {
  test("Loading animation is visible", async () => {
    render(<ProfileWrapper />);

    const loading = await screen.findByTestId("loading-view");
    expect(loading).toBeInTheDocument();
    expect(loading).toBeVisible();
  });

  test("Index sider is visible from beginning", async () => {
    render(<ProfileWrapper />);

    const sider = await screen.findByTestId("profile-sider");
    expect(sider).toBeInTheDocument();
    expect(sider).toBeVisible();
  });

  test("Cards are visible", async () => {
    render(<ProfileWrapper />);

    const profile = await screen.findByTestId("user-card", undefined, {
      timeout: 15000,
    });
    expect(profile).toBeInTheDocument();
    expect(profile).toBeVisible();

    const editButton = await screen.findByTestId("edit-profile", undefined, {
      timeout: 10000,
    });
    expect(editButton).toBeInTheDocument();
    expect(editButton).toBeVisible();

    const avatar = await screen.findByTestId("user-avatar", undefined, {
      timeout: 10000,
    });
    expect(avatar).toBeInTheDocument();
    expect(avatar).toBeVisible();

    const info = await screen.findByTestId("trainer-information", undefined, {
      timeout: 10000,
    });
    expect(info).toBeInTheDocument();
    expect(info).toBeVisible();

    const calendar = await screen.findByTestId("activity-calendar", undefined, {
      timeout: 10000,
    });
    expect(calendar).toBeInTheDocument();
    expect(calendar).toBeVisible();

    const overview = await screen.findByTestId(
      "daily-summary-card",
      undefined,
      {
        timeout: 10000,
      }
    );
    expect(overview).toBeInTheDocument();
    expect(overview).toBeVisible();
  });
});
