import React from "react";
import { useAppSelector } from "../redux/hooks";
import helper from "../util/helper";

const Home = () : JSX.Element => {

  // const [token, setToken] = useContext(TokenContext)!;

  const token = useAppSelector(state => state.token.token)!;

  return (
    <header className="App-header">
      <p>
        Du bist ein {helper.getAccountType(token)}!
      </p>
    </header>
  );
};

export default Home;