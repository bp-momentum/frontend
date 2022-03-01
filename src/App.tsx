import "./styles/App.css";
import React, { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { useAppSelector } from "./redux/hooks";
import api from "./util/api";
import Helper from "./util/helper";

import Home from "./pages/home/home";
import Login from "./pages/login";
import Register from "./pages/register/register";
import AutoLogin from "./pages/login/autoLogin";
import Settings from "./pages/settings/settings";
import EditPlan from "./pages/manage/editPlan";
import ManagePlans from "./pages/manage/plans";
import Exercises from "./pages/exercises";
import Leaderboard from "./pages/leaderboard";
import Train from "./pages/train";
import Error404 from "./pages/error/404";
import Error418 from "./pages/error/418";
import helper from "./util/helper";
import Users from "./pages/manage/users";
import Profile from "./pages/profile";
import { ConfigProvider } from "antd";
import { Locale } from "antd/lib/locale-provider";
import { useTranslation } from "react-i18next";
import moment from "moment";
import ResetForm from "./pages/reset_password/resetPw";

// initialize available languages of moment library
import "moment/locale/de";
import "moment/locale/en-gb";

// import available languages from ant locales
import deDE from "antd/lib/locale-provider/de_DE";
import enGB from "antd/lib/locale-provider/en_GB";
import ChangePassword from "./pages/change_password/change_password";

const LocalizedApp: React.FC = () => {
  const [locale, setLocale] = React.useState<Locale>(deDE);
  const { i18n } = useTranslation();

  const updateLanguage = (language: string) => {
    moment.locale(language);
    switch (language) {
      case "de":
        setLocale(deDE);
        break;
      case "en":
        setLocale(enGB);
        break;
    }
  };

  useEffect(() => updateLanguage(i18n.language), [i18n.language]);
  return (
    <ConfigProvider locale={locale}>
      <App />
    </ConfigProvider>
  );
};

// Basic App that is just used to Route to different pages
const App: React.FC = () => {
  const token = useAppSelector((state) => state.token.token);
  const refreshToken = useAppSelector((state) => state.token.refreshToken);

  useEffect(() => {
    api.setToken(token || "");
    api.setRefreshToken(refreshToken || "");
  }, [refreshToken, token]);

  const useQuery = new URLSearchParams(useLocation().search);
  const new_user_token = useQuery.get("new_user_token");

  const reset_token = useQuery.get("reset_token");

  // It is probably enough to just pass the token to Register directly as a prop

  if (new_user_token && reset_token) {
    return <Error418 />;
  }

  if (new_user_token) {
    return <Register registerToken={new_user_token} />;
  }

  if (reset_token) {
    return <ResetForm resetToken={reset_token} />;
  }

  if (
    !Helper.isRefreshTokenValid(refreshToken) &&
    !Helper.isSessionTokenValid(token)
  ) {
    return <Login />;
  }

  if (!Helper.isSessionTokenValid(token)) {
    return <AutoLogin />;
  }

  const isUser = token && helper.getAccountType(token) === "user";
  const isTrainer = token && helper.getAccountType(token) === "trainer";
  const isAdmin = token && helper.getAccountType(token) === "admin";

  if (isUser) {
    return (
      <Routes>
        <Route path="/" element={<Exercises />} />
        <Route path="/train/:exercisePlanId" element={<Train />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/settings/change_password" element={<ChangePassword />} />
        <Route path="*" element={<Error404 />} />
      </Routes>
    );
  }

  if (isTrainer) {
    return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/manage">
          <Route path="plans" element={<ManagePlans />} />
          <Route path="plans/:planId" element={<EditPlan />} />
          <Route path="users" element={<Users />} />
        </Route>
        <Route path="*" element={<Error404 />} />
      </Routes>
    );
  }

  if (isAdmin) {
    return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/manage">
          <Route path="users" element={<Users />} />
        </Route>
        <Route path="*" element={<Error404 />} />
      </Routes>
    );
  }

  return <Error404 />;
};

export default LocalizedApp;
