import { Alert, Button, Col, Form, Input, Row, Space } from "antd";
import { LockOutlined } from "@ant-design/icons";
import React from "react";
import Routes from "@util/routes";
import { useNavigate } from "react-router";
import Translations from "@localization/translations";
import { useTranslation } from "react-i18next";
import useApi from "@hooks/api";

export interface resetPwProps {
  resetToken: string;
}

const ResetPw: React.FC<resetPwProps> = ({ resetToken }) => {
  const navigate = useNavigate();
  const [error, setError] = React.useState<null | string>();
  const { t } = useTranslation();

  const api = useApi();

  const onFinish = async (values: Record<string, never>) => {
    setError(null);
    const password = values["password"];
    const passwordRepeat = values["password-repeat"];

    if (password !== passwordRepeat) {
      setError(t(Translations.register.passwordsDontMatch));
      return;
    }

    const response = await api.execute(
      Routes.resetPassword({
        password: password,
        token: resetToken,
      })
    );

    if (!response || !response.success) {
      setError(response.description ?? t(Translations.errors.unknownError));
      return;
    }

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
          {t(Translations.resetPw.title)}
        </Row>
        <Row justify="center">{t(Translations.resetPw.subtitle)}</Row>
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
              name="password"
              rules={[
                {
                  required: true,
                  message: t(Translations.resetPw.enterPassword),
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder={t(Translations.resetPw.newPassword)}
              />
            </Form.Item>

            <Form.Item
              name="password-repeat"
              rules={[
                {
                  required: true,
                  message: t(Translations.resetPw.repeatPassword),
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder={t(Translations.resetPw.repeatPassword)}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: "100%" }}
              >
                {t(Translations.resetPw.submit)}
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </Space>
  );
};

export default ResetPw;
