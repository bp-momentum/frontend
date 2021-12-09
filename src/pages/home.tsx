import React from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import Container from "../shared/container";
import helper from "../util/helper";
import { Button } from "antd";
import { Link } from "react-router-dom";
import {unsetRefreshToken, unsetToken} from "../redux/token/tokenSlice";
import {useTranslation} from "react-i18next";
import Translations from "../localization/translations";

const Home = () : JSX.Element => {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.token.token);
  const { t } = useTranslation();

  const logout = () => {
    dispatch(unsetRefreshToken());
    dispatch(unsetToken());
  };

  return (
    <Container
      currentPage="home"
      color="blue"
    >
      <p>
        {token && t(Translations.home.youAre, {type: t("user." + helper.getAccountType(token))})}
      </p>
      <Button onClick={logout}>{t(Translations.home.logout)}</Button>
      { token && helper.getAccountType(token) !== "user" &&
        <Link to={"/createuser"}>
          <Button>{t(Translations.home.createUser)}</Button>
        </Link>
      }
    </Container>
  );
};

export default Home;
