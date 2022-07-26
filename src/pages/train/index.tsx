import React, { useEffect, useRef, useState } from "react";
import Container from "@shared/container";
import Routes from "@util/routes";
import "@styles/train.css";
import { useParams } from "react-router-dom";
import Training from "./training";
import SetDone from "./setDone";
import ExerciseDone from "./exerciseDone";
import { useGetExerciseByIdQuery } from "@redux/api/api";
import { message } from "antd";
import Translations from "@localization/translations";
import { t } from "i18next";
import useApi from "@hooks/api";
import { MedalType } from "@api/medal";

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
  const [medalType, setMedalType] = React.useState<MedalType>("none");

  const initialCollapsed = useRef(false);

  const stats = useRef<StatsType>({
    data: [],
    setAverages: [],
    totalPoints: 0,
    set: 0,
  });

  const [subPage, setSubPage] = useState<subPage>("training");
  const [cameraShown, setCameraShown] = useState(true);

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
        activated: true,
      });
    }

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, rawExercise.repeats_per_set, rawExercise.sets]);

  const leaveMessage =
    subPage !== "exerciseDone"
      ? t(Translations.common.confirmLeaveProgress)
      : false;

  return (
    <Container confirmLeaveMessage={leaveMessage}>
      {isLoading || !exercise ? (
        <div>Loading...</div>
      ) : (
        <>
          {subPage === "training" && (
            <Training
              exercise={exercise}
              setSubPage={setSubPage}
              setMedalType={setMedalType}
              stats={stats}
              initialCollapsed={initialCollapsed}
              setCameraShown={setCameraShown}
              cameraShown={cameraShown}
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
            <ExerciseDone
              stats={stats}
              exercise={exercise}
              medalType={medalType}
            />
          )}
        </>
      )}
    </Container>
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
