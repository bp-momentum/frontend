import React, { useEffect } from "react";
import PlusOutlined from "@ant-design/icons/lib/icons/PlusOutlined";
import { Button, Col, Layout, message, Row, Spin } from "antd";
import { Content } from "antd/lib/layout/layout";
import { useNavigate } from "react-router";
import Container from "@shared/container";
import { Shapes } from "@shared/shapes";
import Routes from "@util/routes";
import { LoadingOutlined } from "@ant-design/icons";
import Translations from "@localization/translations";
import { Plan } from "@api/plan";
import useApi from "@hooks/api";
import { useTranslation } from "react-i18next";

/**
 * Consists of a list of all the plans the user has access to.
 * @returns {JSX.Element} The page
 */
const ManagePlans: React.FC = (): JSX.Element => {
  const { t } = useTranslation();

  const navigate = useNavigate();
  const [plans, setPlans] = React.useState<Plan[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);

  const api = useApi();

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

  useEffect(() => {
    let isMounted = true;
    // load all the plans the user has access to from the API
    fetchPlans().then((data) => {
      if (isMounted) {
        setPlans(data);
        setLoading(false);
      }
    });
    return () => {
      // clean up
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container currentPage="manage">
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
            <Spin
              indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
            />
            <div>{t(Translations.planManager.loading)}</div>
          </div>
        ) : (
          <Content style={{ padding: "70px 100px", display: "flex" }}>
            <Row gutter={20}>
              {plans.map((plan) => (
                <Col
                  key={plan.id}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
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
                    className="no-font-fix-button-weirdness"
                  >
                    <Shapes />
                  </Button>
                  <span
                    style={{
                      width: "150px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {plan.name}
                  </span>
                </Col>
              ))}
              <Col style={{ display: "flex", flexDirection: "column" }}>
                <Button
                  aria-label="planAddingButton"
                  onClick={() => {
                    navigate("new");
                  }}
                  style={{ width: "150px", minWidth: "150px", height: "100px" }}
                  className="no-font-fix-button-weirdness"
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
