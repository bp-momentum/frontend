import React, { useEffect } from "react";
import PlusOutlined from "@ant-design/icons/lib/icons/PlusOutlined";
import { Button, Col, Layout, Row, Spin, Table } from "antd";
import { Content } from "antd/lib/layout/layout";
import { useNavigate } from "react-router";
import Container from "../shared/container";
import { Shapes } from "../shared/shapes";
import api from "../util/api";
import Routes from "../util/routes";
import { LoadingOutlined } from "@ant-design/icons";
import Translations from "../localization/translations";
import { t } from "i18next";

interface LeaderboardEntry {
  username: string,
  stat1: number,
  stat2: number,
  stat3: number,
  totalScore: number,
}

/**
 * 
 * @returns The page for the leaderboard
 */
const Leaderboard = (): JSX.Element => {
  const navigate = useNavigate();
  const [entries, setEntries] = React.useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<boolean>(false);

  useEffect(() => {
    // load all the plans the user has access to from the API
    if (loading){
      //setEntries(entriesFromApiNicelyOrderedTYVM);
      api.execute(Routes.getLeaderboard()).then(response => {
        if (!response.success) {
          setError(true);
          return;
        }
        const entries: LeaderboardEntry[] = [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        response.data.leaderboard.forEach((entry: Record<string, any>) => {
          entries.push({username: entry.username, totalScore: entry.score, stat1: -1, stat2: -1, stat3: -1});
        });
        setEntries(entries);
        setLoading(false);
      });
    }
  });

  const tableColumns = [
    {
      title: "Name",
      dataIndex: "username",
      // defaultSortOrder: "descend",
      // sorter: (a: string, b: string) => a.localeCompare(b),
    },
    {
      title: "Total Score",
      dataIndex: "totalScore",
      key: "totalScore"
    },
    {
      title: "Stat 1",
      dataIndex: "stat1",
      key: "stat1"
    },
    {
      title: "Stat 2",
      dataIndex: "stat2",
      key: "stat2"
    },
    {
      title: "Stat 3",
      dataIndex: "stat3",
      key: "stat3"
    },
  ];

  const entriesFromApiNicelyOrderedTYVM : LeaderboardEntry[] = [
    {username: "User1", stat1: 99, stat2: 2, stat3: 51, totalScore: 152},
    {username: "User5", stat1: 25, stat2:99, stat3:27, totalScore: 151},
    {username: "User4", stat1: 71, stat2:54, stat3:3, totalScore: 128},
    {username: "User2", stat1: 33, stat2:61, stat3:22, totalScore: 116},
    {username: "User3", stat1: 26, stat2:17, stat3:8, totalScore: 51},
  ];

  return (
    <Container
      color="blue"
      currentPage="leaderboard"
    >
      <Layout style={{height: "100%", position: "absolute", maxHeight: "100%", width: "100%"}}>
        {loading ? (
          <div style={{height: "100%", width: "100%", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column"}}>
            {error ? <div>{t(Translations.planManager.error)}</div> : <><Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} /><div>{t(Translations.planManager.loading)}</div></>}
          </div>
        ) : (
          <Table style={{margin: "5%"}} dataSource={entries} columns={tableColumns} />
        )}
      </Layout>
    </Container>
  );
};


export default Leaderboard;
