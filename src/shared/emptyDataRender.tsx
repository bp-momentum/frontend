import React, { ReactNode } from "react";
import { Empty } from "antd";
import { t } from "i18next";
import Translations from "@localization/translations";

interface Props {
  customText?: ReactNode;
}

/**
 * The empty data render component.
 * @param {Props} props
 * @returns {JSX.Element}
 */
const EmptyDataRender: React.FC<Props> = ({
  customText,
}: Props): JSX.Element => {
  return (
    <div style={{ textAlign: "center", paddingTop: "10px" }}>
      {Empty.PRESENTED_IMAGE_SIMPLE}
      <p>{!customText ? t(Translations.errors.empty) : customText}</p>
    </div>
  );
};

export default EmptyDataRender;
