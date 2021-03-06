import React from "react";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import Container from "@shared/container";
import helper from "@util/helper";
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
import {
  setRefreshToken,
  setToken,
  unsetRefreshToken,
  unsetToken,
} from "@redux/token/tokenSlice";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import Translations from "@localization/translations";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import useApi from "@hooks/api";

/**
 * A page containing the settings.
 * @returns {JSX.Element} The page.
 */
const Settings: React.FC = (): JSX.Element => {
  const navigate = useNavigate();
  const [error, setError] = React.useState<null | string>();
  const [success, setSuccess] = React.useState<null | string>();

  const api = useApi();

  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation();
  const token = useAppSelector((state) => state.token.token);

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
    dispatch(unsetRefreshToken());
    dispatch(unsetToken());
  };

  function onLogoutAllDevices() {
    Modal.confirm({
      title: t(Translations.settings.logoutAllDevices.modal.title),
      icon: <ExclamationCircleOutlined />,
      content: t(Translations.settings.logoutAllDevices.modal.message),
      okText: t(Translations.settings.logoutAllDevices.modal.confirm),
      okType: "danger",
      cancelText: t(Translations.settings.logoutAllDevices.modal.cancel),
      onOk() {
        onConfirmLogoutAllDevices().catch(message.error);
      },
    });
  }

  const onConfirmLogoutAllDevices = async () => {
    setError(null);
    const response = await api.execute(Routes.logoutAllDevices());
    if (!response || !response.success) {
      setError(t(response.description ?? Translations.errors.unknownError));
      return;
    }

    /**
     * This method displays a message that the logout was successful, but that the user has to log in manually again.
     * This happens with a 2-second delay.
     * @returns {Promise<void>} nothing
     */
    const displaySuccessAndRedirect = async (): Promise<void> => {
      setSuccess(t(Translations.settings.logoutAllDevices.successLogin));
      setTimeout(() => setSuccess(null), 5000);
      await new Promise((resolve) => setTimeout(resolve, 5000)); // sleep for 2 Seconds
      dispatch(unsetRefreshToken());
      dispatch(unsetToken());
    };

    const refreshToken = response.data["refresh_token"];
    let sessionToken = response.data["session_token"];

    // if no refresh token is returned, we have to redirect the user to the login
    if (!refreshToken) {
      await displaySuccessAndRedirect();
      return;
    }

    // if we have a refresh token but no session token, we need to authenticate again to get a fresh session token
    if (!sessionToken) {
      const authResponse = await api.execute(
        Routes.auth({ refreshToken: refreshToken })
      );

      // authentication failed, redirect user to login
      if (!response || !response.success) {
        await displaySuccessAndRedirect();
        return;
      }
      sessionToken = authResponse.data["session_token"];
    }

    // save new tokens
    setSuccess(t(Translations.settings.logoutAllDevices.success));
    dispatch(setRefreshToken(refreshToken));
    dispatch(setToken(sessionToken));
    setTimeout(() => setSuccess(null), 5000);
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

            <Row justify="center" style={{ paddingBottom: "20px" }}>
              <Button onClick={onLogoutAllDevices}>
                {t(Translations.settings.logoutAllDevices.title)}
              </Button>
            </Row>

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
                disabled={
                  token != null && helper.getAccountType(token) === "admin"
                }
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
