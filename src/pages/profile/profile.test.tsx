import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../../redux/store";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import React from "react";
import Profile from "./profile";

const renderProfile = () => {
  return render(
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Profile />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
};

describe("<Profile/>", () => {
  test("Loading animation is visible", async () => {
    renderProfile();

    const loading = await screen.findByTestId("loading-view");
    expect(loading).toBeInTheDocument();
    expect(loading).toBeVisible();
  });

  test("Profile sider is visible", async () => {
    renderProfile();

    const sider = await screen.findByTestId("profile-sider");
    expect(sider).toBeInTheDocument();
    expect(sider).toBeVisible();
  });

  test("Edit Profile Button is visible", async () => {
    renderProfile();

    const button = await screen.findByTestId("edit-profile", undefined, {
      timeout: 10000,
    });
    expect(button).toBeInTheDocument();
    expect(button).toBeVisible();
  });

  test("User avatar is visible", async () => {
    renderProfile();

    const avatar = await screen.findByTestId("user-avatar", undefined, {
      timeout: 10000,
    });
    expect(avatar).toBeInTheDocument();
    expect(avatar).toBeVisible();
  });

  test("Trainer information card is visible", async () => {
    renderProfile();

    const info = await screen.findByTestId("trainer-information", undefined, {
      timeout: 10000,
    });
    expect(info).toBeInTheDocument();
    expect(info).toBeVisible();
  });

  test("Activity calendar card is visible", async () => {
    renderProfile();

    const calendar = await screen.findByTestId("activity-calendar", undefined, {
      timeout: 10000,
    });
    expect(calendar).toBeInTheDocument();
    expect(calendar).toBeVisible();
  });

  test("Activity overview card is visible", async () => {
    renderProfile();

    const overview = await screen.findByTestId("activity-overview", undefined, {
      timeout: 10000,
    });
    expect(overview).toBeInTheDocument();
    expect(overview).toBeVisible();
  });
});
