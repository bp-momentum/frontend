import useApi from "@hooks/api";
import { useTranslation } from "react-i18next";
import Routes from "@util/routes";
import { useCallback } from "react";

const useLanguageUpdater = () => {
  const api = useApi();
  const { i18n } = useTranslation();

  const updateLanguage = useCallback(() => {
    console.log("Update language");
    const language = i18n.language;
    const lng = language.toLowerCase().includes("de") ? "de" : "en";
    api.execute(Routes.changeLanguage({ language: lng })).catch(console.error);
    i18n.changeLanguage(lng).catch(console.error);
  }, [i18n, api]);

  return { updateLanguage };
};

export default useLanguageUpdater;
