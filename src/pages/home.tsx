import React from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import Container from "../shared/container";
import helper from "../util/helper";
import { Button } from "antd";
import { Link } from "react-router-dom";
import { unsetToken } from "../redux/token/tokenSlice";

const Home = () : JSX.Element => {

  // const [token, setToken] = useContext(TokenContext)!;

  const dispatch = useAppDispatch();
  const token = useAppSelector(state => state.token.token)!;

  const logout = () => dispatch(unsetToken());

  return (
    <Container
      currentPage="home"
      color="blue"
    >
      <p>
        Du bist ein {helper.getAccountType(token)}!
      </p>
      <Button onClick={logout}>Logout</Button>
      { helper.getAccountType(token) !== "user" &&
        <Link to={"/createuser"}>
          <Button>Create User</Button>
        </Link>
      }
    </Container>
  );
};

export default Home;