import React, { useEffect, useState } from "react";
import TrainLayout from "./components/trainLayout";
import { Col, Row } from "antd";
import Paper from "@shared/paper";
import { FaCheck } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import Translations from "@localization/translations";
import { useAppSelector } from "@redux/hooks";

interface Props {
  exercise: ExerciseData;
  continueTraining: () => void;
}

/**
 * The component that handles a finished set.
 * @param {Props} props The properties of the component.
 * @returns {JSX.Element} The component.
 */
const SetDone: React.FC<Props> = ({
  exercise,
  continueTraining,
}: Props): JSX.Element => {
  const [remainingSeconds, setRemainingSeconds] = useState<number>(30);
  const { t } = useTranslation();

  useEffect(() => {
    let isMounted = true;
    if (remainingSeconds === 0) {
      continueTraining();
      return;
    }
    setTimeout(() => {
      if (!isMounted) return;
      setRemainingSeconds(remainingSeconds - 1);
    }, 1000);

    return () => {
      isMounted = false;
    };
  });

  const getTypeKey = (type: string) => {
    switch (type) {
      case "Intensity":
        return Translations.training.intensity;
      case "Accuracy":
        return Translations.training.accuracy;
      case "Speed":
      default:
        return Translations.training.speed;
    }
  };

  const stats = useAppSelector((state) => state.trainingScore);

  const setScores = stats.scoreHistory[stats.currentSet];
  const totalAccuracy = setScores.reduce((acc, cur) => acc + cur.accuracy, 0);
  const totalSpeed = setScores.reduce((acc, cur) => acc + cur.speed, 0);
  const totalIntensity = setScores.reduce((acc, cur) => acc + cur.intensity, 0);

  // focus is "Accuracy", "Speed", "Intensity"
  // it is determined by the lowest total score
  let focus = "Accuracy";
  let lowest = totalAccuracy;
  if (totalSpeed < lowest) {
    focus = "Speed";
    lowest = totalSpeed;
  }
  if (totalIntensity < lowest) {
    focus = "Intensity";
    lowest = totalIntensity;
  }

  return (
    <TrainLayout exercise={exercise}>
      <div
        style={{
          overflowY: "auto",
          padding: "20px",
        }}
      >
        <Col
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            overflowY: "auto",
            height: "100%",
          }}
        >
          <h1 style={{ color: "white", fontSize: "70px" }}>
            {exercise?.title}
          </h1>
          <Row
            justify="space-around"
            style={{
              width: "100%",
              paddingTop: "50px",
            }}
          >
            <h3 style={{ width: "200px", color: "white", fontSize: "36px" }}>
              {t(Translations.training.score, {
                points: "TODO",
              })}
            </h3>
            <Paper
              title={
                <span style={{ fontSize: "40px", lineHeight: "47.145px" }}>
                  {t(Translations.training.todo)}
                </span>
              }
              padding={60}
              backdropColor="#466995"
              lineColor="#A1C7DA"
              totalWidth={500}
              margin="0"
            >
              <div
                style={{
                  width: "300px",
                }}
              >
                {Array.from(Array(exercise?.sets ?? 0).keys()).map((set) => (
                  <Row key={set} justify="space-between">
                    <>
                      {t(Translations.training.set, { number: set + 1 })}
                      <br />
                    </>
                    {set < stats.currentSet && <FaCheck color="green" />}
                  </Row>
                ))}
              </div>
            </Paper>
            {focus ? (
              <h3 style={{ width: "200px", color: "white", fontSize: "24px" }}>
                {t(Translations.training.tip, {
                  type: t(getTypeKey(focus)),
                })}
              </h3>
            ) : (
              <div style={{ width: "200px" }} />
            )}
          </Row>
          <Row justify="space-between" style={{ width: "100%" }}>
            <div style={{ width: "130px" }} />
            <h3
              style={{ color: "white", fontSize: "40px", paddingTop: "50px" }}
            >
              {t(Translations.training.remainingSets, {
                count: (exercise?.sets ?? stats.currentSet) - stats.currentSet,
              })}
            </h3>
            <Col
              onClick={continueTraining}
              style={{
                cursor: "pointer",
                width: "130px",
                color: "white",
                marginRight: "20px",
              }}
            >
              <img
                src={process.env.PUBLIC_URL + "/continue_arrow.png"}
                alt="Continue"
                width="100px"
              />
              {t(Translations.training.nextSet, { seconds: remainingSeconds })}
            </Col>
          </Row>
        </Col>
      </div>
    </TrainLayout>
  );
};

export default SetDone;
