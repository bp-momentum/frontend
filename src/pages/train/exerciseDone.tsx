import React from "react";

interface exerciseDoneProps {
  stats: any;
}

const ExerciseDone: React.FC<exerciseDoneProps> = ({
  ...exerciseDoneProps
}) => {
  const { stats } = exerciseDoneProps;

  return <></>;
};

export default ExerciseDone;
