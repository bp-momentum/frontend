import { Row, Col, Space, message } from "antd";
import React from "react";
import api from "../../util/api";
import Routes from "../../util/routes";
import { useAppDispatch } from "../../redux/hooks";
import { setRefreshToken, setToken } from "../../redux/token/tokenSlice";
import { useTranslation } from "react-i18next";
import Translations from "../../localization/translations";
import LoginForm from "./forms/loginForm";
import ResetForm from "./forms/resetForm";

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const [error, setError] = React.useState<null | string>();
  const [loading, setLoading] = React.useState(false);
  const { t } = useTranslation();

  const [form, setForm] = React.useState<"login" | "reset">("login");

  const onLogin = async (values: Record<string, never>) => {
    const username = values["username"];
    const password = values["password"];
    const remember = values["remember"];
    setError(null);
    setLoading(true);

    await new Promise((r) => setTimeout(r, 1000));

    const response = await api.execute(
      Routes.login({
        username: username,
        password: password,
      })
    );
    console.log(response);

    if (!response) {
      setLoading(false);
      return;
    }

    if (!response.success) {
      setError(t(response.description ?? Translations.errors.unknownError));
      setLoading(false);
      return;
    }

    console.log("Logged in successfully!");
    const token = response.data["session_token"];
    const refreshToken = response.data["refresh_token"];

    setLoading(false);
    if (remember) {
      dispatch(setRefreshToken(refreshToken));
    }
    dispatch(setToken(token));
  };

  const onReset = (values: Record<string, never>) => {
    const username = values["username"];
    api
      .execute(
        Routes.requestPasswordReset({
          username,
          url: window.location.origin + "/#",
        })
      )
      .then((response) => {
        if (!response || !response.success) {
          message.error("Error requesting password reset");
          return;
        }
        message.success("Reset password email sent!");
      });
  };

  const onFinishFailed = (errorInfo: unknown) => {
    console.log("Failed:", errorInfo);
  };

  return (
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
        <Row justify="center" style={{ fontSize: "30px", fontWeight: "bold" }}>
          {t(Translations.login.welcome)}
        </Row>
        <Row justify="center">{t(Translations.login.enterCredentials)}</Row>
      </Col>
      <Row justify="center">
        <Col>
          {form === "login" ? (
            <LoginForm
              onFinish={onLogin}
              onFinishFailed={onFinishFailed}
              loading={loading}
              error={error}
              setForm={setForm}
            />
          ) : (
            <ResetForm
              onFinish={onReset}
              onFinishFailed={onFinishFailed}
              loading={loading}
              error={error}
              setForm={setForm}
            />
          )}
        </Col>
      </Row>
    </Space>
  );
};

export default Login;
