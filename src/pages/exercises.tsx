import React, {useEffect} from "react";
import {Exercise} from "../api/exercise";
import api from "../util/api";
import Routes from "../util/routes";
import Container from "../shared/container";
import {Col, Row, Layout, Progress, Card, Tooltip, Button, message} from "antd";
import Translations from "../localization/translations";
import {Content} from "antd/es/layout/layout";
import {t} from "i18next";
import { PlayCircleOutlined } from "@ant-design/icons";

const dayOrder = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

const isPast = (dayName: string) : boolean => {
  const now = new Date();
  const nowDayName = now.toLocaleDateString("en-GB", {weekday: "long"}).toLowerCase();
  return dayOrder.indexOf(dayName) < dayOrder.indexOf(nowDayName);
};

const isFuture = (dayName: string) : boolean => {
  const now = new Date();
  const nowDayName = now.toLocaleDateString("en-GB", {weekday: "long"}).toLowerCase();
  return dayOrder.indexOf(dayName) > dayOrder.indexOf(nowDayName);
};

const openNextExercise = () : void => {
  // TODO
  console.log("open next exercise");
};

const openExercise = (exercise: Exercise): void => {
  // TODO
  console.log("open " + exercise.title);
};

const Day = ({list, name, displayName}: {list: Exercise[], name: string, displayName: string}) => {
  const exercises = list.filter((e) => e.date === name);

  const past = isPast(name);
  const future = isFuture(name);
  const today = !past && !future;

  const doneExercises = future ? 0.0 : Math.random() * exercises.length;
  const progress = doneExercises === 0 ? 0 : Math.floor((doneExercises / exercises.length) * 100);

  return (
    <Col>
      <Card
        style={{minWidth: "230px", background: today ? "#fff" : past ? "#aaa" : "#ccc"}}
        title={
          <>
            <div style={{display: "flex", alignItems: "flex-start"}}>
              <h1 style={{verticalAlign: "middle"}}>
                {displayName}
              </h1>
              {today &&
                <Tooltip title={<><span>{t(Translations.exercises.nextExercise)}</span></>}>
                  <span style={{margin: "0", marginLeft: "10px", fontSize: "20px" }}>
                    <Button
                      style={{border: "0px"}}
                      shape={"circle"}
                      icon={<PlayCircleOutlined style={{fontSize: "20px"}} />}
                      onClick={openNextExercise}
                    />
                  </span>
                </Tooltip>
              }
            </div>
            <Progress
              style={{paddingRight: "5px"}}
              percent={future ? 0 : progress}
              size="small"
              status={past && progress !== 100 ? "exception"
                : progress === 100 ? "success" : "normal"}
            />
          </>
        }>
        {exercises.length === 0 &&
          <h4 style={{margin: "0"}}>
            {t(Translations.exercises.noExercises)}
          </h4>
        }

        {exercises.map((e) => <ExerciseCard key={e.date+e.sets} exercise={e}/>)}
      </Card>
    </Col>
  );
};

const ExerciseCard = ({exercise}: {exercise : Exercise}) => {
  return (
    <div style={{display: "flex", alignItems: "center"}} onClick={() => openExercise(exercise)}>
      <h4 style={{margin: "0"}}>{exercise.title}</h4>
      <Tooltip title={<><span>{t(Translations.planEditor.cardTooltipRepeats, {count: exercise.repeats_per_set}) + t(Translations.planEditor.cardTooltipSets, {count: exercise.sets})}</span></>}>
        <span style={{margin: "0", marginLeft: "auto", fontWeight: 400, fontSize: "14px"}}>
          {exercise.repeats_per_set} × {exercise.sets}
        </span>
      </Tooltip>
    </div>
  );
};

const Exercises = () : JSX.Element => {
  const [exercises, setExercises] = React.useState<Exercise[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);

  const loadAssignedPlan = async () => {
    const response = await api.execute(Routes.getAssignedPlans());
    if (!response) return;
    if (!response.success) {
      message.error(t(response.description ?? Translations.errors.unknownError));
      setLoading(false);
      return;
    }

    const exerciseList = response.data.exercises;
    const exercises : Exercise[] = [];
    for (const i in exerciseList) {
      const exercise = exerciseList[i];
      const id = exercise.id;
      const res = await api.execute(Routes.getExercise({id: id}));
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

  return (
    <Container
      currentPage="home"
      color="blue"
    >
      <Layout style={{height: "100%", position: "absolute", maxHeight: "100%", width: "100%"}}>
        <Content style={{display: "flex", width: "100%"}}>
          <Content style={{display: "flex", width: "100%", padding: "10px", paddingTop: "20px", overflow: "auto"}}>
            <Row
              style={{width: "100%", alignContent: "flex-start"}}
              justify="center"
              gutter={[16, 16]}
            >

              <Day list={exercises} name="monday" displayName={t(Translations.weekdays.monday)}/>
              <Day list={exercises} name="tuesday" displayName={t(Translations.weekdays.tuesday)}/>
              <Day list={exercises} name="wednesday" displayName={t(Translations.weekdays.wednesday)}/>
              <Day list={exercises} name="thursday" displayName={t(Translations.weekdays.thursday)}/>
              <Day list={exercises} name="friday" displayName={t(Translations.weekdays.friday)}/>
              <Day list={exercises} name="saturday" displayName={t(Translations.weekdays.saturday)}/>
              <Day list={exercises} name="sunday" displayName={t(Translations.weekdays.sunday)}/>
            </Row>
          </Content>
        </Content>
      </Layout>
    </Container>
  );

};

export default Exercises;
