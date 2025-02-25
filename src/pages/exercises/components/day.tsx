import React, { createRef, RefObject, useEffect } from "react";
import { Col, Progress, Card, Tooltip, Button } from "antd";
import Translations from "@localization/translations";
import { PlayCircleOutlined } from "@ant-design/icons";
import "@styles/home.css";
import { useNavigate } from "react-router-dom";
import { isFuture, isPast } from "../functions";
import ExerciseCard from "./exerciseCard";
import useWindowDimensions from "@hooks/windowDimension";
import { useTranslation } from "react-i18next";

interface Props {
  list: Exercise[];
  name: string;
  displayName: string;
  wrapper: RefObject<HTMLDivElement>;
}

/**
 * Day component for the exercises page
 * @param {Props} props The props for the component.
 * @returns {JSX.Element} The component.
 */
const Day: React.FC<Props> = ({
  list,
  name,
  displayName,
  wrapper,
}: Props): JSX.Element => {
  const { t } = useTranslation();

  const exercises = list.filter((e) => e.date === name);
  const navigate = useNavigate();

  const openNextExercise = (): void => {
    navigate(`/train/${exercises.filter((e) => !e.done)[0]?.exercise_plan_id}`);
  };

  const past = isPast(name);
  const future = isFuture(name);
  const today = !past && !future;

  const doneExercises = future ? 0.0 : exercises.filter((e) => e.done).length;
  const progress =
    doneExercises === 0
      ? 0
      : Math.floor((doneExercises / exercises.length) * 100);

  const hasExercisesToDo = exercises.filter((e) => !e.done).length > 0;

  // center around the day if the day is today
  const ref = createRef<HTMLDivElement>();

  const { width } = useWindowDimensions();

  useEffect(() => {
    if (!today) return;

    const day = ref.current;
    if (!day || !wrapper.current) return;
    wrapper.current.scrollLeft =
      day.offsetLeft - width / 2 + day.getBoundingClientRect().width / 2;
  }, [ref, today, width, wrapper]);

  return (
    <Col ref={ref}>
      <Card
        className={past ? "past" : ""}
        bordered={false}
        style={{
          borderRadius: "25px",
          minWidth: "280px",
          background: past ? "#EBEBEB" : "#fff",
          boxShadow: "-2px 4px 4px rgba(0, 0, 0, 0.25)",
          border: today ? "2px solid #4D74E8" : "none",
          padding: "0px 20px",
        }}
        headStyle={{ borderBottom: "1px solid black", padding: "0px 5px" }}
        bodyStyle={{
          padding: "20px 5px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
        title={
          <div
            data-testid={name}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <h1 style={{ verticalAlign: "middle", fontSize: "35px" }}>
              {displayName}
            </h1>
            {today && hasExercisesToDo && (
              <Tooltip
                title={
                  <>
                    <span>{t(Translations.exercises.nextExercise)}</span>
                  </>
                }
              >
                <span
                  style={{
                    position: "absolute",
                    margin: "0",
                    fontSize: "25px",
                    right: "20px",
                    top: "25px",
                  }}
                >
                  <Button
                    style={{ border: "0px" }}
                    shape={"circle"}
                    icon={<PlayCircleOutlined style={{ fontSize: "25px" }} />}
                    onClick={openNextExercise}
                    aria-label="nextExerciseButton"
                  />
                </span>
              </Tooltip>
            )}
            {exercises.length === 0 ? (
              <span
                style={{
                  fontSize: "0.9em",
                  lineHeight: "12.5px",
                  display: "block",
                }}
              >
                {t(Translations.exercises.dayOff)}
              </span>
            ) : (
              <Progress
                className="DailyProgress"
                style={{ marginRight: "-5px" }}
                percent={future ? 0 : progress}
                size="small"
                status={
                  past && progress !== 100
                    ? "exception"
                    : progress === 100
                    ? "success"
                    : "normal"
                }
                format={(percent) =>
                  `${Math.ceil(((percent || 0) / 100) * exercises.length)} / ${
                    exercises.length
                  }`
                }
              />
            )}
          </div>
        }
      >
        {exercises.length === 0 && (
          <h4 style={{ margin: "0" }}>
            {t(Translations.exercises.noExercises)}{" "}
            <span style={{ fontSize: 25, fontFamily: "Noto Color Emoji" }}>
              🎊
            </span>
          </h4>
        )}

        {exercises.map((e) => {
          return (
            <ExerciseCard
              key={"exercise" + e.exercise_plan_id}
              exercise={e}
              today={today}
            />
          );
        })}
      </Card>
    </Col>
  );
};

export default Day;
