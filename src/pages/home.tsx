import React from "react";
import helper from "../util/helper";

interface HomeProps {
  token: string;
}

const Home = (props: HomeProps) : JSX.Element => {
  return (
    <header className="App-header">
      <p>
        Du bist ein {helper.getAccountType(props.token)}!
      </p>
    </header>
  );
};

export default Home;