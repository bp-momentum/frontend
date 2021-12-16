import React, {useEffect} from "react";
import {useAppSelector} from "../redux/hooks";
import {useTranslation} from "react-i18next";
import Helper from "../util/helper";
import {Exercise} from "../api/exercise";
import api from "../util/api";
import Routes from "../util/routes";
import Container from "../shared/container";
import {Alert, Col, Space, Spin} from "antd";
import Translations from "../localization/translations";
import {LoadingOutlined} from "@ant-design/icons";

const Exercises = () : JSX.Element => {
  const token = useAppSelector((state) => state.token.token);
  const { t } = useTranslation();

  const [exercises, setExercises] = React.useState<Exercise[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<null | string>();

  const loadAssignedPlan = async () => {
    const response = await api.execute(Routes.getAssignedPlans({}));
    console.log(response);
    if (!response.success) {
      setError(t(response.description ?? Translations.errors.unknownError));
      setLoading(false);
      return;
    }
    const exerciseList: Exercise[] = response.data.exercises;
    setExercises(exerciseList);
    setLoading(false);
  };

  useEffect(() => {
    if (!loading) return;
    loadAssignedPlan().then(() => setLoading(false));
  });

  return (
    <Container
      currentPage="home"
      color="blue"
    >
      <Space
        size="large"
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          display: "flex",
          flexDirection: "column",
          justifyContent: "start"
        }}
      >
        <Col>
          {error && <Alert message={error} type="error" showIcon style={{marginBottom: "20px"}}/>}
          {loading && <Spin indicator={<LoadingOutlined style={{ fontSize: 12, marginRight: "10px" }} spin />} />}
        </Col>
      </Space>
    </Container>
  );

};

export default Exercises;
