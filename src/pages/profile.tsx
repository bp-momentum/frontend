import React from "react";
import { useTranslation } from "react-i18next";
import Container from "../shared/container";

const Profile = (): JSX.Element => {
  const { t, i18n } = useTranslation();

  return (
    <Container currentPage="profile" color="blue">
      <h1>Hallo</h1>
    </Container>
  );
};

export default Profile;
