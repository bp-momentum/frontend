import { Layout, message } from "antd";
import { Content } from "antd/lib/layout/layout";
import React, { useEffect, useState } from "react";
import Container from "../../../shared/container";
import api from "../../../util/api";
import Routes from "../../../util/routes";
import { Plan } from "../../../api/plan";
import { Tabs } from "antd";
import "../../../styles/users.css";
import ActiveUserTable from "./activeUserTable";
import InvitedUserTable from "./invitedUserTable";
import CreateUser from "./createUser";
import {
  PlusCircleOutlined,
  FormOutlined,
  RocketOutlined,
} from "@ant-design/icons";

const { TabPane } = Tabs;

const Users = () => {
  const [loading, setLoading] = useState(0);
  const [error, setError] = useState(false);
  const [plans, setPlans] = React.useState<Plan[]>([]);

  useEffect(() => {
    let isMounted = true;
    // load all the plans the user has access to from the API
    if (loading === 0) {
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
        console.log(planList);
        setLoading(1);
      });
    }
    return () => {
      // clean up
      isMounted = false;
    };
  });

  useEffect(() => {
    if (!error) return;
    message.error("An error occured!");
  }, [error]);

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
            <Tabs type="card" centered>
              <TabPane
                tab={
                  <>
                    <RocketOutlined />
                    Active
                  </>
                }
                key="1"
              >
                <ActiveUserTable plans={plans} />
              </TabPane>
              <TabPane
                tab={
                  <>
                    <FormOutlined />
                    Invited
                  </>
                }
                key="2"
              >
                <InvitedUserTable />
              </TabPane>
              <TabPane
                tab={
                  <>
                    <PlusCircleOutlined />
                    Invite
                  </>
                }
                key="3"
              >
                <CreateUser />
              </TabPane>
            </Tabs>
          </div>
        </Content>
      </Layout>
    </Container>
  );
};

export default Users;
