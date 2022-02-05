import { Layout } from "antd";
import React, { useEffect, useState } from "react";
import Container from "../../shared/container";
import api from "../../util/api";
import Routes from "../../util/routes";
import "../../styles/train.css";
import { useParams } from "react-router-dom";
import TrainSider from "./components/trainSider";
import Training from "./training";
import SetDone from "./setDone";
import ExerciseDone from "./exerciseDone";

const { Content, Sider } = Layout;

export interface ExerciseData {
  title: string;
  description: string;
  sets: number;
  repeatsPerSet: number;
  videoPath: string | null;
  activated: boolean;
}

const Train = () => {
  const [exercise, setExercise] = React.useState<ExerciseData>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const [subPage /*, setSubPage*/] = useState<
    "training" | "setDone" | "exerciseDone"
  >("training");

  // exercisePlanId from the url
  const { exercisePlanId } = useParams();

  useEffect(() => {
    let isMounted = true;

    if (!loading) return;

    api.execute(Routes.getDoneExercises()).then((response) => {
      if (!isMounted) return;
      if (!response.success) {
        setError(true);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const exerciseData = response.data.exercises.find((e: any) => {
        return e.exercise_plan_id === parseInt(exercisePlanId ?? "");
      });
      if (exerciseData)
        api
          .execute(Routes.getExercise({ id: exerciseData.id }))
          .then((response) => {
            setExercise({
              title: response.data.title,
              description: response.data.description,
              sets: exerciseData.sets,
              repeatsPerSet: exerciseData.repeats_per_set,
              videoPath:
                response.data.video ??
                "https://vid.pr0gramm.com/2021/12/28/130aaef3ab9c207a.mp4",
              activated: response.data.title,
            });
          });
      else setError(true);
      setLoading(false);
    });

    return () => {
      // clean up
      isMounted = false;
    };
  }, [loading, exercisePlanId]);

  return (
    <Container>
      <Layout style={{ height: "100%" }}>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={() => setCollapsed(!collapsed)}
          width={collapsed ? "50px" : "500px"}
          style={{
            height: "calc(100% - 48px)",
            background: "#466995",
            overflow: "hidden",
          }}
        >
          <TrainSider
            loading={loading}
            exercise={exercise}
            error={error}
            collapsed={collapsed}
          />
        </Sider>
        <Content
          className="shadow"
          style={{ background: "#466995", overflow: "hidden", padding: "20px" }}
        >
          {subPage === "training" && (
            <Training loading={loading} exercise={exercise} error={error} />
          )}
          {subPage === "setDone" && <SetDone stats={{}} />}
          {subPage === "exerciseDone" && <ExerciseDone stats={{}} />}
        </Content>
      </Layout>
    </Container>
  );
};

export default Train;
