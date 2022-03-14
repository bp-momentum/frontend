import React, { useEffect } from "react";
import useApi from "@hooks/api";
import { Col, message, Row, Spin } from "antd";
import Routes from "@util/routes";
import Translations from "@localization/translations";
import { useTranslation } from "react-i18next";
import { Medal } from "@api/medal";
import MedalCard from "./medalCard";
import EmptyDataRender from "@shared/emptyDataRender";
import { LoadingOutlined } from "@ant-design/icons";

const Medals: React.FC = () => {
  const api = useApi();
  const { t } = useTranslation();

  const [medals, setMedals] = React.useState<Medal[]>([]);
  const [loading, setLoading] = React.useState(true);

  const loadMedals = async () => {
    const response = await api.execute(Routes.getMedals());
    if (!response || !response.success) {
      message.error(
        response?.description ?? t(Translations.errors.unknownError)
      );
      return;
    }
    setMedals(response.data.medals);
    setLoading(false);
  };
  useEffect(() => {
    loadMedals().catch(message.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <Col style={{ marginTop: "50px" }}>
        <Row justify="center">
          <div style={{ height: "100%" }}>
            <Spin
              indicator={
                <LoadingOutlined
                  style={{
                    fontSize: 18,
                    marginRight: "10px",
                    color: "black",
                  }}
                  spin
                />
              }
            />
          </div>
          {t(Translations.medals.loading)}
        </Row>
      </Col>
    );
  }

  if (!medals || medals.length === 0)
    return (
      <Col style={{ marginTop: "50px" }}>
        <Row justify="center">
          <EmptyDataRender customText={t(Translations.medals.noMedals)} />
        </Row>
      </Col>
    );

  return (
    <Row gutter={16} justify="center" style={{ marginTop: "50px" }}>
      {medals
        .filter((medal) => medal.gold > 0)
        .map((medal) => (
          <Col
            key={medal.exercise + "-gold"}
            span={10}
            style={{
              paddingBottom: "30px",
              minWidth: "336px",
              justifyContent: "center",
              display: "flex",
            }}
          >
            <MedalCard
              type="gold"
              exercise={medal.exercise}
              count={medal.gold}
            />
          </Col>
        ))}
      {medals
        .filter((medal) => medal.silver > 0)
        .map((medal) => (
          <Col
            key={medal.exercise + "-silver"}
            span={10}
            style={{
              paddingBottom: "30px",
              minWidth: "336px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <MedalCard
              type="silver"
              exercise={medal.exercise}
              count={medal.silver}
            />
          </Col>
        ))}
      {medals
        .filter((medal) => medal.bronze > 0)
        .map((medal) => (
          <Col
            key={medal.exercise + "-bronze"}
            span={10}
            style={{
              paddingBottom: "30px",
              minWidth: "336px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <MedalCard
              type="bronze"
              exercise={medal.exercise}
              count={medal.bronze}
            />
          </Col>
        ))}
    </Row>
  );
};

export default Medals;
