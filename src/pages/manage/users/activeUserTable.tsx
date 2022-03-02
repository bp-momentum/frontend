import {
  Button,
  Input,
  message,
  Popconfirm,
  Progress,
  Select,
  Table,
  Tooltip,
} from "antd";
import React, { createRef, useEffect, useState } from "react";
import { Plan } from "../../../api/plan";
import api from "../../../util/api";
import Routes from "../../../util/routes";
import { getColumnSearchProps } from "./tableSearch";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { t } from "i18next";
import Translations from "../../../localization/translations";

const { Option } = Select;

const fetchUsers = async () => {
  const response = await api.execute(Routes.getTrainerUsers());

  if (!response) return [];

  if (!response.success) {
    message.error(response.description);
    return [];
  }

  const userList: User[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  response.data.users.forEach((user: Record<string, any>) => {
    userList.push({
      key: user.id,
      name: user.username,
      trainingplan: user.plan,
      thisweeksactivity: user.done_exercises || 0,
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

const fetchPlans = async () => {
  const response = await api.execute(Routes.getTrainingPlans());
  if (!response) return [];

  if (!response.success) {
    message.error(response.description);
    return [];
  }
  const planList: Plan[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  response.data.plans.forEach((plan: Record<string, any>) => {
    planList.push({ id: plan.id, name: plan.name });
  });
  return planList;
};

interface User {
  key: string;
  name: string;
  trainingplan: string;
  thisweeksactivity: number;
  last_login: string;
}

const ActiveUserTable: React.FC = () => {
  const searchInput = createRef<Input>();
  const [data, setData] = useState<User[]>([]);
  const [plans, setPlans] = React.useState<Plan[]>([]);
  const [isMounted, setIsMounted] = useState(true);

  const loadData = () => {
    Promise.all([fetchUsers(), fetchPlans()]).then(([users, plans]) => {
      if (!isMounted) return;
      setData(users);
      setPlans(plans);
    });
  };

  const deleteUser = async (id: string) => {
    api.execute(Routes.deleteUser({ userId: id })).then(() => {
      message.success(t(Translations.userManagement.userDeleted));
      loadData();
    });
  };

  useEffect(() => {
    setIsMounted(true);
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
        loadData,
        t(Translations.userManagement.SearchName)
      ),
    },
    {
      title: t(Translations.userManagement.trainingPlan),
      dataIndex: "trainingplan",
      key: "trainingplan",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (text: string, record: any) => (
        <Select
          showSearch
          placeholder={t(Translations.userManagement.selectPlan)}
          optionFilterProp="children"
          defaultValue={text}
          style={{ width: "200px" }}
          allowClear={true}
          onChange={async (value: string) => {
            api
              .execute(
                Routes.assignPlanToUser({
                  planId: value ?? null,
                  username: record.name,
                })
              )
              .then((response) => {
                if (!response.success) {
                  message.error(response.description);
                }
                loadData();
              });
          }}
        >
          {plans.map((plan: Plan) => (
            <Option key={plan.id} value={plan.id}>
              {plan.name}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: t(Translations.userManagement.activity),
      dataIndex: "thisweeksactivity",
      key: "thisweeksactivity",
      render: (text: number) => (
        <Tooltip
          title={Math.round((text * 100 + Number.EPSILON) * 100) / 100 + " %"}
        >
          <Progress percent={text * 100} showInfo={false}>
            {" "}
          </Progress>
        </Tooltip>
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (_: unknown, record: any) => (
        <Popconfirm
          title={t(Translations.userManagement.deleteUserConfirm)}
          onConfirm={() => deleteUser(record.key)}
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

export default ActiveUserTable;
