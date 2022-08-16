import React from "react";
import Translations from "@localization/translations";
import Paper from "@shared/paper";
import { useTranslation } from "react-i18next";

interface Props {
  collapsed: boolean;
  exercise?: ExerciseData;
}

/**
 * The sider of the layout for the training page
 * @param {Props} props The props
 * @returns {JSX.Element} The component
 */
const TrainSider: React.FC<Props> = ({
  exercise,
  collapsed,
}: Props): JSX.Element => {
  const { t } = useTranslation();

  return (
    <>
      <div
        style={{
          position: "absolute",
          transform: collapsed
            ? "translate(-50%, -50%) rotate(-90deg)"
            : "translate(-50%, -50%) rotate(-90deg)",
          top: "50%",
          left: collapsed ? "50%" : "-50%",
          fontSize: "30px",
          color: "white",
          transition: "all 0.2s ease-in-out",
          overflow: "hidden",
        }}
      >
        {t(Translations.training.instructions)}
      </div>
      <div
        style={{
          position: "absolute",
          width: "100%",
          color: "white",
          top: collapsed ? "100%" : "0px",
          transition: "all 0.2s ease-in-out",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          overflowY: "auto",
          overflowX: "hidden",
          height: "100%",
          padding: "40px 0",
        }}
      >
        <Paper
          padding={60}
          backdropColor="#466995"
          lineColor="#A1C7DA"
          totalWidth={500}
          title={
            <span style={{ fontSize: "40px", lineHeight: "47.145px" }}>
              {t(Translations.training.instructions)}
            </span>
          }
        >
          {exercise?.description || ""}
        </Paper>

        {exercise?.videoPath && (
          <video
            src={exercise.videoPath}
            controls
            style={{
              marginTop: "80px",
              fontSize: "20px",
              fontWeight: "bold",
              width: "80%",
              background: "white",
            }}
          />
        )}
      </div>
    </>
  );
};

export default TrainSider;
