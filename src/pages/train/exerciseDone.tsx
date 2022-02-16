import { Tooltip } from "antd";
import { t } from "i18next";
import React, { MutableRefObject } from "react";
import { ExerciseData, statsType } from ".";
import Translations from "../../localization/translations";
import Graph from "../../shared/graph";
import { StarFilled } from "@ant-design/icons";

interface exerciseDoneProps {
  stats: MutableRefObject<statsType>;
  exercise?: ExerciseData;
}

const ExerciseDone: React.FC<exerciseDoneProps> = ({
  ...exerciseDoneProps
}) => {
  const { stats, exercise } = exerciseDoneProps;

  const totalPerf =
    stats.current.data.reduce((acc: number, set: dataEntryType) => {
      return acc + set.performance;
    }, 0) / stats.current.data.length;

  const medalType =
    totalPerf >= 90
      ? "gold"
      : totalPerf >= 75
      ? "silver"
      : totalPerf >= 50
      ? "bronze"
      : "none";

  const medalColor = {
    gold: "#f5c842",
    silver: "#c8c8c8",
    bronze: "#C17913",
    none: "#fff",
  };

  const medalDarkerColor = {
    gold: "#a8892d",
    silver: "#7b7b7b",
    bronze: "#74490b",
    none: "#ddd",
  };

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

      {medalType && (
        <Tooltip
          title={t(Translations.training.medal, {
            context: medalType === "none" ? null : medalType,
          })}
        >
          <div
            style={{
              width: "90px",
              height: "90px",
              borderRadius: "50%",
              background: medalColor[medalType],
              marginBottom: "30px",
              border: `10px solid ${medalDarkerColor[medalType]}`,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              opacity: medalType === "none" ? 0.2 : 1,
            }}
          >
            <StarFilled
              style={{ color: "black", opacity: 0.2, fontSize: 50 }}
            />
          </div>
        </Tooltip>
      )}
      <Graph
        data={stats.current.data}
        width={600}
        style={{ marginBottom: "40px" }}
      />
      <h1 style={{ color: "white", fontSize: "45px" }}>
        {t(Translations.training.score, {
          points: stats.current.totalPoints,
        })}
      </h1>
    </div>
  );
};

export default ExerciseDone;
