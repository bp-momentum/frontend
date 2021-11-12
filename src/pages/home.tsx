import React from "react";
import logo from "../logo.svg";

// Example home page
export default function Home () : JSX.Element {
  return (
    <header className="App-header">
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
    </header>
  );
}