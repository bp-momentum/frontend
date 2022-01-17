import { Button, Input, message, Popconfirm, Table } from "antd";
import React, { createRef, useEffect, useState } from "react";
import api from "../../../util/api";
import Routes from "../../../util/routes";
import { getColumnSearchProps } from "./tableSearch";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { AlignType } from "rc-table/lib/interface";
import { t } from "i18next";
import Translations from "../../../localization/translations";

interface User {
  key: string;
  name: string;
  email: string;
}

const InvitedUserTable = () => {
  const searchInput = createRef<Input>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [data, setData] = useState<User[]>([]);
  const [, draw] = useState({});

  const redraw = () => draw({});

  const cancelInvitation = async (id: string) => {
    // api.execute(Routes.cancelInvitation({ userId: id })).then(() => {
    //   message.success(t(Translations.userManagement.cancelInvite));
    //   setLoading(1);
    // });
  };

  useEffect(() => {
    let isMounted = true;
    // load all the plans the user has access to from the API
    if (loading) {
      // load all the users for a trainer
      // api.execute(Routes.getInvitedTrainers()).then((response) => {
      //   if (!isMounted) return;
      //   if (!response.success) {
      //     setError(true);
      //     return;
      //   }
      //   const userList: User[] = [];
      //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
      //   response.data.users.forEach((user: Record<string, any>) => {
      //     userList.push({
      //       key: user.id,
      //       name: user.username,
      //       email: user.email || "email not provided",
      //     });
      //   });
      //   setData(userList);
      //   setLoading(false);
      // });
    }
    return () => {
      // clean up
      isMounted = false;
    };
  });

  useEffect(() => {
    if (!error) return;
    message.error(t(Translations.errors.unknownError));
  }, [error]);

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
      render: (text: string) => (
        <span style={{ minWidth: "100px", display: "block" }}>{text}</span>
      ),
    },
    {
      title: t(Translations.userManagement.email),
      dataIndex: "email",
      key: "email",
      ...getColumnSearchProps(
        "email",
        searchInput,
        redraw,
        t(Translations.userManagement.SearchEmail)
      ),
      render: (text: string) => (
        <span style={{ minWidth: "150px", display: "block" }}>{text}</span>
      ),
    },
    {
      title: t(Translations.userManagement.revoke),
      key: "cancel",
      align: "right" as AlignType,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (_: unknown, record: any) => (
        <div style={{ minWidth: "150px" }}>
          <Popconfirm
            title={t(Translations.userManagement.cancelInviteConfirm)}
            onConfirm={() => cancelInvitation(record.key)}
            okText={t(Translations.confirm.yes)}
            cancelText={t(Translations.confirm.no)}
            icon={<QuestionCircleOutlined style={{ color: "red" }} />}
          >
            <Button danger value={record}>
              {t(Translations.userManagement.revoke)}
            </Button>
          </Popconfirm>
        </div>
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

export default InvitedUserTable;
