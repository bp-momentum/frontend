import { Col, Row, Spin } from "antd";
import { Content } from "antd/lib/layout/layout";
import Translations from "../../../localization/translations";
import { LoadingOutlined } from "@ant-design/icons";
import React from "react";
import { useTranslation } from "react-i18next";

const ProfileLoadingView: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Content data-testid="loading-view">
      <Col
        style={{
          height: "100%",
          flexDirection: "column",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Row justify="center" style={{ fontSize: "30px", fontWeight: "bold" }}>
          {t(Translations.profile.loading)}
        </Row>
        <Row justify="center" style={{ fontSize: "30px", fontWeight: "bold" }}>
          <Spin
            indicator={
              <LoadingOutlined
                style={{ fontSize: 30, marginTop: "10px" }}
                spin
              />
            }
          />
        </Row>
      </Col>
    </Content>
  );
};

export default ProfileLoadingView;
