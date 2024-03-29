import { Alert, Button, Col, Form, Input, Row, Space } from "antd";
import { LockOutlined } from "@ant-design/icons";
import React from "react";
import Routes from "@util/routes";
import { useNavigate } from "react-router";
import Translations from "@localization/translations";
import { useTranslation } from "react-i18next";
import Container from "@shared/container";
import useApi from "@hooks/api";

/**
 * The page where a user can change their password.
 * @returns {JSX.Element} The page.
 */
const ChangePassword: React.FC = (): JSX.Element => {
  const navigate = useNavigate();
  const [error, setError] = React.useState<null | string>();
  const [success, setSuccess] = React.useState<null | string>(null);
  const { t } = useTranslation();
  const api = useApi();

  /**
   * Called when the user clicks the submit button.
   * @param {Record<string, never>} values  the entered values of the form
   * @returns {Promise<void>} nothing
   */
  const onFinish = async (values: Record<string, never>): Promise<void> => {
    setError(null);
    const password = values["password"];
    const newPassword = values["new-password"];
    const newPasswordRepeat = values["new-password-repeat"];

    if (newPassword !== newPasswordRepeat) {
      setError(t(Translations.register.passwordsDontMatch));
      return;
    }

    if (newPassword === password) {
      setError(t(Translations.settings.changePassword.samePassword));
      return;
    }

    const response = await api.execute(
      Routes.changePassword({
        password: password,
        newPassword: newPassword,
      })
    );

    if (!response || !response.success) {
      setError(response.description ?? t(Translations.errors.unknownError));
      return;
    }

    setSuccess(t(Translations.settings.changePassword.success));
    setTimeout(() => navigate("/settings"), 3000);
  };

  const onFinishFailed = (errorInfo: unknown) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Container currentPage="settings">
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
            {t(Translations.settings.changePassword.title)}
          </Row>
          <Row justify="center">
            {t(Translations.settings.changePassword.subtitle)}
          </Row>
        </Col>
        <Row justify="center">
          <Col>
            <Form
              name="change_password"
              labelCol={{ span: 16 }}
              wrapperCol={{ span: 24 }}
              initialValues={{ remember: true }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              onValuesChange={() => setError(null)}
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

              {success && (
                <Alert
                  message={success}
                  type="success"
                  showIcon
                  style={{ marginBottom: "20px" }}
                />
              )}

              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: t(
                      Translations.settings.changePassword.enterPassword
                    ),
                  },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  placeholder={t(
                    Translations.settings.changePassword.currentPassword
                  )}
                />
              </Form.Item>

              <Form.Item
                name="new-password"
                rules={[
                  {
                    required: true,
                    message: t(
                      Translations.settings.changePassword.enterNewPassword
                    ),
                  },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  placeholder={t(
                    Translations.settings.changePassword.newPassword
                  )}
                />
              </Form.Item>

              <Form.Item
                name="new-password-repeat"
                rules={[
                  {
                    required: true,
                    message: t(
                      Translations.settings.changePassword
                        .enterNewPasswordRepeat
                    ),
                  },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  placeholder={t(
                    Translations.settings.changePassword.newPasswordRepeat
                  )}
                />
              </Form.Item>

              <Form.Item>
                <Button
                  disabled={success !== null}
                  type="primary"
                  htmlType="submit"
                  style={{ width: "100%" }}
                >
                  {t(Translations.settings.changePassword.submit)}
                </Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Space>
    </Container>
  );
};

export default ChangePassword;
