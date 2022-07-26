import React from "react";
import { Tooltip } from "antd";
import Translations from "@localization/translations";
import { t } from "i18next";
import "@styles/home.css";
import { useNavigate } from "react-router-dom";
import { useGetExerciseByIdQuery } from "@redux/api/api";

interface Props {
  exercise: Exercise;
  today: boolean;
}

/**
 * Exercise card component for the home page
 * @param {Props} props The props for the component.
 * @returns {JSX.Element} The component.
 */
const ExerciseCard: React.FC<Props> = ({
  exercise,
  today,
}: Props): JSX.Element => {
  const { data, isLoading, isError, error } = useGetExerciseByIdQuery(
    exercise.id
  );
  const navigate = useNavigate();

  const openExercise = (exercise: Exercise): void => {
    navigate(`/train/${exercise.exercise_plan_id}`);
  };

  return (
    <div
      className={`ExerciseCard ${exercise.done || !today ? "done" : ""}`}
      style={{
        display: "flex",
        alignItems: "center",
        border: "1px solid black",
        padding: "10px 20px",
        borderRadius: "50px",
        width: "100%",
        background: exercise.done ? "#5ec77b" : "initial",
        cursor: exercise.done || !today ? "default" : "pointer",
        margin: "5px",
      }}
      onClick={() => {
        if (today && !exercise.done) openExercise(exercise);
      }}
    >
      <h4 style={{ margin: "0" }}>
        {isLoading
          ? t(Translations.exercises.loading)
          : isError
          ? error
          : data?.title}
      </h4>
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
            margin: "0 0 0 auto",
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

export default ExerciseCard;
