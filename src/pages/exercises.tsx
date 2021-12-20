import React, {useEffect} from "react";
import {useAppSelector} from "../redux/hooks";
import {useTranslation} from "react-i18next";
import {Exercise} from "../api/exercise";
import api from "../util/api";
import Routes from "../util/routes";
import Container from "../shared/container";
import {Col, Row, Layout, Divider} from "antd";
import Translations from "../localization/translations";
import {Content} from "antd/es/layout/layout";

const Day = ({list, name, displayName}: {list: Exercise[], name: string, displayName: string}) => {
  const exercises = list.filter((e) => e.date === name);
  if (exercises.length === 0)
    return (<></>);

  const date = new Date();
  const day = date.toLocaleDateString("en-GB", {weekday: "long"}).toLowerCase();
  const selected = name === day;
  return (
    <Col style={{background: selected ? "#fff" : "#ccc", display: "grid", borderRadius: "10px", margin: "10px", minWidth: "200px"}}>
      <h1 style={{marginLeft: "10px", marginBottom: "20px"}}>
        {displayName}
      </h1>
      <Divider type="horizontal"/>
      {exercises.map((e) => <ExerciseCard key={e.date+e.sets} exercise={e}/>)}
    </Col>
  );
};

const ExerciseCard = ({exercise}: {exercise : Exercise}) => {
  return (
    <Row>
      {exercise.title}
    </Row>
  );
};

const Exercises = () : JSX.Element => {
  const token = useAppSelector((state) => state.token.token);
  const { t } = useTranslation();

  const [exercises, setExercises] = React.useState<Exercise[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<null | string>();

  const loadAssignedPlan = async () => {
    const response = await api.execute(Routes.getAssignedPlans());
    if (!response) return;
    if (!response.success) {
      setError(t(response.description ?? Translations.errors.unknownError));
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
              gutter={16}
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
