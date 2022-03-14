import React from "react";
import { Alert, Button, Form, Input } from "antd";
import Translations from "@localization/translations";
import { UserOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

interface Props {
  onFinish: (values: Record<string, never>) => void;
  onFinishFailed: (errorInfo: unknown) => void;
  loading: boolean;
  error: null | string | undefined;
  setForm: (form: "login" | "reset") => void;
}

/**
 * A form for resetting the password
 * @param {Props} props
 * @returns {JSX.Element}
 */
const ResetForm: React.FC<Props> = ({
  onFinish,
  onFinishFailed,
  loading,
  error,
  setForm,
}: Props): JSX.Element => {
  const { t } = useTranslation();

  return (
    <Form
      name="reset"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      style={{ width: "350px" }}
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
            disabled={loading}
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
