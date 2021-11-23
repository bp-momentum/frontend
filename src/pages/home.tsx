import React from "react";
import { useAppSelector } from "../redux/hooks";
import helper from "../util/helper";
import {Button} from "antd";
import {Link} from "react-router-dom";

const Home = () : JSX.Element => {

  // const [token, setToken] = useContext(TokenContext)!;

  const token = useAppSelector(state => state.token.token)!;

  return (
    <header className="App-header">
      <p>
        Du bist ein {helper.getAccountType(token)}!
      </p>
      <Button onClick={props.logout}>Logout</Button>
      { helper.getAccountType(props.token) !== "user" &&
        <Link to={"/createuser"}>
          <Button>Create User</Button>
        </Link>
      }
    </header>
  );
};

export default Home;