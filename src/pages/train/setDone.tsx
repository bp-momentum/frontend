import React, {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { ExerciseData, statsType } from ".";
import TrainLayout from "./components/trainLayout";
import { Button, Row } from "antd";
import Paper from "../../shared/paper";

interface setDoneProps {
  stats: MutableRefObject<statsType>;
  initialCollapsed: MutableRefObject<boolean>;
  exercise?: ExerciseData;
  setSubPage: Dispatch<SetStateAction<subPage>>;
}

const SetDone: React.FC<setDoneProps> = ({ ...setDoneProps }) => {
  const { stats, exercise, setSubPage, initialCollapsed } = setDoneProps;
  const [remainingSeconds, setRemainingSeconds] = useState<number>(30);

  useEffect(() => {
    if (remainingSeconds === 0) {
      setSubPage("training");
      return;
    }
    setTimeout(() => {
      setRemainingSeconds(remainingSeconds - 1);
    }, 1000);
  });

  return (
    <TrainLayout
      loadingExercise={false}
      error={false}
      exercise={exercise}
      initialCollapsed={initialCollapsed}
    >
      <div
        style={{
          overflowY: "auto",
          padding: "20px",
          height: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            overflowY: "auto",
          }}
        >
          <h1 style={{ color: "white", fontSize: "70px" }}>
            {exercise?.title}
          </h1>
          <h3 style={{ color: "white", fontSize: "24px" }}>
            Next set starts in: {remainingSeconds}s
          </h3>
          <Paper
            title={
              <span style={{ fontSize: "40px", lineHeight: "47.145px" }}>
                TODO
              </span>
            }
            padding={60}
            backdropColor="#466995"
            lineColor="#A1C7DA"
            totalWidth={500}
          >
            <div>
              {Array.from(Array(exercise?.sets ?? 0).keys()).map((set) => (
                <Row key={set} justify="space-between">
                  <>
                    Set {set + 1}
                    <br />
                  </>
                </Row>
              ))}
            </div>
          </Paper>
          {stats.current.totalPoints}
          <Button onClick={() => setSubPage("training")}>Next Set</Button>
        </div>
      </div>
    </TrainLayout>
  );
};

export default SetDone;
