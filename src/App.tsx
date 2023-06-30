import "@styles/App.css";
import React, { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { ConfigProvider } from "antd";

import Home from "@pages/home";
import Register from "@pages/register";
import Settings from "@pages/settings";
import EditPlan from "@pages/manage/editPlan";
import ManagePlans from "@pages/manage/plans";
import Exercises from "@pages/exercises";
import Train from "@pages/train";
import Error404 from "@pages/error/404";
import Error418 from "@pages/error/418";
import Users from "@pages/manage/users";
import UserProfile from "@pages/profile/user";
import ResetForm from "@pages/reset_password";
import ChangePassword from "@pages/change_password";
import TrainerProfile from "@pages/profile/trainer";

// initialize available languages of moment library
import "moment/locale/de";
import "moment/locale/en-gb";

// import available languages from ant locales
import useLanguageUpdater from "@hooks/languageUpdater";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import Login from "@pages/login";
import useApi from "@hooks/api";
import ApiRoutes from "@util/routes";
import { login } from "@redux/profile/profileSlice";

/**
 * Wraps the normal {@link App} with a {@link ConfigProvider} to set the locale of the app.
 * @returns {JSX.Element} The app.
 */
const LocalizedApp: React.FC = (): JSX.Element => {
  const languageUpdater = useLanguageUpdater();

  const loggedIn = useAppSelector((state) => state.profile.loggedIn);

  useEffect(() => {
    if (loggedIn) languageUpdater.updateLanguage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedIn]);

  return (
    <ConfigProvider>
      <App />
    </ConfigProvider>
  );
};

/**
 * Basic App that is just used to Route to different pages
 * @returns {JSX.Element} The app.
 */
const App: React.FC = (): JSX.Element => {
  const useQuery = new URLSearchParams(useLocation().search);
  const new_user_token = useQuery.get("new_user_token");
  const reset_token = useQuery.get("reset_token");
  const username = useQuery.get("username");
  const loggedIn = useAppSelector((state) => state.profile.loggedIn);
  const role = useAppSelector((state) => state.profile.role);
  const api = useApi();
  const dispatch = useAppDispatch();

  useEffect(() => {
    // test for login when loading the app
    api.execute(ApiRoutes.checkLogin()).then((response) => {
      console.log(response);
      if (!response || !response.success) {
        return;
      }
      dispatch(
        login({
          username: response.data["username"],
          role: response.data["role"],
        })
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (new_user_token && reset_token) {
    return <Error418 />;
  }

  if (new_user_token) {
    return <Register registerToken={new_user_token} />;
  }

  if ((reset_token || username) && !reset_token && !username) {
    return <Error418 />;
  }

  if (reset_token && username) {
    return <ResetForm resetToken={reset_token} username={username} />;
  }

  if (!loggedIn) {
    return <Login />;
  }

  if (role === "player") {
    return (
      <Routes>
        <Route path="/" element={<Exercises />} />
        <Route path="/train/:exercisePlanId" element={<Train />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/settings/change_password" element={<ChangePassword />} />
        <Route path="*" element={<Error404 />} />
      </Routes>
    );
  }

  if (role === "trainer") {
    return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<TrainerProfile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/settings/change_password" element={<ChangePassword />} />
        <Route path="/manage">
          <Route path="plans" element={<ManagePlans />} />
          <Route path="plans/:planId" element={<EditPlan />} />
          <Route path="users" element={<Users />} />
        </Route>
        <Route path="*" element={<Error404 />} />
      </Routes>
    );
  }

  if (role === "admin") {
    return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/settings/change_password" element={<ChangePassword />} />
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
