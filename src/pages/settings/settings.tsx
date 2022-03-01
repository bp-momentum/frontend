import React from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import Container from "../../shared/container";
import helper from "../../util/helper";
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
import Api from "../../util/api";
import Routes from "../../util/routes";
import {
  setRefreshToken,
  setToken,
  unsetRefreshToken,
  unsetToken,
} from "../../redux/token/tokenSlice";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import Translations from "../../localization/translations";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import api from "../../util/api";

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = React.useState<null | string>();
  const [success, setSuccess] = React.useState<null | string>();

  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation();
  const token = useAppSelector((state) => state.token.token);

  const logout = () => {
    dispatch({ type: "USER_LOGOUT" });
    navigate("/");
  };

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
      onCancel() {
        console.log("Cancelled Account Deletion");
      },
    });
  }

  const onConfirmDeleteAccount = async () => {
    setError(null);
    const response = await Api.execute(Routes.deleteAccount());
    console.log(response);

    if (!response) return;

    if (!response.success) {
      setError(t(response.description ?? Translations.errors.unknownError));
      return;
    }
    setSuccess(t(Translations.settings.successfullyDeletedAccount));

    setTimeout(() => setSuccess(null), 5000);

    await new Promise((resolve) => setTimeout(resolve, 5000)); // sleep for 5 Seconds

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
      onCancel() {
        console.log("Cancelled Logout All Devices");
      },
    });
  }

  const onConfirmLogoutAllDevices = async () => {
    setError(null);
    const response = await Api.execute(Routes.logoutAllDevices());
    if (!response || !response.success) {
      setError(t(response.description ?? Translations.errors.unknownError));
      return;
    }

    /**
     * This method displays a message that the logout was successful, but that the user has to log in manually again.
     * This happens with a 5-second delay.
     */
    const displaySuccessAndRedirect = async () => {
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
      const authResponse = await Api.execute(
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
    console.log("Change Password!");
  };

  return (
    <Container currentPage="settings" color="blue">
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
              <Select defaultValue={i18n.language} onChange={changeLanguage}>
                <Select.Option value="de" key="de">
                  Deutsch
                </Select.Option>
                <Select.Option value="en" key="en">
                  English
                </Select.Option>
              </Select>
            </Row>

            <Divider plain style={{ fontSize: "20px", fontWeight: "bold" }}>
              {t(Translations.settings.logout)}
            </Divider>

            <Row justify="center">
              <Button onClick={logout}>
                {t(Translations.settings.logout)}
              </Button>
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
            <Row justify="center" style={{ paddingBottom: "20px" }}>
              <Button onClick={onLogoutAllDevices} danger>
                {t(Translations.settings.logoutAllDevices.title)}
              </Button>
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
