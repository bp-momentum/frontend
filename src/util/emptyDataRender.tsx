import React from "react";
import { Empty } from "antd";
import { t } from "i18next";
import Translations from "@localization/translations";

const EmptyDataRender: React.FC = () => {
  return (
    <div style={{ textAlign: "center", paddingTop: "10px" }}>
      {Empty.PRESENTED_IMAGE_SIMPLE}
      <p>{t(Translations.errors.empty)}</p>
    </div>
  );
};

export default EmptyDataRender;
