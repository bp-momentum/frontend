import {Alert, Button, Checkbox, Col, Form, Input, Row, Space} from "antd";
import {LockOutlined, UserOutlined} from "@ant-design/icons";
import React from "react";
import api from "../util/api";
import Routes from "../util/routes";
import { useAppDispatch } from "../redux/hooks";
import {setRefreshToken, setToken} from "../redux/token/tokenSlice";
import { useNavigate } from "react-router";

export interface RegisterProps {
  registerToken: string;
}

const Register = (props: RegisterProps) : JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [error, setError] = React.useState<null | string>();

  const onFinish = async (values: any) => {
    setError(null);
    const password = values["password"];
    const passwordRepeat = values["password-repeat"];
    const username = values["username"];
    const remember = values["remember"];

    if (password !== passwordRepeat) {
      setError("The passwords do not match.");
      return;
    }

    const response = await api.execute(Routes.registerUser({
      password: password,
      registerToken: props.registerToken,
      username: username,
    })).catch((error) => {
      setError(error.message);
    });

    if (!response) {
      setError("Something went wrong.");
      return;
    }

    if (!response.success) {
      setError(response.description ?? "Something went wrong.");
      return;
    }

    console.log("Registered successfully!");
    const token = response.data["session_token"];
    const refreshToken = response.data["refresh_token"];

    if (remember) {
      dispatch(setRefreshToken(refreshToken));
    }
    dispatch(setToken(token));
    navigate("", {replace: true});
  };

  const onFinishFailed = (errorInfo: unknown) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Space size="large" style={{width: "100%", height: "100%", position: "absolute", display: "flex", flexDirection: "column", justifyContent: "center"}}>
      <Col>
        <Row justify="center" style={{fontSize: "30px", fontWeight: "bold"}}>
          Register your account
        </Row>
        <Row justify="center">
          Please choose a new username and password
        </Row>
      </Col>
      <Row justify="center">
        <Col>
          <Form
            name="register"
            labelCol={{ span: 16 }}
            wrapperCol={{ span: 24  }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            onValuesChange={() => setError(null)}
            autoComplete="off"
          >

            {error && <Alert message={error} type="error" showIcon style={{marginBottom: "20px"}}/>}

            <Form.Item
              name="username"
              rules={[{ required: true, message: "Please choose a username!" }]}
            >
              <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username"/>
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: "Please enter your password!" }]}
            >
              <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} placeholder="Password"/>
            </Form.Item>

            <Form.Item
              name="password-repeat"
              rules={[{ required: true, message: "Please enter your password again!" }]}
            >
              <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} placeholder="Password"/>
            </Form.Item>

            <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Login
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </Space>
  );
};

export default Register;

