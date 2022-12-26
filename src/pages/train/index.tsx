import React, { useEffect, useState } from "react";
import Routes from "@util/routes";
import "@styles/train.css";
import { useParams } from "react-router-dom";
import Training from "./training";
import SetDone from "./setDone";
import ExerciseDone from "./exerciseDone";
import { useGetExerciseByIdQuery } from "@redux/api/api";
import { Layout, message } from "antd";
import useApi from "@hooks/api";
import { useAppSelector } from "@redux/hooks";

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rawExercise: Record<string, any>;
}

/**
 * A component that renders the training page and everything related
 * @param {Props} props The properties of the component
 * @returns {JSX.Element} The component
 */
const Train: React.FC<Props> = ({ rawExercise }: Props): JSX.Element => {
  const [exercise, setExercise] = React.useState<ExerciseData>();

  const [subPage, setSubPage] = useState<subPage>("training");

  const { data, isLoading } = useGetExerciseByIdQuery(rawExercise.id);

  useEffect(() => {
    let isMounted = true;

    if (data && isMounted && rawExercise.id !== -1) {
      setExercise({
        title: data.title,
        description: data.description,
        sets: rawExercise.sets,
        repeatsPerSet: rawExercise.repeats_per_set,
        videoPath: data.video,
        expectation: data.expectation,
      });
    }

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, rawExercise.repeats_per_set, rawExercise.sets]);

  const currentSet = useAppSelector((state) => state.trainingScore.currentSet);

  return (
    <Layout style={{ height: "100%", position: "absolute", width: "100%" }}>
      {isLoading || !exercise ? (
        <div>Loading...</div>
      ) : (
        <>
          {subPage === "training" && (
            <Training
              exercise={exercise}
              onFinishSet={() =>
                setSubPage(
                  currentSet + 1 === exercise.sets ? "exerciseDone" : "setDone"
                )
              }
            />
          )}
          {subPage === "setDone" && (
            <SetDone
              exercise={exercise}
              continueTraining={() => setSubPage("training")}
            />
          )}
          {subPage === "exerciseDone" && <ExerciseDone exercise={exercise} />}
        </>
      )}
    </Layout>
  );
};

/**
 * A component that renders the training page and everything related
 * @returns {JSX.Element} The component
 */
const Wrapper: React.FC = (): JSX.Element => {
  const [exercise, setExercise] = useState({ id: -1 });

  const { exercisePlanId } = useParams();

  const api = useApi();

  const exercisePlanIdToExercise = async (planId: number) => {
    const response = await api.execute(Routes.getDoneExercises());
    if (!response) return [];
    if (!response.success) {
      message.error(response.description);
      return [];
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return response.data.exercises.find((e: any) => {
      return e.exercise_plan_id === planId;
    });
  };

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
