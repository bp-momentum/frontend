import {Button, Form, Input, Checkbox, Row, Col, Space, Alert} from "antd";
import React from "react";
import api from "../util/api";
import Routes from "../util/routes";

interface LoginProps {
  setToken: (token: string) => void;
}

const Login = (props: LoginProps) : JSX.Element  => {
  const [error, setError] = React.useState<null | string>();

  const onFinish = async (values: any) => {
    const username = values["username"];
    const password = values["password"];
    const remember = values["remember"];

    const response = await api.execute(Routes.login({
      username: username,
      password: password
    }));

    if (!response.success) {
      setError(response.description ?? "Something went wrong.");
      return;
    }

    console.log("Logged in successfully!");
  };

  const onFinishFailed = (errorInfo: unknown) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Space size="large" style={{width: "100%", height: "100%", position: "absolute", display: "flex", flexDirection: "column", justifyContent: "center"}}>
      <Col>
        <Row justify="center" style={{fontSize: "30px"}}>
          Welcome!
        </Row>
        <Row justify="center">
          Please enter your credentials.
        </Row>
      </Col>
      <Row justify="center">
        <Col>
          <Form
            name="basic"
            labelCol={{ span: 10 }}
            wrapperCol={{ span: 20 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >

            <Form.Item
              label="Username"
              name="username"
              rules={[{ required: true, message: "Please enter your username!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: "Please enter your password!" }]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            {error &&
            <Alert message={error} type="error" showIcon/>
            }

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

export default Login;
