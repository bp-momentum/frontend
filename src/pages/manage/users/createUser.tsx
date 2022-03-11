import { Alert, Button, Form, Input } from "antd";
import { MailOutlined } from "@ant-design/icons";
import React, { Dispatch, SetStateAction } from "react";
import Routes from "@util/routes";
import { useTranslation } from "react-i18next";
import Translations from "@localization/translations";
import useApi from "@hooks/api";
import config from "@/config";

interface createUserProps {
  updateValue: number;
  setUpdateValue: Dispatch<SetStateAction<number>>;
}

const CreateUser: React.FC<createUserProps> = ({ ...props }) => {
  const { updateValue, setUpdateValue } = props;

  const [error, setError] = React.useState<null | string>();
  const [success, setSuccess] = React.useState<null | string>();
  const { t } = useTranslation();

  const [form] = Form.useForm();

  const api = useApi();

  const onFinish = async (values: Record<string, never>) => {
    const firstName = values["first_name"];
    const lastName = values["last_name"];
    const email = values["email_address"];

    setError(null);
    const response = await api.execute(
      Routes.createUser({
        firstName: firstName,
        lastName: lastName,
        email: email,
        url: config.frontendUrl,
      })
    );

    if (!response) return;

    if (!response.success) {
      setError(t(response.description ?? Translations.errors.unknownError));
      return;
    }

    form.resetFields();
    setSuccess(t(Translations.createUser.successfullyCreatedUser));
    setUpdateValue(updateValue + 1);
    setTimeout(() => setSuccess(null), 5000);
  };

  const onFinishFailed = (errorInfo: unknown) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Form
      form={form}
      name="create_user"
      labelCol={{ span: 16 }}
      wrapperCol={{ span: 24 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      {success && (
        <Alert
          message={success}
          type="success"
          showIcon
          style={{ marginBottom: "20px" }}
        />
      )}
      {error && (
        <Alert
          message={error}
          type="error"
          showIcon
          style={{ marginBottom: "20px" }}
        />
      )}

      <Form.Item
        name="first_name"
        rules={[
          {
            required: true,
            message: t(Translations.createUser.enterFirstName),
          },
        ]}
      >
        <Input
          placeholder={t(Translations.user.firstName)}
          data-testid="first_name"
        />
      </Form.Item>

      <Form.Item
        name="last_name"
        rules={[
          {
            required: true,
            message: t(Translations.createUser.enterLastName),
          },
        ]}
      >
        <Input
          placeholder={t(Translations.user.lastName)}
          data-testid="last_name"
        />
      </Form.Item>

      <Form.Item
        name="email_address"
        rules={[
          {
            required: true,
            message: t(Translations.createUser.enterEmail),
            type: "email",
          },
        ]}
      >
        <Input
          prefix={<MailOutlined className="site-form-item-icon" />}
          placeholder={t(Translations.user.email)}
          data-testid="email_address"
        />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit" data-testid="create_submit">
          {t(Translations.createUser.create)}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CreateUser;
