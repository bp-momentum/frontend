import React from "react";
import logo from "../logo.svg";
import Container from "../shared/container";

// Example home page
export default function Home () : JSX.Element {
  return (
    <Container
      currentPage="home"
      color="blue"
    >
      <img src={logo} className="App-logo" alt="logo" />
      <p>
        Edit <code>src/App.tsx</code> and save to reload.
      </p>
      <a
        className="App-link"
        href="https://reactjs.org"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn Simple React
      </a>
    </Container>
  );
}