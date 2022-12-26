import React from "react";
import "@styles/train.css";
import Translations from "@localization/translations";
import TrainLayout from "../components/trainLayout";
import { useTranslation } from "react-i18next";
import Paper from "@shared/paper";
import useWindowDimensions from "@hooks/windowDimension";
import VideoElement from "../components/videoElement";
import { useAppSelector } from "@redux/hooks";

interface Props {
  exercise: ExerciseData;
  onFinishSet: () => void;
}

const InformationComponent: React.FC = () => {
  const information = useAppSelector(
    (state) => state.trainingScore.information
  );

  if (information)
    return (
      <h1 style={{ color: "white", fontSize: "25px", marginTop: "60px" }}>
        {information}
      </h1>
    );

  return <></>;
};

const PointsPaper: React.FC = () => {
  const latestPoints = useAppSelector(
    (state) => state.trainingScore.latestScore
  );
  const { t } = useTranslation();

  return (
    <Paper
      title={
        <span style={{ fontSize: "40px", lineHeight: "47.145px" }}>
          {t(Translations.training.stats)}
        </span>
      }
      backdropColor="#466995"
      totalWidth={400}
      lineColor="#A1C7DA"
      padding={20}
      margin="40px 20px 40px 40px"
    >
      {t(Translations.training.accuracy) +
        ": \t" +
        Math.round(latestPoints.accuracy * 100) / 100 +
        "%"}
      <br />
      {t(Translations.training.intensity) +
        ": \t" +
        Math.round(latestPoints.intensity * 100) / 100 +
        "%"}
      <br />
      {t(Translations.training.speed) +
        ": \t" +
        Math.round(latestPoints.speed * 100) / 100 +
        "%"}
    </Paper>
  );
};

/**
 * The component that handles the training itself.
 * @param {Props} props The properties of the component.
 * @returns {JSX.Element} The component.
 */
const Training: React.FC<Props> = ({
  exercise,
  onFinishSet,
}: Props): JSX.Element => {
  const { width } = useWindowDimensions();

  return (
    <TrainLayout exercise={exercise}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          overflowY: "auto",
          height: "100%",
          paddingTop: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h1
            style={{
              color: "white",
              fontSize: "40px",
              marginBottom: 0,
              fontFamily: "BigBoy",
            }}
          >
            {exercise?.title}
          </h1>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexWrap: width < 900 ? "wrap" : "nowrap",
            justifyContent: "center",
          }}
        >
          <VideoElement onFinishSet={onFinishSet} exercise={exercise} />
          <PointsPaper />
        </div>
        <InformationComponent />
      </div>
    </TrainLayout>
  );
};

export default Training;
