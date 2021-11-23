import React from "react";
import helper from "../util/helper";
import {Button} from "antd";
import {Link} from "react-router-dom";

interface HomeProps {
  token: string;
  logout: () => void;
}

const Home = (props: HomeProps) : JSX.Element => {
  return (
    <header className="App-header">
      <p>
        Du bist ein {helper.getAccountType(props.token)}!
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