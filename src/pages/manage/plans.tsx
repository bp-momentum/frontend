import React from "react";
import PlusOutlined from "@ant-design/icons/lib/icons/PlusOutlined";
import { Button, Col, Layout, Row } from "antd";
import { Content } from "antd/lib/layout/layout";
import { NavigateFunction, useNavigate } from "react-router";
import Container from "../../shared/container";
import { Shapes } from "../../shared/shapes";
import api from "../../util/api";
import Routes from "../../util/routes";

interface Plan {
  id: number;
  name: string;
}

type ManagePlansProps = {
  navigate: NavigateFunction;
};
type ManagePlansState = {
  plans: Plan[];
  loading: boolean;
};

class ManagePlans extends React.Component<ManagePlansProps, ManagePlansState> {
  constructor(props: ManagePlansProps) {
    super(props);
    this.state = {plans: [], loading: true};
  }

  componentDidMount() {
    setTimeout(() => {
      api.execute(Routes.getTrainingPlans({})).then(response => {
        if (!response.success) {
          console.error(response);
          return;
        }
        const planList: Plan[] = [];
        response.data.plans.forEach((plan: Record<string, any>) => {
          planList.push({id: plan.id, name: plan.name});
        });
        this.setState({plans: planList, loading: false});
      });
    }, 500);
  }

  render() {
    return (
      <Container
        color="blue"
        currentPage="manage"
      >
        <Layout style={{height: "100%", position: "absolute", maxHeight: "100%", width: "100%"}}>
          <Content style={{padding: "70px 100px", display: "flex"}}>
            <Row gutter={20} >
              {this.state.plans.map(plan => 
                <Col key={plan.id} style={{display: "flex", flexDirection: "column"}}>
                  <Button
                    style={{width: "150px", height: "100px", position: "relative", padding: "0"}}
                    onClick={() => this.props.navigate(`/manage/plans/${plan.id}`)}
                  >
                    <Shapes />
                  </Button>
                  {plan.name}
                </Col>
              )}
              <Col style={{display: "flex", flexDirection: "column"}}>
                <Button onClick={() => {this.props.navigate("new");}} style={{width: "150px", minWidth: "150px", height: "100px"}}>
                  <PlusOutlined />
                </Button>
                <span style={{fontWeight: 200, fontStyle: "italic"}}>New Plan</span>
              </Col>
            </Row>
          </Content>
        </Layout>
      </Container>
    );
  }
}

// This is required to use the params hook.
// (It only works in functional components)
const EditPlanWrapper = (): JSX.Element => {
  const navigate = useNavigate();

  return (
    <ManagePlans navigate={navigate} />
  );
};

export default EditPlanWrapper;
