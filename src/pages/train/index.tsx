import React, { useEffect, useRef, useState } from "react";
import Container from "../../shared/container";
import api from "../../util/api";
import Routes from "../../util/routes";
import "../../styles/train.css";
import { useParams } from "react-router-dom";
import Training from "./training";
import SetDone from "./setDone";
import ExerciseDone from "./exerciseDone";

export interface ExerciseData {
  title: string;
  description: string;
  sets: number;
  repeatsPerSet: number;
  videoPath: string | null;
  activated: boolean;
}

export interface statsType {
  data: dataEntryType[];
  set: number;
  totalPoints: number;
}

const Train: React.FC = () => {
  const [exercise, setExercise] = React.useState<ExerciseData>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const initialCollapsed = useRef(false);

  const stats = useRef<statsType>({
    data: [],
    totalPoints: 0,
    set: 0,
  });

  const [subPage, setSubPage] = useState<subPage>("training");

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
            setLoading(false);
          });
      else {
        setError(true);
        setLoading(false);
      }
    });

    return () => {
      // clean up
      isMounted = false;
    };
  }, [loading, exercisePlanId]);

  return (
    <Container confimLeave={subPage !== "exerciseDone"}>
      {loading || exercise === undefined ? (
        <div>Loading...</div>
      ) : (
        <>
          {subPage === "training" && (
            <Training
              loadingExercise={loading}
              exercise={exercise}
              error={error}
              setSubPage={setSubPage}
              stats={stats}
              exercisePlanId={exercisePlanId}
              initialCollapsed={initialCollapsed}
            />
          )}
          {subPage === "setDone" && (
            <SetDone
              stats={stats}
              exercise={exercise}
              setSubPage={setSubPage}
              initialCollapsed={initialCollapsed}
            />
          )}
          {subPage === "exerciseDone" && (
            <ExerciseDone stats={stats} exercise={exercise} />
          )}
        </>
      )}
    </Container>
  );
};

export default Train;
