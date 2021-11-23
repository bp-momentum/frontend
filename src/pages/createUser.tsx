import {Alert, Button, Checkbox, Col, Form, Input, Row, Space} from "antd";
import {UserOutlined, MailOutlined} from "@ant-design/icons";
import React from "react";
import Api from "../util/api";
import Routes from "../util/routes";

interface CreateUserProps {
  token: string;
}

const CreateUser = (props: CreateUserProps) : JSX.Element => {

  const onFinish = async (values: any) => {
    const firstName = values["first_name"];
    const lastName = values["last_name"];
    const username = values["username"];
    const email = values["email_address"];

    const response = await Api.execute(Routes.createUser({
      firstName: firstName,
      lastName: lastName,
      username: username,
      email: email,
      token: props.token,
    }));
    console.log(response);
  };

  const onFinishFailed = (errorInfo: unknown) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Space size="large" style={{width: "100%", height: "100%", position: "absolute", display: "flex", flexDirection: "column", justifyContent: "center"}}>
      <Col>
        <Row justify="center" style={{fontSize: "30px", fontWeight: "bold"}}>
          Create a new User
        </Row>
        <Row justify="center">
          Please enter their data
        </Row>
      </Col>
      <Row justify="center">
        <Col>
          <Form
            name="login"
            labelCol={{ span: 16 }}
            wrapperCol={{ span: 24  }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >

            <Form.Item
              name="first_name"
              rules={[{ required: true, message: "Please enter their first name!" }]}
            >
              <Input placeholder="First Name"/>
            </Form.Item>

            <Form.Item
              name="last_name"
              rules={[{ required: true, message: "Please enter their last name!" }]}
            >
              <Input placeholder="Last Name"/>
            </Form.Item>

            <Form.Item
              name="username"
              rules={[{ required: true, message: "Please enter their username!" }]}
            >
              <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username"/>
            </Form.Item>

            <Form.Item
              name="email_address"
              rules={[{ required: true, message: "Please enter their email address!" }]}
            >
              <Input prefix={<MailOutlined className="site-form-item-icon" />} placeholder="Email"/>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Create
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </Space>
  );
};

export default CreateUser;