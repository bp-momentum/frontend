import { Button, Input, message, Popconfirm, Table } from "antd";
import React, { createRef, useEffect, useState } from "react";
import api from "../../../util/api";
import Routes from "../../../util/routes";
import { getColumnSearchProps } from "./tableSearch";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { AlignType } from "rc-table/lib/interface";
import Translations from "../../../localization/translations";
import { t } from "i18next";

interface User {
  key: string;
  name: string;
  last_login: string;
}

const ActiveTrainerTable: React.FC = () => {
  const searchInput = createRef<Input>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [data, setData] = useState<User[]>([]);
  const [, draw] = useState({});

  const redraw = () => draw({});

  const deleteTrainer = async (id: string) => {
    api.execute(Routes.deleteTrainer({ trainerId: id })).then(() => {
      message.success(t(Translations.userManagement.trainerDeleted));
      setLoading(true);
    });
  };

  useEffect(() => {
    if (!error) return;
    message.error(t(Translations.errors.unknownError));
  }, [error]);

  const fetchUsers = async () => {
    const response = await api.execute(Routes.getTrainers());

    if (!response.success) {
      setError(true);
      return [];
    }

    console.log(response.data.trainers);

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
    return userList;
  };

  useEffect(() => {
    let isMounted = true;
    // load a list of trainers
    if (loading) {
      Promise.all([fetchUsers()]).then(([users]) => {
        if (!isMounted) return;
        setLoading(false);
        setData(users);
      });
    }
    return () => {
      // clean up
      isMounted = false;
    };
  });

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
