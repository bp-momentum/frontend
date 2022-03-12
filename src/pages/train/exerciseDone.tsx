import { t } from "i18next";
import React, { MutableRefObject } from "react";
import Translations from "@localization/translations";
import Graph from "@shared/graph";
import continue_arrow from "@static/continue_arrow.png";
import { useNavigate } from "react-router-dom";
import Medal from "@shared/medal";

interface exerciseDoneProps {
  stats: MutableRefObject<statsType>;
  exercise?: ExerciseData;
}

const ExerciseDone: React.FC<exerciseDoneProps> = ({ ...props }) => {
  const { stats, exercise } = props;

  const navigate = useNavigate();

  const goHome = (): void => {
    navigate("/");
  };

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

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#466995",
      }}
    >
      <h1 style={{ color: "white", fontSize: "60px" }}>{exercise?.title}</h1>

      {medalType && (
        <Medal
          size="large"
          type={medalType}
          tooltipText={t(Translations.training.medal, {
            context: medalType === "none" ? null : medalType,
          })}
        />
      )}
      <div
        style={{
          position: "relative",
          display: "flex",
          flexWrap: "wrap",
          flexDirection: "row-reverse",
          justifyContent: "center",
          marginBottom: 30,
          minHeight: "230px",
          width: "100%",
          overflow: "hidden",
        }}
      >
        <div style={{ width: 1100, height: 185 }} />
        <div style={{ width: 100, margin: "55px 20px" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              cursor: "pointer",
            }}
            onClick={goHome}
          >
            <img
              src={continue_arrow}
              alt="Continue"
              width="100px"
              style={{ transform: "rotate(180deg)" }}
            />
            <span
              style={{ marginTop: 10, color: "white", textAlign: "center" }}
            >
              {t(Translations.training.backHome)}
            </span>
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            height: 200,
            top: 0,
            left: "50%",
            display: "flex",
            justifyContent: "center",
            transform: "translateX(-50%)",
          }}
        >
          <Graph
            data={stats.current.data}
            width={600}
            style={{ marginLeft: -31 }}
          />
        </div>
      </div>
      <h1 style={{ color: "white", fontSize: "45px", marginTop: -50 }}>
        {t(Translations.training.score, {
          points: stats.current.totalPoints,
        })}
      </h1>
    </div>
  );
};

export default ExerciseDone;
