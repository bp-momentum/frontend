import React, { useEffect } from "react";
import useApi from "@hooks/api";
import { message } from "antd";
import Routes from "@util/routes";
import Translations from "@localization/translations";
import { useTranslation } from "react-i18next";

const Medals: React.FC = () => {
  const api = useApi();
  const { t } = useTranslation();

  const loadMedals = async () => {
    const response = await api.execute(Routes.getMedals());
    if (!response || !response.success) {
      message.error(
        response?.description ?? t(Translations.errors.unknownError)
      );
      return;
    }
    console.log(response); // TODO remove
  };
  useEffect(() => {
    loadMedals().catch(message.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>Medals</>;
};

export default Medals;
