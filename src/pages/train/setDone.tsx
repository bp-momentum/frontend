import React, { Dispatch, SetStateAction } from "react";
import { ExerciseData, statsType } from ".";
import TrainLayout from "./components/trainLayout";
import { Button, Col } from "antd";

interface setDoneProps {
  stats: statsType;
  exercise?: ExerciseData;
  setSubPage: Dispatch<SetStateAction<"training" | "setDone" | "exerciseDone">>;
}

const SetDone: React.FC<setDoneProps> = ({ ...setDoneProps }) => {
  const { stats, exercise, setSubPage } = setDoneProps;

  return (
    <TrainLayout
      content={
        <div>
          <Col>
            {stats}
            <Button onClick={() => setSubPage("training")}>Next Set</Button>
          </Col>
        </div>
      }
      loadingExercise={false}
      error={false}
      exercise={exercise}
    />
  );
};

export default SetDone;
