import React from "react";
import helper from "../util/helper";
import {Button} from "antd";
import {Link} from "react-router-dom";

interface HomeProps {
  token: string;
}

const Home = (props: HomeProps) : JSX.Element => {
  return (
    <header className="App-header">
      <p>
        Du bist ein {helper.getAccountType(props.token)}!
      </p>
      { helper.getAccountType(props.token) !== "user" &&
        <Link to={"/createuser"}>
          <Button>Create User</Button>
        </Link>
      }
    </header>
  );
};

export default Home;