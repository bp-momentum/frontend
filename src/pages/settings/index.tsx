import React from "react";
import Container from "@shared/container";
import {
  Alert,
  Button,
  Col,
  Divider,
  message,
  Modal,
  Row,
  Select,
  Space,
} from "antd";
import Routes from "@util/routes";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import Translations from "@localization/translations";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import useApi from "@hooks/api";
import { useAppSelector } from "@redux/hooks";

/**
 * A page containing the settings.
 * @returns {JSX.Element} The page.
 */
const Settings: React.FC = (): JSX.Element => {
  const navigate = useNavigate();
  const [error, setError] = React.useState<null | string>();
  const [success, setSuccess] = React.useState<null | string>();

  const api = useApi();

  const role = useAppSelector((state) => state.profile.role);

  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng).catch(message.error);
    api.execute(Routes.changeLanguage({ language: lng })).catch(message.error);
  };

  function showDeleteConfirm() {
    Modal.confirm({
      title: t(Translations.settings.deleteModalTitle),
      icon: <ExclamationCircleOutlined />,
      content: t(Translations.settings.deleteModalMessage),
      okText: t(Translations.settings.deleteModalConfirm),
      okType: "danger",
      cancelText: t(Translations.settings.deleteModalCancel),
      onOk() {
        onConfirmDeleteAccount().catch(message.error);
      },
    });
  }

  const onConfirmDeleteAccount = async () => {
    setError(null);
    const response = await api.execute(Routes.deleteAccount());
    if (!response) return;
    if (!response.success) {
      setError(t(response.description ?? Translations.errors.unknownError));
      return;
    }

    setSuccess(t(Translations.settings.successfullyDeletedAccount));
    setTimeout(() => setSuccess(null), 5000);
    await new Promise((resolve) => setTimeout(resolve, 5000)); // sleep for 5 seconds
  };

  const onChangePassword = async () => {
    navigate("/settings/change_password");
  };

  return (
    <Container currentPage="settings">
      <Col>
        <Row
          justify="center"
          style={{ width: "100%", fontSize: "30px", fontWeight: "bold" }}
        >
          {t(Translations.settings.accountSettings)}
        </Row>
        <br />
        <br />
        <Space
          size="large"
          style={{
            width: "100%",
            position: "absolute",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Col>
            <Divider plain style={{ fontSize: "20px", fontWeight: "bold" }}>
              {t(Translations.settings.changeLanguage)}
            </Divider>

            <Row justify="center">
              <Select
                defaultValue={
                  i18n.language.toLowerCase().includes("de") ? "de" : "en"
                }
                onChange={changeLanguage}
              >
                <Select.Option value="de" key="de">
                  Deutsch
                </Select.Option>
                <Select.Option value="en" key="en">
                  English
                </Select.Option>
              </Select>
            </Row>

            <Divider plain style={{ fontSize: "20px", fontWeight: "bold" }}>
              {t(Translations.settings.security)}
            </Divider>

            <Row justify="center">
              <Button onClick={onChangePassword}>
                {t(Translations.settings.changePassword.buttonTitle)}
              </Button>
            </Row>

            <Divider plain style={{ fontSize: "20px", fontWeight: "bold" }}>
              {t(Translations.settings.dangerZone)}
            </Divider>

            <Row justify="center">
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
            </Row>
            <Row justify="center">
              <Button
                onClick={showDeleteConfirm}
                danger
                disabled={role === "admin"}
              >
                {t(Translations.settings.deleteAccount)}
              </Button>
            </Row>
          </Col>
        </Space>
      </Col>
    </Container>
  );
};

export default Settings;
