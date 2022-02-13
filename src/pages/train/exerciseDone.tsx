import React, { MutableRefObject } from "react";
import { ExerciseData, statsType } from ".";
import Graph from "../../shared/graph";

interface exerciseDoneProps {
  stats: MutableRefObject<statsType>;
  exercise?: ExerciseData;
}

const ExerciseDone: React.FC<exerciseDoneProps> = ({
  ...exerciseDoneProps
}) => {
  const { stats, exercise } = exerciseDoneProps;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#466995",
      }}
    >
      <h1 style={{ color: "white", fontSize: "60px" }}>{exercise?.title}</h1>
      <Graph
        data={stats.current.data}
        width={600}
        style={{ marginBottom: "40px" }}
      />
      <h1 style={{ color: "white", fontSize: "45px" }}>
        Score: {stats.current.totalPoints}
      </h1>
    </div>
  );
};

export default ExerciseDone;
