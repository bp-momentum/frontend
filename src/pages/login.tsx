import {Button, Form, Input, Checkbox, Row, Col, Space, Alert, Spin} from "antd";
import { UserOutlined, LockOutlined, LoadingOutlined } from "@ant-design/icons";
import React from "react";
import api from "../util/api";
import Routes from "../util/routes";
import { useAppDispatch } from "../redux/hooks";
import {setRefreshToken, setToken} from "../redux/token/tokenSlice";
import { useTranslation } from "react-i18next";
import Translations from "../localization/translations";

const Login = () : JSX.Element  => {
  const dispatch = useAppDispatch();
  const [error, setError] = React.useState<null | string>();
  const [loading, setLoading] = React.useState(false);
  const { t } = useTranslation();

  const onFinish = async (values: Record<string, never>) => {
    const username = values["username"];
    const password = values["password"];
    const remember = values["remember"];
    setError(null);
    setLoading(true);

    const response = await api.execute(Routes.login({
      username: username,
      password: password
    })).catch(() => {
      setError(t(Translations.errors.unknownError));
    });
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
        justifyContent: "center"
      }}
    >
      <Col>
        <Row justify="center" style={{fontSize: "30px", fontWeight: "bold"}}>
          {t(Translations.login.welcome)}
        </Row>
        <Row justify="center">
          {t(Translations.login.enterCredentials)}
        </Row>
      </Col>
      <Row justify="center">
        <Col>
          <Form
            name="login"
            labelCol={{ span: 16 }}
            wrapperCol={{ span: 24  }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >

            {error && <Alert message={error} type="error" showIcon style={{marginBottom: "20px"}}/>}

            <Form.Item
              name="username"
              rules={[{ required: true, message: t(Translations.login.enterUsername) }]}
            >
              <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder={t(Translations.user.username)}/>
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: t(Translations.login.enterPassword) }]}
            >
              <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} placeholder={t(Translations.user.password)}/>
            </Form.Item>

            <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
              <Checkbox>{t(Translations.login.rememberMe)}</Checkbox>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit" disabled={loading} style={{ display: "flex"}}>
                {loading && <Spin indicator={<LoadingOutlined style={{ fontSize: 12, marginRight: "10px" }} spin />} />}
                {t(Translations.login.login)}
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </Space>
  );
};

export default Login;
