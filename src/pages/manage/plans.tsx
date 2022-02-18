import React, { useEffect } from "react";
import PlusOutlined from "@ant-design/icons/lib/icons/PlusOutlined";
import { Button, Col, Layout, Row, Spin } from "antd";
import { Content } from "antd/lib/layout/layout";
import { useNavigate } from "react-router";
import Container from "../../shared/container";
import { Shapes } from "../../shared/shapes";
import api from "../../util/api";
import Routes from "../../util/routes";
import { LoadingOutlined } from "@ant-design/icons";
import Translations from "../../localization/translations";
import { t } from "i18next";
import { Plan } from "../../api/plan";

/**
 * Consists of a list of all the plans the user has access to.
 * @returns The page for managing plans.
 */
const ManagePlans: React.FC = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = React.useState<Plan[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    // load all the plans the user has access to from the API
    if (loading)
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
    return () => {
      // clean up
      isMounted = false;
    };
  });

  return (
    <Container color="blue" currentPage="manage">
      <Layout
        style={{
          height: "100%",
          position: "absolute",
          maxHeight: "100%",
          width: "100%",
        }}
      >
        {loading ? (
          <div
            style={{
              height: "100%",
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            {error ? (
              <div>{t(Translations.planManager.error)}</div>
            ) : (
              <>
                <Spin
                  indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
                />
                <div>{t(Translations.planManager.loading)}</div>
              </>
            )}
          </div>
        ) : (
          <Content style={{ padding: "70px 100px", display: "flex" }}>
            <Row gutter={20}>
              {plans.map((plan) => (
                <Col
                  key={plan.id}
                  style={{ display: "flex", flexDirection: "column" }}
                >
                  <Button
                    style={{
                      width: "150px",
                      height: "100px",
                      position: "relative",
                      padding: "0",
                      overflow: "hidden",
                    }}
                    onClick={() => navigate(`/manage/plans/${plan.id}`)}
                  >
                    <Shapes />
                  </Button>
                  {plan.name}
                </Col>
              ))}
              <Col style={{ display: "flex", flexDirection: "column" }}>
                <Button
                  aria-label="planAddingButton"
                  onClick={() => {
                    navigate("new");
                  }}
                  style={{ width: "150px", minWidth: "150px", height: "100px" }}
                >
                  <PlusOutlined />
                </Button>
                <span style={{ fontWeight: 200, fontStyle: "italic" }}>
                  {t(Translations.planManager.newPlan)}
                </span>
              </Col>
            </Row>
          </Content>
        )}
      </Layout>
    </Container>
  );
};

export default ManagePlans;
