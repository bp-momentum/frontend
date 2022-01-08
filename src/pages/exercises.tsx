import React, { createRef, forwardRef, RefObject, useEffect } from "react";
import { Exercise } from "../api/exercise";
import api from "../util/api";
import Routes from "../util/routes";
import Container from "../shared/container";
import {
  Col,
  Row,
  Layout,
  Progress,
  Card,
  Tooltip,
  Button,
  message,
} from "antd";
import Translations from "../localization/translations";
import { t } from "i18next";
import { PlayCircleOutlined } from "@ant-design/icons";
import Helper from "../util/helper";
import { useAppSelector } from "../redux/hooks";
import { Emoji } from "react-apple-emojis";
import "../styles/home.css";
import useWindowDimensions from "../hooks/windowDimension";

const { Content } = Layout;
const dayOrder = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const isPast = (dayName: string): boolean => {
  const now = new Date();
  const nowDayName = now
    .toLocaleDateString("en-GB", { weekday: "long" })
    .toLowerCase();
  return dayOrder.indexOf(dayName) < dayOrder.indexOf(nowDayName);
};

const isFuture = (dayName: string): boolean => {
  const now = new Date();
  const nowDayName = now
    .toLocaleDateString("en-GB", { weekday: "long" })
    .toLowerCase();
  return dayOrder.indexOf(dayName) > dayOrder.indexOf(nowDayName);
};

const openNextExercise = (): void => {
  // TODO
  console.log("open next exercise");
};

const openExercise = (exercise: Exercise): void => {
  // TODO
  console.log("open " + exercise.title);
};

const Day = forwardRef(
  (
    {
      list,
      name,
      displayName,
    }: {
      list: Exercise[];
      name: string;
      displayName: string;
    },
    ref
  ) => {
    const exercises = list.filter((e) => e.date === name);

    const past = isPast(name);
    const future = isFuture(name);
    const today = !past && !future;

    const doneExercises = future ? 0.0 : Math.random() * exercises.length;
    const progress =
      doneExercises === 0
        ? 0
        : Math.floor((doneExercises / exercises.length) * 100);

    return (
      <Col {...(ref && today ? { ref: ref as RefObject<HTMLDivElement> } : {})}>
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
              {today && (
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
                  Nimm dir einen Tag Pause
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
                  format={(percent, success) => "5 / 1"}
                />
              )}
            </div>
          }
        >
          {exercises.length === 0 && (
            <h4 style={{ margin: "0" }}>
              {t(Translations.exercises.noExercises)}{" "}
              <Emoji name="party-popper" width="25" />
            </h4>
          )}

          {exercises.map((e) => {
            e.completed = true;
            return <ExerciseCard key={e.date + e.sets} exercise={e} />;
          })}
        </Card>
      </Col>
    );
  }
);
Day.displayName = "Day";

const ExerciseCard = ({ exercise }: { exercise: Exercise }) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        border: "1px solid black",
        padding: "10px 20px",
        borderRadius: "50px",
        width: "100%",
        background: exercise.completed ? "#5ec77b" : "initial",
      }}
      onClick={() => openExercise(exercise)}
    >
      <h4 style={{ margin: "0" }}>{exercise.title}</h4>
      <Tooltip
        title={
          <>
            <span>
              {t(Translations.planEditor.cardTooltipRepeats, {
                count: exercise.repeats_per_set,
              }) +
                t(Translations.planEditor.cardTooltipSets, {
                  count: exercise.sets,
                })}
            </span>
          </>
        }
      >
        <span
          style={{
            margin: "0",
            marginLeft: "auto",
            fontWeight: 400,
            fontSize: "16px",
          }}
        >
          {exercise.repeats_per_set} × {exercise.sets}
        </span>
      </Tooltip>
    </div>
  );
};

