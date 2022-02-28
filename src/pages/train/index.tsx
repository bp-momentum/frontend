import React, { useEffect, useRef, useState } from "react";
import Container from "../../shared/container";
import api from "../../util/api";
import Routes from "../../util/routes";
import "../../styles/train.css";
import { useParams } from "react-router-dom";
import Training from "./training";
import SetDone from "./setDone";
import ExerciseDone from "./exerciseDone";
import { useGetExerciseByIdQuery } from "../../redux/exercises/exerciseSlice";
import { message } from "antd";

const exercisePlanIdToExercise = async (planId: number) => {
  const response = await api.execute(Routes.getDoneExercises());
  if (!response) return [];
  if (!response.success) {
    message.error(response.description);
    return [];
  }
  return response.data.exercises.find((e: any) => {
    return e.exercise_plan_id === planId;
  });
};

interface TrainProps {
  rawExercise: Record<string, any>;
}

const Train: React.FC<TrainProps> = ({ rawExercise }) => {
  const [exercise, setExercise] = React.useState<ExerciseData>();

  const initialCollapsed = useRef(false);

  const stats = useRef<statsType>({
    data: [],
    totalPoints: 0,
    set: 0,
  });

  const [subPage, setSubPage] = useState<subPage>("training");

  const { data, isLoading } = useGetExerciseByIdQuery(rawExercise.id);

  useEffect(() => {
    let isMounted = true;

    if (data && isMounted) {
      setExercise({
        title: data.title,
        description: data.description,
        sets: rawExercise.sets,
        repeatsPerSet: rawExercise.repeats_per_set,
        videoPath: data.video,
        activated: true,
      });
    }

    return () => {
      isMounted = false;
    };
  }, [data, rawExercise.repeats_per_set, rawExercise.sets]);

  return (
    <Container confimLeave={subPage !== "exerciseDone"}>
      {isLoading || !exercise ? (
        <div>Loading...</div>
      ) : (
        <>
          {subPage === "training" && (
            <Training
              exercise={exercise}
              setSubPage={setSubPage}
              stats={stats}
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

const Wrapper = () => {
  const [exercise, setExercise] = useState({});

  const { exercisePlanId } = useParams();

  useEffect(() => {
    let isMounted = true;

    exercisePlanIdToExercise(parseInt(exercisePlanId ?? "")).then(
      (exerciseData) => {
        if (exerciseData && isMounted) setExercise(exerciseData);
      }
    );

    return () => {
      // clean up
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Train rawExercise={exercise} />;
};

export default Wrapper;
