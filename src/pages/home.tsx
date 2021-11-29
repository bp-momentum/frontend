import React from "react";
import { useAppSelector } from "../redux/hooks";
import Container from "../shared/container";
import helper from "../util/helper";

const Home = () : JSX.Element => {

  // const [token, setToken] = useContext(TokenContext)!;

  const token = useAppSelector(state => state.token.token)!;

  return (
    <Container
      currentPage="home"
      color="blue"
    >
      <p>
        Du bist ein {helper.getAccountType(token)}!
      </p>
    </Container>
  );
};

export default Home;