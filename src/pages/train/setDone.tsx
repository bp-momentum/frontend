import React from "react";
import { ExerciseData, statsType } from ".";

interface setDoneProps {
  stats: statsType;
  exercise?: ExerciseData;
}

const SetDone: React.FC<setDoneProps> = ({ ...setDoneProps }) => {
  const { stats, exercise } = setDoneProps;

  return <></>;
};

export default SetDone;
