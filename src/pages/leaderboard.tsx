import React, { useEffect } from "react";
import { Layout, Spin, Table } from "antd";
import Container from "../shared/container";
import api from "../util/api";
import Routes from "../util/routes";
import { LoadingOutlined } from "@ant-design/icons";
import Translations from "../localization/translations";
import { t } from "i18next";

interface LeaderboardEntry {
  rank: number,
  username: string,
  score: number,
}

/**
 * 
 * @returns The page for the leaderboard
 */
const Leaderboard = (): JSX.Element => {
  const [entries, setEntries] = React.useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    // load user specific leaderboard
    if (loading){
      api.execute(Routes.getLeaderboard({count: 10})).then(response => {
        if (!isMounted) return;
        if (!response.success) {
          setError(true);
          return;
        }
        const entries: LeaderboardEntry[] = [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        response.data.leaderboard.forEach((entry: Record<string, any>) => {
          entries.push({rank: entry.rank, username: entry.username, score: entry.score});
        });
        setEntries(entries);
        setLoading(false);
      });
      return () => {
        // clean up
        isMounted = false;
      };
    }
  });

  const tableColumns = [
    {
      title:  t(Translations.leaderboard.rank),
      dataIndex: "rank",
      key: "rank",
    },
    {
      title: t(Translations.leaderboard.name),
      dataIndex: "username",
      key: "username",
    },
    {
      title: t(Translations.leaderboard.score),
      dataIndex: "score",
      key: "score",
    },
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
          <Table data-testid="leaderboard" style={{margin: "5%"}} dataSource={entries} columns={tableColumns} rowKey={(entry) => entry.username} pagination={false} />
        )}
      </Layout>
    </Container>
  );
};


export default Leaderboard;
