import React from "react";
import { render, screen } from "@testing-library/react";
import "@/util/i18n";
import { store } from "@redux/store";
import Leaderboard from "./index";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";

const LeaderboardWrapper: React.FC = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Leaderboard />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
};

describe("<Leaderboard />", () => {
  test("The leaderboard (table) should be visible with rows 'rank', 'name' and 'score'", async () => {
    render(<LeaderboardWrapper />);

    const table = await screen.findByTestId("leaderboard", undefined, {
      timeout: 10000,
    });
    expect(table).toBeInTheDocument();

    const rankCol = await screen.findByText("Rank", undefined, {
      timeout: 10000,
    });
    expect(rankCol).toBeInTheDocument();

    const nameCol = await screen.findByText("Name", undefined, {
      timeout: 10000,
    });
    expect(nameCol).toBeInTheDocument();

    const scoreCol = await screen.findByText("Score", undefined, {
      timeout: 10000,
    });
    expect(scoreCol).toBeInTheDocument();
  });

  test("The leaderboard entries fetched from the db should be correctly displayed inside the leaderboard", async () => {
    render(<LeaderboardWrapper />);

    const leaderboard = await screen.findByTestId("leaderboard", undefined, {
      timeout: 10000,
    });

    // eslint-disable-next-line testing-library/no-node-access
    const leaderboardRows = leaderboard.querySelectorAll("tr");
    expect(leaderboardRows[1]).toHaveTextContent("1");
    expect(leaderboardRows[1]).toHaveTextContent("UserA");
    expect(leaderboardRows[1]).toHaveTextContent("1000");
    expect(leaderboardRows[2]).toHaveTextContent("2");
    expect(leaderboardRows[2]).toHaveTextContent("UserB");
    expect(leaderboardRows[2]).toHaveTextContent("100");
    expect(leaderboardRows[3]).toHaveTextContent("3");
    expect(leaderboardRows[3]).toHaveTextContent("UserC");
    expect(leaderboardRows[3]).toHaveTextContent("10");
  });
});
