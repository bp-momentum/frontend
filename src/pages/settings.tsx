import React from "react";
import {useAppDispatch} from "../redux/hooks";
import Container from "../shared/container";
import {Button, Col, Row, Space} from "antd";
import {unsetRefreshToken, unsetToken} from "../redux/token/tokenSlice";
import {useTranslation} from "react-i18next";
import Translations from "../localization/translations";

const Settings = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation();

  const logout = () => {
    dispatch(unsetRefreshToken());
    dispatch(unsetToken());
  };

  const changeLanguage = (lng: string) => i18n.changeLanguage(lng).catch(console.error);

  return (
    <Container
      currentPage="settings"
      color="blue"
    >
      <Col>
        <Row justify="center" style={{fontSize: "20px", fontWeight: "bold"}}>
          {t(Translations.settings.changeLanguage)}
        </Row>
        <Row justify="center">
          <Space>
            <Button onClick={() => changeLanguage("de")} type={i18n.language === "de" ? "primary" : "default"}>Deutsch</Button>
            <Button onClick={() => changeLanguage("en")} type={i18n.language === "en" ? "primary" : "default"}>English</Button>
          </Space>
        </Row>
        <br/>
        <br/>
        <br/>
        <Row justify="center" style={{fontSize: "20px", fontWeight: "bold"}}>
          {t(Translations.settings.logout)}
        </Row>
        <Row justify="center">
          <Button onClick={logout}>{t(Translations.home.logout)}</Button>
        </Row>
      </Col>
    </Container>
  );
};

export default Settings;
