import { Row, Col, Space, message } from "antd";
import React from "react";
import ApiRoutes from "@util/routes";
import { useAppDispatch } from "@redux/hooks";
import { login } from "@redux/profile/profileSlice";
import { useTranslation } from "react-i18next";
import Translations from "@localization/translations";
import LoginForm from "./forms/loginForm";
import ResetForm from "./forms/resetForm";
import useApi from "@hooks/api";

/**
 * The login page
 * @returns {JSX.Element} The page
 */
const Login: React.FC = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const [error, setError] = React.useState<null | string>();
  const [loading, setLoading] = React.useState(false);
  const { t } = useTranslation();

  const [form, setForm] = React.useState<"login" | "reset">("login");

  const api = useApi();

  const onLogin = async (values: Record<string, never>) => {
    const username = values["username"];
    const password = values["password"];
    setError(null);
    setLoading(true);

    await new Promise((r) => setTimeout(r, 1000));

    const response = await api.execute(
      ApiRoutes.login({
        username: username,
        password: password,
      })
    );

    if (!response) {
      setLoading(false);
      return;
    }

    if (!response.success) {
      setError(t(response.description ?? Translations.errors.unknownError));
      setLoading(false);
      return;
    }

    dispatch(
      login({
        username: response.data["username"],
        role: response.data["role"],
      })
    );

    setLoading(false);
  };

  const onReset = (values: Record<string, never>) => {
    const username = values["username"];
    api
      .execute(
        ApiRoutes.requestPasswordReset({
          username,
          url: window._env_.FRONTEND_URL,
        })
      )
      .then((response) => {
        if (!response || !response.success) {
          message.error(t(Translations.resetPw.error));
          return;
        }
        message.success(t(Translations.resetPw.success));
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
