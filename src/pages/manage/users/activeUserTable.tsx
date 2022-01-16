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

interface User {
  key: string;
  name: string;
  trainingplan: string;
  thisweeksactivity: number;
}

const ActiveUserTable = () => {
  const searchInput = createRef<Input>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [data, setData] = useState<User[]>([]);
  const [plans, setPlans] = React.useState<Plan[]>([]);
  const [, draw] = useState({});

  const redraw = () => draw({});

  const deleteUser = async (id: string) => {
    api.execute(Routes.deleteUser({ userId: id })).then(() => {
      message.success(t(Translations.userManagement.userDeleted));
      setLoading(false);
    });
  };

  useEffect(() => {
    if (!error) return;
    message.error(t(Translations.errors.unknownError));
  }, [error]);

  const fetchUsers = async () => {
    const response = await api.execute(Routes.getTrainerUsers());

    if (!response.success) {
      setError(true);
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
      });
    });
    return userList;
  };

  const fetchPlans = async () => {
    const response = await api.execute(Routes.getTrainingPlans());
    if (!response.success) {
      setError(true);
      return [];
    }
    const planList: Plan[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    response.data.plans.forEach((plan: Record<string, any>) => {
      planList.push({ id: plan.id, name: plan.name });
    });
    return planList;
  };

  useEffect(() => {
    let isMounted = true;
    // load all the plans the user has access to from the API
    if (loading) {
      Promise.all([fetchUsers(), fetchPlans()]).then(([users, plans]) => {
        if (!isMounted) return;
        setLoading(false);
        setData(users);
        setPlans(plans);
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
          onChange={async (value: string) => {
            api
              .execute(
                Routes.assignPlanToUser({
                  planId: value,
                  username: record.name,
                })
              )
              .then((response) => {
                if (!response.success) {
                  message.error(response.description);
                }
              });
          }}
          filterOption={(input, option) => {
            if (!option || !option.children) return false;
            return (
              (option.children as unknown as string)
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            );
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
        <Tooltip title={text + " %"}>
          <Progress percent={text} showInfo={false}>
            {" "}
          </Progress>
        </Tooltip>
      ),
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
