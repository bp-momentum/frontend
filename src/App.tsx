import "./App.css";
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/home";

// Basic App that is just used to Route to different pages
function App() : JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user/" >
          <Route path="login/" element={<div>Login</div>} />
          <Route path="register/" element={<div>Register</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
