import React from "react";
import { Alert, Button, Checkbox, Form, Input } from "antd";
import Translations from "../../../localization/translations";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

interface loginProps {
  onFinish: (values: Record<string, never>) => void;
  onFinishFailed: (errorInfo: any) => void;
  loading: boolean;
  error: null | string | undefined;
  setForm: (form: "login" | "reset") => void;
}

const LoginForm: React.FC<loginProps> = ({ ...props }) => {
  const { onFinish, onFinishFailed, loading, error, setForm } = props;
  const { t } = useTranslation();

  return (
    <Form
      name="login"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      style={{ width: "300px" }}
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
            message: t(Translations.login.enterUsername),
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
            message: t(Translations.login.enterPassword),
          },
        ]}
      >
        <Input.Password
          prefix={<LockOutlined className="site-form-item-icon" />}
          placeholder={t(Translations.user.password)}
        />
      </Form.Item>

      <Form.Item>
        <Form.Item name="remember" valuePropName="checked" noStyle>
          <Checkbox>{t(Translations.login.rememberMe)}</Checkbox>
        </Form.Item>
        <Button
          style={{ float: "right", paddingRight: "0px" }}
          type="link"
          onClick={(e) => {
            e.preventDefault();
            setForm("reset");
          }}
        >
          Forgot password
        </Button>
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          disabled={loading}
          style={{ display: "block", margin: "auto" }}
          loading={loading}
        >
          {t(Translations.login.login)}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default LoginForm;
