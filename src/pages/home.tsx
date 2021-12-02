import React from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import Container from "../shared/container";
import helper from "../util/helper";
import { Button, Col, Row, Space } from "antd";
import { Link } from "react-router-dom";
import {unsetRefreshToken, unsetToken} from "../redux/token/tokenSlice";

const Home = () : JSX.Element => {

  // const [token, setToken] = useContext(TokenContext)!;

  const dispatch = useAppDispatch();
  const token = useAppSelector(state => state.token.token)!;

  const logout = () => {
    dispatch(unsetRefreshToken());
    dispatch(unsetToken());
  };

  return (
    <Container
      currentPage="home"
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
          Du bist ein {helper.getAccountType(token)}!
          </Row>
        </Col>
        <Row justify="center">
          <Col>
            <Button onClick={logout}>Logout</Button>
            { helper.getAccountType(token) !== "user" &&
              <Link to={"/createuser"}>
                <Button>Create User</Button>
              </Link>
            }
          </Col>
        </Row>
      </Space>
    </Container>
  );
};

export default Home;
