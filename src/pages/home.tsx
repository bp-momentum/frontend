import React from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import Container from "../shared/container";
import helper from "../util/helper";
import { Button, Col, Row, Space } from "antd";
import { Link } from "react-router-dom";
import { unsetRefreshToken, unsetToken } from "../redux/token/tokenSlice";
import { useTranslation } from "react-i18next";
import Translations from "../localization/translations";

const Home = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.token.token);
  const { t } = useTranslation();

  const logout = () => {
    dispatch(unsetRefreshToken());
    dispatch(unsetToken());
  };

  return (
    <Container currentPage="home" color="blue">
      <Space
        size="large"
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Col>
          <Row
            justify="center"
            style={{ fontSize: "30px", fontWeight: "bold" }}
          >
            {token &&
              t(Translations.home.youAre, {
                type: t("user." + helper.getAccountType(token)),
              })}
          </Row>
          <Row justify="center">
            {token && helper.getAccountType(token) === "user" && (
              <Link to={"/exercises"}>
                <Button>{t(Translations.home.exercises)}</Button>
              </Link>
            )}
          </Row>
        </Col>
        <Row justify="center">
          <Col>
            <Button onClick={logout}>{t(Translations.home.logout)}</Button>
            {token && helper.getAccountType(token) !== "user" && (
              <Link to={"/createuser"}>
                <Button>{t(Translations.home.createUser)}</Button>
              </Link>
            )}
          </Col>
        </Row>
      </Space>
    </Container>
  );
};

export default Home;
