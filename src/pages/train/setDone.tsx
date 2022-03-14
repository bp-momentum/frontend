import React, {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import TrainLayout from "./components/trainLayout";
import { Col, Row } from "antd";
import Paper from "@shared/paper";
import { FaCheck } from "react-icons/fa";
import continue_arrow from "@static/continue_arrow.png";
import { useTranslation } from "react-i18next";
import Translations from "@localization/translations";

interface Props {
  stats: MutableRefObject<StatsType>;
  initialCollapsed: MutableRefObject<boolean>;
  exercise?: ExerciseData;
  setSubPage: Dispatch<SetStateAction<subPage>>;
}

/**
 * The component that handles a finished set.
 * @param {Props} props The properties of the component.
 * @returns {JSX.Element} The component.
 */
const SetDone: React.FC<Props> = ({
  stats,
  exercise,
  setSubPage,
  initialCollapsed,
}: Props): JSX.Element => {
  const [remainingSeconds, setRemainingSeconds] = useState<number>(30);
  const { t } = useTranslation();

  useEffect(() => {
    let isMounted = true;
    if (remainingSeconds === 0) {
      setSubPage("training");
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

  const getTypeKey = (type: DataEntryType) => {
    switch (type.type) {
      case "Intensity":
        return Translations.training.intensity;
      case "Accuracy":
        return Translations.training.accuracy;
      case "Speed":
        return Translations.training.speed;
    }
  };

  let focus = stats.current.data.length === 0 ? null : stats.current.data[0];
  for (const data of stats.current.data) {
    if ((focus?.performance ?? 0) < data.performance) {
      focus = data;
    }
  }

  return (
    <TrainLayout exercise={exercise} initialCollapsed={initialCollapsed}>
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
                points: stats.current.totalPoints,
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
                    {set < stats.current.set && <FaCheck color="green" />}
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
                count:
                  (exercise?.sets ?? stats.current.set) - stats.current.set,
              })}
            </h3>
            <Col
              onClick={() => setSubPage("training")}
              style={{
                cursor: "pointer",
                width: "130px",
                color: "white",
                marginRight: "20px",
              }}
            >
              <img src={continue_arrow} alt="Continue" width="100px" />
              {t(Translations.training.nextSet, { seconds: remainingSeconds })}
            </Col>
          </Row>
        </Col>
      </div>
    </TrainLayout>
  );
};

export default SetDone;
