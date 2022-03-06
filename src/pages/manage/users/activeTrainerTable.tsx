import { Button, Input, message, Popconfirm, Table } from "antd";
import React, { createRef, useEffect, useState } from "react";
import Routes from "@util/routes";
import { getColumnSearchProps } from "./tableSearch";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { AlignType } from "rc-table/lib/interface";
import Translations from "@localization/translations";
import { t } from "i18next";
import useApi from "@hooks/api";

interface User {
  key: string;
  name: string;
  last_login: string;
}

const ActiveTrainerTable: React.FC = () => {
  const searchInput = createRef<Input>();
  const [data, setData] = useState<User[]>([]);
  const [, draw] = useState({});

  const redraw = () => draw({});

  const [isMounted, setIsMounted] = useState(true);

  const api = useApi();

  const fetchUsers = async () => {
    const response = await api.execute(Routes.getTrainers());

    if (!response) return [];

    if (!response.success) {
      message.error(response.description);
      return [];
    }

    const userList: User[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    response.data.trainers.forEach((user: Record<string, any>) => {
      userList.push({
        key: user.id,
        name: user.username,
        last_login: user.last_login || (
          <i>{t(Translations.userManagement.never)}</i>
        ),
      });
    });
    userList.sort((a, b) => {
      if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
      if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
      return 0;
    });
    return userList;
  };

  const loadData = () => {
    fetchUsers().then((users) => {
      if (!isMounted) return;
      setData(users);
    });
  };

  const deleteTrainer = async (id: string) => {
    api.execute(Routes.deleteTrainer({ trainerId: id })).then(() => {
      message.success(t(Translations.userManagement.trainerDeleted));
      loadData();
    });
  };

  useEffect(() => {
    // load a list of trainers
    loadData();

    return () => {
      // clean up
      setIsMounted(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns = [
    {
      title: t(Translations.userManagement.name),
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps(
        "name",
        searchInput,
        redraw,
        t(Translations.userManagement.SearchName)
      ),
    },
    {
      title: t(Translations.userManagement.lastLogin),
      dataIndex: "last_login",
      key: "lastLogin",
    },
    {
      title: t(Translations.userManagement.manage),
      key: "manage",
      align: "right" as AlignType,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (_: unknown, record: any) => (
        <Popconfirm
          title={t(Translations.userManagement.deleteTrainerConfirm)}
          onConfirm={() => deleteTrainer(record.key)}
          okText={t(Translations.confirm.yes)}
          okType="danger"
          cancelText={t(Translations.confirm.no)}
          icon={<QuestionCircleOutlined style={{ color: "red" }} />}
        >
          <Button danger value={record}>
            {t(Translations.confirm.delete)}
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <Table
      style={{ background: "transparent" }}
      columns={columns}
      dataSource={data}
      pagination={{ pageSize: 5 }}
    ></Table>
  );
};

export default ActiveTrainerTable;
