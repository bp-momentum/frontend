import React, { useEffect } from "react";
import "@styles/Leaderboard.css";
import { Layout, message, Spin, Table } from "antd";
import Container from "@shared/container";
import Routes from "@util/routes";
import Translations from "@localization/translations";
import { t } from "i18next";
import { Content } from "antd/lib/layout/layout";
import Stars from "./components/stars";
import Helper from "@util/helper";
import Crown from "@static/crown.svg";
import { LoadingOutlined } from "@ant-design/icons";
import { useAppSelector } from "@redux/hooks";
import useApi from "@hooks/api";

interface LeaderboardEntry {
  rank: number;
  username: string;
  score: number;
  speed: number;
  intensity: number;
  accuracy: number;
}

/**
 * The leaderboard contains 10 entries (or less, if there are only < 10 users)
 * Shown are the player themselves and 9 surrounding players with their rank and score
 * @returns The page for the leaderboard
 */
const Leaderboard: React.FC = () => {
  const [entries, setEntries] = React.useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = React.useState(true);

  const api = useApi();

  const loadData = async (): Promise<{
    data: LeaderboardEntry[];
    error: string | undefined;
  }> => {
    const response = await api.execute(Routes.getLeaderboard({ count: 10 }));
    if (!response.success) {
      return { error: response.description, data: [] };
    }
    const entries: LeaderboardEntry[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    response.data.leaderboard.forEach((entry: Record<string, any>) => {
      entries.push({
        rank: entry.rank,
        username: entry.username,
        score: entry.score.toFixed(0),
        speed: entry.speed,
        intensity: entry.intensity,
        accuracy: entry.cleanliness,
      });
    });
    return { data: entries, error: undefined };
  };

  useEffect(() => {
    let isMounted = true;
    // load user specific leaderboard
    loadData().then((data) => {
      if (!isMounted) return;
      if (data.error) {
        message.error(data.error);
        return;
      }
      setEntries(data.data);
      setLoading(false);
    });
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const token = useAppSelector((state) => state.token.token);
  const [isTrainer, setIsTrainer] = React.useState(false);
  const [uname, setUname] = React.useState("");

  useEffect(() => {
    if (token) {
      setIsTrainer(Helper.getAccountType(token) === "trainer");
      setUname(Helper.getUserName(token));
    }
  }, [token]);

  const rankColors = ["#f5c842", "#c8c8c8", "#C17913"];

  const tableColumns = [
    {
      title: t(Translations.leaderboard.rank),
      dataIndex: "rank",
      key: "rank",
      render: (text: string, record: LeaderboardEntry) => (
        <div>
          {record.rank === 1 && (
            <img
              src={Crown}
              style={{
                width: "22px",
                position: "absolute",
                top: "3px",
                left: "10px",
                transform: "rotate(-30deg)",
              }}
              alt="Sad Error Face"
            ></img>
          )}
          <div
            className="medalWrapper"
            style={{ background: rankColors[record.rank - 1] }}
          >
            <div className="medal">
              <span
                style={{
                  color: rankColors[record.rank - 1],
                  WebkitTextStroke: "1px black",
                }}
              >
                {text}
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: t(Translations.leaderboard.name),
      dataIndex: "username",
      key: "username",
      render: (username: string) => {
        if (username === uname) return <b>{username}</b>;
        return username;
      },
    },
    {
      title: t(Translations.leaderboard.score),
      dataIndex: "score",
      key: "score",
      align: "center" as const,
    },
    {
      title: (
        <div style={{ width: "100%" }}>
          {t(Translations.leaderboard.details)}
          <br />
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span style={{ width: "100px", fontSize: 17 }}>
              {t(Translations.training.speed)}
            </span>
            <span style={{ width: "100px", fontSize: 17 }}>
              {t(Translations.training.accuracy)}
            </span>
            <span style={{ width: "100px", fontSize: 17 }}>
              {t(Translations.training.intensity)}
            </span>
          </div>
        </div>
      ),
      dataIndex: "speed",
      key: "stats",
      colSpan: 3,
      render: (_: string, record: LeaderboardEntry) => {
        return <Stars rating={record.speed} />;
      },
    },
    {
      colSpan: 0,
      dataIndex: "accuracy",
      render: (_: string, record: LeaderboardEntry) => {
        return <Stars rating={record.accuracy} />;
      },
    },
    {
      colSpan: 0,
      dataIndex: "intensity",
      render: (_: string, record: LeaderboardEntry) => {
        return <Stars rating={record.intensity} />;
      },
    },
  ];

  return (
    <Container color="blue" currentPage="leaderboard">
      <Layout style={{ height: "100%" }}>
        <Content
          style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h1 style={{ fontSize: "40px", margin: "30px 0px" }}>Rangliste</h1>
          <div
            style={{
              background: "#EEEEEE",
              padding: "20px",
              borderRadius: "20px",
              border: "1px solid black",
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.5)",
            }}
          >
            {loading ? (
              <>
                <Spin
                  indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
                />
                <div>{t(Translations.planManager.loading)}</div>
              </>
            ) : (
              <Table
                data-testid="leaderboard"
                dataSource={entries}
                columns={tableColumns}
                rowKey={(entry) => entry.rank}
                pagination={
                  isTrainer
                    ? {
                        pageSize: 5,
                      }
                    : false
                }
              />
            )}
          </div>
        </Content>
      </Layout>
    </Container>
  );
};

export default Leaderboard;
