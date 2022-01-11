import {
  Button,
  Input,
  Layout,
  Progress,
  Select,
  Space,
  Table,
  Tooltip,
} from "antd";
import { Content } from "antd/lib/layout/layout";
import React, { createRef, useEffect, useState } from "react";
import Container from "../../shared/container";
import "../../styles/users.css";
import api from "../../util/api";
import Routes from "../../util/routes";
import { Plan } from "../../api/plan";
import { SearchOutlined } from "@ant-design/icons";

const { Option } = Select;

const Users = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [plans, setPlans] = React.useState<Plan[]>([]);

  const searchInput = createRef<Input>();

  const getColumnSearchProps = (dataIndex: string) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }: any) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => {
            setSelectedKeys(e.target.value ? [e.target.value] : []);
          }}
          onPressEnter={confirm}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={confirm}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => {
              clearFilters();
              confirm();
            }}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value: string | number | boolean, record: any) =>
      typeof value === "string" && record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "",
    onFilterDropdownVisibleChange: (visible: boolean) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text: string) => text,
  });

  useEffect(() => {
    let isMounted = true;
    // load all the plans the user has access to from the API
    if (loading) {
      api.execute(Routes.getTrainingPlans()).then((response) => {
        if (!isMounted) return;
        if (!response.success) {
          setError(true);
          return;
        }
        const planList: Plan[] = [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        response.data.plans.forEach((plan: Record<string, any>) => {
          planList.push({ id: plan.id, name: plan.name });
        });
        setPlans(planList);
        setLoading(false);
      });

      // load all the users for a trainer
      api.execute(Routes.getUsers()).then((response) => {
        console.log(response);
        return response;
      });
    }
    return () => {
      // clean up
      isMounted = false;
    };
  });

  const data = [
    {
      key: 1, // ID
      name: "John Brown",
      trainingplan: 4,
      thisweeksactivity: 50,
    },
    {
      key: 2, // ID
      name: "John Brown 2nd",
      trainingplan: 4,
      thisweeksactivity: 10,
    },
    {
      key: 3, // ID
      name: "John Brown 3rd",
      trainingplan: 4,
      thisweeksactivity: 20,
    },
    {
      key: 4, // ID
      name: "John Brown 4th",
      trainingplan: 4,
      thisweeksactivity: 30,
    },
    {
      key: 5, // ID
      name: "John Brown 5th",
      trainingplan: 4,
      thisweeksactivity: 40,
    },
    {
      key: 6, // ID
      name: "John Brown 6th",
      trainingplan: 4,
      thisweeksactivity: 50,
    },
    {
      key: 7, // ID
      name: "John Brown 7th",
      trainingplan: 4,
      thisweeksactivity: 60,
    },
    {
      key: 8, // ID
      name: "John Brown 8th",
      trainingplan: 4,
      thisweeksactivity: 70,
    },
    {
      key: 9, // ID
      name: "John Brown 9th",
      trainingplan: 4,
      thisweeksactivity: 80,
    },
    {
      key: 10, // ID
      name: "John Brown 10th",
      trainingplan: 4,
      thisweeksactivity: 90,
    },
    {
      key: 11, // ID
      name: "John Brown 11th",
      trainingplan: 4,
      thisweeksactivity: 100,
    },
  ];

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Training Plan",
      dataIndex: "trainingplan",
      key: "trainingplan",
      render: (text: string) => (
        <Select
          showSearch
          placeholder="Select a plan"
          optionFilterProp="children"
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
      render: (_: unknown, record: any) => (
        <Button danger value={record}>
          Delete
        </Button>
      ),
    },
  ];

  return (
    <Container currentPage="manage">
      <Layout style={{ height: "100%" }}>
        <Content
          style={{
            background: "#466995",
            height: "100%",
            color: "white",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h1 style={{ fontSize: "40px", margin: "30px 0px" }}>Users</h1>
          <div
            style={{
              background: "#EEEEEE",
              padding: "20px",
              borderRadius: "20px",
              border: "1px solid black",
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.5)",
            }}
          >
            <Table
              style={{ background: "transparent" }}
              columns={columns}
              dataSource={data}
              pagination={{ pageSize: 5 }}
            ></Table>
          </div>
        </Content>
      </Layout>
    </Container>
  );
};

export default Users;