const Exercises = (): JSX.Element => {
  const [exercises, setExercises] = React.useState<Exercise[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);

  const loadAssignedPlan = async () => {
    const response = await api.execute(Routes.getAssignedPlans());
    if (!response) return;
    if (!response.success) {
      message.error(
        t(response.description ?? Translations.errors.unknownError)
      );
      setLoading(false);
      return;
    }

    const exerciseList = response.data.exercises;
    const exercises: Exercise[] = [];
    for (const i in exerciseList) {
      const exercise = exerciseList[i];
      const id = exercise.id;
      const res = await api.execute(Routes.getExercise({ id: id }));
      exercises.push({
        id: id,
        sets: exercise.sets,
        repeats_per_set: exercise.repeats_per_set,
        date: exercise.date,
        description: res.data.description,
        title: res.data.title,
        activated: res.data.activated,
        video: res.data.video,
      });
    }

    setExercises(exercises);
    setLoading(false);
  };

  useEffect(() => {
    if (!loading) return;
    loadAssignedPlan().then(() => setLoading(false));
  });

  const { height, width } = useWindowDimensions();

  const token = useAppSelector((state) => state.token.token);
  const username = token && Helper.getUserName(token);

  const monday = createRef<HTMLDivElement>();
  const tuesday = createRef<HTMLDivElement>();
  const wednesday = createRef<HTMLDivElement>();
  const thursday = createRef<HTMLDivElement>();
  const friday = createRef<HTMLDivElement>();
  const saturday = createRef<HTMLDivElement>();
  const sunday = createRef<HTMLDivElement>();

  const wrapper = createRef<HTMLDivElement>();

  useEffect(() => {
    const day =
      monday.current ||
      tuesday.current ||
      wednesday.current ||
      thursday.current ||
      friday.current ||
      saturday.current ||
      sunday.current;
    if (!day || !wrapper.current) return;
    wrapper.current.scrollLeft =
      day.offsetLeft - width / 2 + day.getBoundingClientRect().width / 2;
  });

  return (
    <Container currentPage="home" color="blue">
      <Layout
        style={{
          height: "100%",
          position: "absolute",
          maxHeight: "100%",
          width: "100%",
        }}
      >
        <Content
          style={{
            display: "flex",
            width: "100%",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Row style={{ alignItems: "center", width: "100%" }}>
            <div
              style={{
                marginLeft: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <h1 style={{ fontSize: "48px" }}>You go, {username}!</h1>
              <h2 style={{ fontSize: "24px" }}>
                Only 6 more days for your next medal!
              </h2>
            </div>
            <div
              style={{
                marginLeft: "auto",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                marginRight: "20px",
              }}
            >
              <span
                style={{
                  fontSize: "50px",
                  color: "#FF8A00",
                  WebkitTextStroke: "1px black",
                  display: "flex",
                  flexWrap: "nowrap",
                }}
              >
                1337
                <span
                  style={{
                    background:
                      "radial-gradient(#FF8A0060 15%, #ffbe3a00 70% )",
                    fontSize: "60px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    borderRadius: "50%",
                    padding: "8px 15px",
                    margin: "-15px",
                  }}
                >
                  <Emoji style={{}} name="fire" width={60} />
                </span>
              </span>
            </div>
          </Row>
          <Content
            style={{
              display: "flex",
              width: "100%",
              padding: "00px",
              paddingTop: "20px",
              overflow: "auto",
            }}
          >
            <div className="day-wrapper">
              <Row
                style={{
                  padding: "10px 50px",
                  width: "100%",
                  height: "100%",
                  alignContent: "flex-start",
                  overflow: "auto",
                  flexFlow: height > width ? "column" : "row",
                  margin: "0px",
                  flexDirection: height > width ? "column" : "row",
                }}
                gutter={[16, 16]}
                ref={wrapper}
              >
                <Day
                  list={exercises}
                  name="monday"
                  displayName={t(Translations.weekdays.monday)}
                  ref={monday}
                />
                <Day
                  list={exercises}
                  name="tuesday"
                  displayName={t(Translations.weekdays.tuesday)}
                  ref={tuesday}
                />
                <Day
                  list={exercises}
                  name="wednesday"
                  displayName={t(Translations.weekdays.wednesday)}
                  ref={wednesday}
                />
                <Day
                  list={exercises}
                  name="thursday"
                  displayName={t(Translations.weekdays.thursday)}
                  ref={thursday}
                />
                <Day
                  list={exercises}
                  name="friday"
                  displayName={t(Translations.weekdays.friday)}
                  ref={friday}
                />
                <Day
                  list={exercises}
                  name="saturday"
                  displayName={t(Translations.weekdays.saturday)}
                  ref={saturday}
                />
                <Day
                  list={exercises}
                  name="sunday"
                  displayName={t(Translations.weekdays.sunday)}
                  ref={sunday}
                />
              </Row>
              <div className="leftOverlay" />
              <div className="rightOverlay" />
            </div>
          </Content>
        </Content>
      </Layout>
    </Container>
  );
};

export default Exercises;
