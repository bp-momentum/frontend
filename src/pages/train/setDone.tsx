import React, { useEffect, useState } from "react";
import TrainLayout from "./components/trainLayout";
import { Col, Row } from "antd";
import Paper from "@shared/paper";
import { useTranslation } from "react-i18next";
import Translations from "@localization/translations";

interface Props {
  exercise: ExerciseData;
  continueTraining: () => void;
  currentSet: React.MutableRefObject<number>;
}

/**
 * The component that handles a finished set.
 * @param {Props} props The properties of the component.
 * @returns {JSX.Element} The component.
 */
const SetDone: React.FC<Props> = ({
  exercise,
  continueTraining,
  currentSet,
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

  return (
    <TrainLayout exercise={exercise} currentSet={currentSet}>
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
                    {set}
                  </Row>
                ))}
              </div>
            </Paper>
          </Row>
          <Row justify="space-between" style={{ width: "100%" }}>
            <div style={{ width: "130px" }} />
            <h3
              style={{ color: "white", fontSize: "40px", paddingTop: "50px" }}
            >
              {t(Translations.training.remainingSets, {
                count: exercise.sets - currentSet.current,
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
