import "./App.css";
import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/login";

function getSessionStorageOrDefault(key: string, defaultValue: unknown) {
  const stored = sessionStorage.getItem(key);
  if (!stored) {
    return defaultValue;
  }
  return JSON.parse(stored);
}

// Basic App that is just used to Route to different pages
function App() : JSX.Element {
  const [token, setToken] = useState<string | null>(getSessionStorageOrDefault("token", false));

  useEffect(() => {
    sessionStorage.setItem("token", JSON.stringify(token));
  }, [token]);

  if (!token) {
    return (
      <Login setToken={setToken}  />
    );
  }

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home token={token} />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
