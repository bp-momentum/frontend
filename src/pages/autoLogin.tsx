import {Row, Col, Space, Spin} from "antd";
import {LoadingOutlined } from "@ant-design/icons";
import React from "react";
import api from "../util/api";
import Routes from "../util/routes";
import {useAppDispatch, useAppSelector} from "../redux/hooks";
import {setToken} from "../redux/token/tokenSlice";
import {useNavigate} from "react-router";
import {useTranslation} from "react-i18next";
import Translations from "../localization/translations";

const AutoLogin = () : JSX.Element  => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const refreshToken = useAppSelector(state => state.token.refreshToken);
  const { t } = useTranslation();

  const checkLogin = async () => {
    if (!refreshToken) {
      return setTimeout(() => navigate(""), 1000);
    }

    const response = await api.execute(Routes.auth({refreshToken: refreshToken}));
    if (!response.success) {
      return setTimeout(() => navigate(""), 1000);
    }

    const token = response.data["session_token"];
    setTimeout(() => dispatch(setToken(token)), 1000);
  };

  checkLogin().catch(() => navigate(""));

  return (
    <Space size="large" style={{width: "100%", height: "100%", position: "absolute", display: "flex", flexDirection: "column", justifyContent: "center"}}>
      <Col>
        <Row justify="center" style={{fontSize: "30px", fontWeight: "bold"}}>
          {t(Translations.autoLogin.signingIn)}
        </Row>
        <Row justify="center" style={{fontSize: "30px", fontWeight: "bold"}}>
          <Spin indicator={<LoadingOutlined style={{ fontSize: 30, marginTop: "10px"}} spin />}/>
        </Row>
      </Col>
    </Space>
  );
};

export default AutoLogin;
