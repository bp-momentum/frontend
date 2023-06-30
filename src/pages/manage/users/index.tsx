import { Layout } from "antd";
import { Content } from "antd/lib/layout/layout";
import React from "react";
import Container from "@shared/container";
import { Tabs } from "antd";
import "@styles/users.css";
import ActiveUserTable from "./activeUserTable";
import InvitedUserTable from "./invitedUserTable";
import CreateUser from "./createUser";
import {
  PlusCircleOutlined,
  FormOutlined,
  RocketOutlined,
} from "@ant-design/icons";
import { Navigate } from "react-router-dom";
import ActiveTrainerTable from "./activeTrainerTable";
import Translations from "@localization/translations";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "@redux/hooks";

const { TabPane } = Tabs;

/**
 * A container to list manage users
 * @returns {JSX.Element} The page
 */
const Users: React.FC = (): JSX.Element => {
  const { t } = useTranslation();

  const role = useAppSelector((state) => state.profile.role);

  const [updateValue, setUpdateValue] = React.useState(0);

  if (role === "player") return <Navigate to="/" />;

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
            overflow: "auto",
          }}
        >
          <h1 style={{ fontSize: "40px", margin: "30px 0px" }}>
            {role === "trainer"
              ? t(Translations.userManagement.users)
              : t(Translations.userManagement.trainers)}
          </h1>
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
                    {t(Translations.userManagement.active)}
                  </>
                }
                key="1"
              >
                {role === "trainer" ? (
                  <ActiveUserTable />
                ) : (
                  <ActiveTrainerTable />
                )}
              </TabPane>
              <TabPane
                tab={
                  <>
                    <FormOutlined />
                    {t(Translations.userManagement.invited)}
                  </>
                }
                key="2"
              >
                <InvitedUserTable
                  updateValue={updateValue}
                  setUpdateValue={setUpdateValue}
                />
              </TabPane>
              <TabPane
                tab={
                  <>
                    <PlusCircleOutlined />
                    {t(Translations.userManagement.invite)}
                  </>
                }
                key="3"
              >
                <CreateUser
                  updateValue={updateValue}
                  setUpdateValue={setUpdateValue}
                />
              </TabPane>
            </Tabs>
          </div>
        </Content>
      </Layout>
    </Container>
  );
};

export default Users;
