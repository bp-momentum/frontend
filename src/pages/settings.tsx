import React from "react";
import {useAppDispatch} from "../redux/hooks";
import Container from "../shared/container";
import {Button, Col, Row, Select} from "antd";
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
          <Select defaultValue={i18n.language} onChange={changeLanguage}>
            <Select.Option value="de" key="de">
              Deutsch
            </Select.Option>
            <Select.Option value="en" key="en">
              English
            </Select.Option>
          </Select>
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
