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

const { Option } = Select;

interface User {
  key: string;
  name: string;
  trainingplan: string;
  thisweeksactivity: number;
}

const ActiveUserTable = (props: { plans: Plan[] }) => {
  const searchInput = createRef<Input>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [data, setData] = useState<User[]>([]);
  const [, draw] = useState({});

  const redraw = () => draw({});

  const deleteUser = async (id: string) => {
    api.execute(Routes.deleteUser({ userId: id })).then(() => {
      message.success("User deleted");
      setLoading(false);
    });
  };

  useEffect(() => {
    if (!error) return;
    message.error("An error occured!");
  }, [error]);

  useEffect(() => {
    let isMounted = true;
    // load all the plans the user has access to from the API
    if (loading) {
      // load all the users for a trainer
      api.execute(Routes.getTrainerUsers()).then((response) => {
        console.log(response);
        if (!isMounted) return;
        if (!response.success) {
          setError(true);
          return;
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
        setData(userList);
        setLoading(false);
      });
    }
    return () => {
      // clean up
      isMounted = false;
    };
  });

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("name", searchInput, redraw),
    },
    {
      title: "Training Plan",
      dataIndex: "trainingplan",
      key: "trainingplan",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (text: string, record: any) => (
        <Select
          showSearch
          placeholder="Select a plan"
          optionFilterProp="children"
          defaultValue={text}
          onChange={async (value: string) => {
            console.log(value);
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
          {props.plans.map((plan: Plan) => (
            <Option key={plan.id} value={plan.id}>
              {plan.name}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: "This weeks activity",
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
      title: "Manage",
      key: "manage",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (_: unknown, record: any) => (
        <Popconfirm
          title="Are you sure to delete this user?"
          onConfirm={() => deleteUser(record.key)}
          okText="Yes"
          cancelText="No"
          icon={<QuestionCircleOutlined style={{ color: "red" }} />}
        >
          <Button danger value={record}>
            Delete
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
