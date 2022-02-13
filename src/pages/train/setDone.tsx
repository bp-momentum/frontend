import React, { Dispatch, MutableRefObject, SetStateAction } from "react";
import { ExerciseData, statsType } from ".";
import TrainLayout from "./components/trainLayout";
import { Button, Col } from "antd";

interface setDoneProps {
  stats: MutableRefObject<statsType>;
  initialCollapsed: MutableRefObject<boolean>;
  exercise?: ExerciseData;
  setSubPage: Dispatch<SetStateAction<subPage>>;
}

const SetDone: React.FC<setDoneProps> = ({ ...setDoneProps }) => {
  const { stats, exercise, setSubPage, initialCollapsed } = setDoneProps;

  return (
    <TrainLayout
      loadingExercise={false}
      error={false}
      exercise={exercise}
      initialCollapsed={initialCollapsed}
    >
      <div>
        <Col>
          {stats.current.totalPoints}
          <Button onClick={() => setSubPage("training")}>Next Set</Button>
        </Col>
      </div>
    </TrainLayout>
  );
};

export default SetDone;
