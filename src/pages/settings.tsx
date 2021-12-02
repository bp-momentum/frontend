import React from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import Container from "../shared/container";
import helper from "../util/helper";
import { Button, Col, Row, Space } from "antd";
import { Link } from "react-router-dom";
import {unsetRefreshToken, unsetToken} from "../redux/token/tokenSlice";

const Settings = () : JSX.Element => {

  const dispatch = useAppDispatch();
  const token = useAppSelector(state => state.token.token)!;

  const deleteAccount = () => {
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
          <Col>
            <Button onClick={deleteAccount} danger>Delete Account</Button>
          </Col>
        </Row>
      </Space>
    </Container>
  );
};

export default Settings;
