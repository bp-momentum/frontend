import React from "react";
import PlusOutlined from "@ant-design/icons/lib/icons/PlusOutlined";
import { Button, Col, Layout, Row } from "antd";
import { Content } from "antd/lib/layout/layout";
import { useNavigate } from "react-router";
import Container from "../../shared/container";
import { Shapes } from "../../shared/shapes";

interface Plan {
  id: number;
  name: string;
}

const plans: Plan[] = [
  {
    id: 1,
    name: "Plan 1"
  },
  {
    id: 2,
    name: "Plan 2"
  },
  {
    id: 3,
    name: "Plan 3"
  },
  {
    id: 4,
    name: "Plan 4"
  },
];

const ManagePlans = () : JSX.Element => {
  const navigate = useNavigate();

  return (
    <Container
      color="blue"
      currentPage="manage"
    >
      <Layout style={{height: "100%", position: "absolute", maxHeight: "100%", width: "100%"}}>
        <Content style={{padding: "70px 100px", display: "flex"}}>
          <Row gutter={20} >
            {plans.map(plan => 
              <Col key={plan.id} style={{display: "flex", flexDirection: "column"}}>
                <Button
                  style={{width: "150px", height: "100px", position: "relative", padding: "0"}}
                  onClick={() => navigate(`/manage/plans/${plan.id}`)}
                >
                  <Shapes />
                </Button>
                {plan.name}
              </Col>
            )}
            <Col style={{display: "flex", flexDirection: "column"}}>
              <Button onClick={() => {navigate("1");}} style={{width: "150px", minWidth: "150px", height: "100px"}}>
                <PlusOutlined />
              </Button>
              <span style={{fontWeight: 200, fontStyle: "italic"}}>New Plan</span>
            </Col>
          </Row>
        </Content>
      </Layout>
    </Container>
  );
};

export default ManagePlans;