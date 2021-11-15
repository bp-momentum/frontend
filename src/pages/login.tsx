import { Button, Layout,  } from "antd";
import { Content } from "antd/lib/layout/layout";
import React from "react";

interface LoginProps {
  setToken: (token: string) => void;
}

const Login = (props: LoginProps) : JSX.Element  => {
  const [register, setRegister] = React.useState(false);

  return (
    <Layout>
      <Content>
        {!register && <Button type="dashed" danger onClick={() => props.setToken("token")}>Login</Button>}
        {register && <Button type="dashed" danger onClick={() => props.setToken("token")}>Register</Button>}
        <Button type="dashed" danger onClick={() => setRegister(!register)}>Register?</Button>
      </Content>
    </Layout>
  );
};

export default Login;