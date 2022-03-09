import React, { useEffect } from "react";
import useApi from "@hooks/api";
import Routes from "@util/routes";
import { Achievement } from "@api/achievement";
import { message } from "antd";
import { useTranslation } from "react-i18next";
import Translations from "@localization/translations";

const Achievements: React.FC = () => {
  const api = useApi();
  const { t } = useTranslation();

  const [unachievedHiddenAchievements, setUnachievedHiddenAchievements] =
    React.useState(0);
  const [achievements, setAchievements] = React.useState<Achievement[]>([]);

  const loadAchievements = async () => {
    const response = await api.execute(Routes.getAchievements());
    if (!response || !response.success) {
      message.error(
        response?.description ?? t(Translations.errors.unknownError)
      );
      return;
    }
    console.log(response);
    setUnachievedHiddenAchievements(response.data.nr_unachieved_hidden);
    setAchievements(response.data.achievements);
  };

  useEffect(() => {
    loadAchievements().catch(message.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>Achievements</>;
};

export default Achievements;
