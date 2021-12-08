import React from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import Container from "../shared/container";
import helper from "../util/helper";
import { Alert, Button, Col, Modal, Row, Space } from "antd";
import Api from "../util/api";
import Routes from "../util/routes";
import {unsetRefreshToken, unsetToken} from "../redux/token/tokenSlice";
import ExclamationCircleOutlined from "@ant-design/icons/lib/icons/ExclamationCircleOutlined";

const Settings = () : JSX.Element => {
  const [error, setError] = React.useState<null | string>();
  const [success, setSuccess] = React.useState<null | string>();

  const dispatch = useAppDispatch();
  const token = useAppSelector(state => state.token.token)!;

  function showDeleteConfirm() {
    Modal.confirm({
      title: "Account Deletion",
      icon: <ExclamationCircleOutlined />,
      content: "Are you sure you want to delete your account? This action is irreversible.",
      okText: "Delete Account",
      okType: "danger",
      cancelText: "Cancel",
      onOk() {
        onConfirmDeleteAccount();
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
      setError(response.description ?? "Something went wrong.");
      return;
    }
    setSuccess(response.description ?? "Successfully deleted your Account! You will be logged out shortly.");

    setTimeout(() => setSuccess(null), 5000);

    await new Promise((resolve) => setTimeout(resolve, 5000)); // sleep for 5 Seconds

    dispatch(unsetRefreshToken());
    dispatch(unsetToken());
  };

  return (
    <Container
      currentPage="settings"
      color="blue"
    >
      <Space
        size="large"
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center"
        }}
      >
        <Col>
          <Row justify="center" style={{fontSize: "30px", fontWeight: "bold"}}>
          Account Settings
          </Row>
          <Row justify="center">
          Deleting your Account is irreversible.
          </Row>
        </Col>
        <Row justify="center">
          {success && <Alert message={success} type="success" showIcon style={{marginBottom: "20px"}}/>}
          {error && <Alert message={error} type="error" showIcon style={{marginBottom: "20px"}}/>}
        </Row>
        <Row justify="center">
          <Col>
            <Button onClick={showDeleteConfirm} danger disabled={helper.getAccountType(token) == "admin"}>Delete Account</Button>
          </Col>
        </Row>
      </Space>
    </Container>
  );
};

export default Settings;
