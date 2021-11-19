import {Button, Form, Input, Checkbox, Row, Col, Radio, Steps, Alert} from "antd";
import React from "react";
import api from "../util/api";
import Routes from "../util/routes";
const { Step } = Steps;

interface LoginProps {
  setToken: (token: string) => void;
}

const Login = (props: LoginProps) : JSX.Element  => {
  const [register, setRegister] = React.useState(false);
  const [error, setError] = React.useState("");

  const onFinish = (values: any) => {
    const username = values["username"];
    const password = values["password"];

    if (register) {
      const repeatPassword = values["repeat-password"];
      const firstName = values["first-name"];
      const lastName = values["last-name"];
      if (repeatPassword !== password) {
        setError("Passwords do not match!");
        console.log("Failed Register! Passwords do not match!");
        return;
      }

      api.execute(Routes.registerUser, {
        first_name: firstName,
        last_name: lastName,
        username: username,
        password: password
      })?.then(console.log);

      console.log("Register with username:", username, "Password:", password);
    } else {
      console.log("Login with username:", username, "Password:", password);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      <Row justify="center">
        <Col>
          <Radio.Group onChange={e => {
            setRegister(e.target.value === "Register");
            setError("");
          }} defaultValue="Login" >
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
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >

            <Form.Item
              label="First Name"
              name="first-name"
              rules={[{ required: true, message: "Please input your First Name!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Last Name"
              name="last-name"
              rules={[{ required: true, message: "Please input your Last Name!" }]}
            >
              <Input />
            </Form.Item>

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

            {error !== "" &&
            <Alert message={error} type="error" showIcon/>
            }

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
