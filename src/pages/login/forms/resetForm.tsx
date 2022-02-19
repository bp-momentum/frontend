import React, { ChangeEvent, useState } from "react";
import { Alert, Button, Form, Input } from "antd";
import Translations from "../../../localization/translations";
import { MailOutlined } from "@ant-design/icons";
import { ValidateStatus } from "antd/lib/form/FormItem";
import { useTranslation } from "react-i18next";

interface loginProps {
  onFinish: (values: Record<string, never>) => void;
  onFinishFailed: (errorInfo: any) => void;
  loading: boolean;
  error: null | string | undefined;
  setForm: (form: "login" | "reset") => void;
}

const ResetForm: React.FC<loginProps> = ({ ...props }) => {
  const { onFinish, onFinishFailed, loading, error, setForm } = props;

  const { t } = useTranslation();

  const [number, setNumber] = useState<{
    validateStatus?: ValidateStatus;
    errorMsg?: string | null;
  }>({});

  const validateEmail = (
    email: string
  ): { validateStatus: ValidateStatus; errorMsg: string | null } => {
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return {
        validateStatus: "success",
        errorMsg: null,
      };
    return {
      validateStatus: "error",
      errorMsg: t(Translations.login.enterValidEmail),
    };
  };

  const onEmailChange = (value: ChangeEvent<HTMLInputElement>) => {
    setNumber({
      ...validateEmail(value.target.value),
    });
  };

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
        name="email"
        rules={[
          {
            required: true,
            message: t(Translations.login.enterEmail),
          },
        ]}
        validateStatus={number.validateStatus}
        help={number.errorMsg}
      >
        <Input
          prefix={<MailOutlined className="site-form-item-icon" />}
          placeholder={t(Translations.user.email)}
          onChange={onEmailChange}
        />
      </Form.Item>

      <Form.Item>
        <Form.Item noStyle>
          <Button
            type="default"
            disabled={loading}
            style={{ float: "left" }}
            loading={loading}
            onClick={() => setForm("login")}
          >
            {t(Translations.login.back)}
          </Button>
        </Form.Item>

        <Form.Item noStyle>
          <Button
            type="primary"
            htmlType="submit"
            disabled={loading || number.validateStatus !== "success"}
            style={{ float: "right" }}
            loading={loading}
          >
            {t(Translations.login.reset)}
          </Button>
        </Form.Item>
      </Form.Item>
    </Form>
  );
};

export default ResetForm;
