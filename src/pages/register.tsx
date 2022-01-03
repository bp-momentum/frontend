import { Alert, Button, Checkbox, Col, Form, Input, Row, Space } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import React from "react";
import api from "../util/api";
import Routes from "../util/routes";
import { useAppDispatch } from "../redux/hooks";
import { setRefreshToken, setToken } from "../redux/token/tokenSlice";
import { useNavigate } from "react-router";
import Translations from "../localization/translations";
import { useTranslation } from "react-i18next";

export interface RegisterProps {
  registerToken: string;
}

const Register = (props: RegisterProps): JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [error, setError] = React.useState<null | string>();
  const { t } = useTranslation();

  const onFinish = async (values: Record<string, never>) => {
    setError(null);
    const password = values["password"];
    const passwordRepeat = values["password-repeat"];
    const username = values["username"];
    const remember = values["remember"];

    if (password !== passwordRepeat) {
      setError(t(Translations.register.passwordsDontMatch));
      return;
    }

    const response = await api.execute(
      Routes.registerUser({
        password: password,
        registerToken: props.registerToken,
        username: username,
      })
    );

    if (!response) return;

    if (!response.success) {
      setError(t(response.description ?? Translations.errors.unknownError));
      return;
    }

    const token = response.data["session_token"];
    const refreshToken = response.data["refresh_token"];

    if (remember) {
      dispatch(setRefreshToken(refreshToken));
    }
    dispatch(setToken(token));
    navigate("", { replace: true });
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
          {t(Translations.register.title)}
        </Row>
        <Row justify="center">{t(Translations.register.subtitle)}</Row>
      </Col>
      <Row justify="center">
        <Col>
          <Form
            name="register"
            labelCol={{ span: 16 }}
            wrapperCol={{ span: 24 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            onValuesChange={() => setError(null)}
            autoComplete="off"
          >
            {error && (
              <Alert
                message={error}
                type="error"
                showIcon
                style={{ marginBottom: "20px" }}
              />
            )}

            <Form.Item
              name="username"
              rules={[
                {
                  required: true,
                  message: t(Translations.register.chooseUsername),
                },
              ]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder={t(Translations.user.username)}
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: t(Translations.register.enterPassword),
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder={t(Translations.user.password)}
              />
            </Form.Item>

            <Form.Item
              name="password-repeat"
              rules={[
                {
                  required: true,
                  message: t(Translations.register.repeatPassword),
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder={t(Translations.user.password)}
              />
            </Form.Item>

            <Form.Item
              name="remember"
              valuePropName="checked"
              wrapperCol={{ offset: 8, span: 16 }}
            >
              <Checkbox>{t(Translations.login.rememberMe)}</Checkbox>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit">
                {t(Translations.register.register)}
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </Space>
  );
};

export default Register;
