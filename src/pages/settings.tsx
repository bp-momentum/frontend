import React from "react";
import {useAppDispatch} from "../redux/hooks";
import Container from "../shared/container";
import {Button, Col, Dropdown, Menu, Row} from "antd";
import { DownOutlined } from "@ant-design/icons";
import {unsetRefreshToken, unsetToken} from "../redux/token/tokenSlice";
import {useTranslation} from "react-i18next";
import Translations from "../localization/translations";
import {MenuInfo} from "rc-menu/lib/interface";

const Settings = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation();

  const logout = () => {
    dispatch(unsetRefreshToken());
    dispatch(unsetToken());
  };

  const changeLanguage = (lng: string) => i18n.changeLanguage(lng).catch(console.error);

  const handleMenuClick = (e: MenuInfo) => changeLanguage(e.key);

  const menu = (
    <Menu onClick={handleMenuClick} selectedKeys={[i18n.language]}>
      <Menu.Item key="de">
        Deutsch
      </Menu.Item>
      <Menu.Item key="en">
        English
      </Menu.Item>
    </Menu>
  );

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
          <Dropdown overlay={menu}>
            <Button>
              {t(Translations.settings.selectLanguage)} <DownOutlined />
            </Button>
          </Dropdown>
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
