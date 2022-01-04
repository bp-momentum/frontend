import {
  Alert,
  Button,
  Col,
  Form,
  FormInstance,
  Input,
  Row,
  Space,
} from "antd";
import { MailOutlined } from "@ant-design/icons";
import React from "react";
import Api from "../util/api";
import Routes from "../util/routes";
import Container from "../shared/container";
import { useTranslation } from "react-i18next";
import Translations from "../localization/translations";

const CreateUser = (): JSX.Element => {
  const [error, setError] = React.useState<null | string>();
  const [success, setSuccess] = React.useState<null | string>();
  const formRef = React.createRef<FormInstance>();
  const { t } = useTranslation();

  const onFinish = async (values: Record<string, never>) => {
    const firstName = values["first_name"];
    const lastName = values["last_name"];
    const email = values["email_address"];

    setError(null);
    const response = await Api.execute(
      Routes.createUser({
        firstName: firstName,
        lastName: lastName,
        email: email,
      })
    );
    console.log(response);

    if (!response) return;

    if (!response.success) {
      setError(t(response.description ?? Translations.errors.unknownError));
      return;
    }

    formRef.current?.resetFields();
    setSuccess(t(Translations.createUser.successfullyCreatedUser));
    setTimeout(() => setSuccess(null), 5000);
  };

  const onFinishFailed = (errorInfo: unknown) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Container currentPage="home" color="blue">
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
          <Row
            justify="center"
            style={{ fontSize: "30px", fontWeight: "bold" }}
          >
            {t(Translations.createUser.title)}
          </Row>
          <Row justify="center">{t(Translations.createUser.subtitle)}</Row>
        </Col>
        <Row justify="center">
          <Col>
            <Form
              ref={formRef}
              name="login"
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
                <Button
                  type="primary"
                  htmlType="submit"
                  data-testid="create_submit"
                >
                  {t(Translations.createUser.create)}
                </Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Space>
    </Container>
  );
};

export default CreateUser;
