import { Button, Form, Input, Checkbox, Row, Col, Radio, Steps  } from "antd";
import React from "react";
const { Step } = Steps;

interface LoginProps {
  setToken: (token: string) => void;
}

const onFinish = (values: any, register: boolean) => {
  const username = values["username"];
  const password = values["password"];

  if (register) {
    const repeatPassword = values["repeat-password"];
    if (repeatPassword !== password) {
      console.log("Failed Register! Passwords do not match!");
      return;
    }

    console.log("Register with username:", username, "Password:", password);
  } else {
    console.log("Login with username:", username, "Password:", password);
  }
};

const onFinishFailed = (errorInfo: any) => {
  console.log("Failed:", errorInfo);
};

const Login = (props: LoginProps) : JSX.Element  => {
  const [register, setRegister] = React.useState(false);

  return (
    <>
      <Row justify="center">
        <Col>
          <Radio.Group onChange={e => {setRegister(e.target.value === "Register");}} defaultValue="Login" >
            <Radio.Button value="Login">Login</Radio.Button>
            <Radio.Button value="Register">Register</Radio.Button>
          </Radio.Group>
        </Col>
      </Row>
      <Row justify="center">
        <Col>
          <Form
            style={{margin: "auto"}}
            name="basic"
            labelCol={{ span: 10 }}
            wrapperCol={{ span: 20 }}
            initialValues={{ remember: true }}
            onFinish={(values) => onFinish(values, register)}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="Username"
              name="username"
              rules={[{ required: true, message: "Please input your username!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: "Please input your password!" }]}
            >
              <Input.Password />
            </Form.Item>

            {register &&
              <Form.Item
                label="Repeat Password"
                name="repeat-password"
                rules={[{ required: true, message: "Please input your password again!" }]}
              >
                <Input.Password />
              </Form.Item>
            }

            <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit">
                {register ? "Register" : "Login"}
              </Button>
            </Form.Item>
          </Form>
        </Col>
        { register &&
        <Col>
          <Steps progressDot current={1} direction="vertical">
            <Step title="Create User" />
            <Step title="Validate Email" />
            <Step title="Done" />
          </Steps>
        </Col>
        }
      </Row>
    </>
  );
};

export default Login;
