import { Button } from "antd";
import React, { Dispatch, SetStateAction } from "react";
import { ExerciseData, statsType } from ".";

interface setDoneProps {
  stats: statsType;
  exercise?: ExerciseData;
  setSubPage: Dispatch<SetStateAction<"training" | "setDone" | "exerciseDone">>;
}

const SetDone: React.FC<setDoneProps> = ({ ...setDoneProps }) => {
  const { stats, exercise, setSubPage } = setDoneProps;

  return <Button onClick={() => setSubPage("training")}>Next Set</Button>;
};

export default SetDone;
