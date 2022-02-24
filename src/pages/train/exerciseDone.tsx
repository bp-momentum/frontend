import { Tooltip } from "antd";
import { t } from "i18next";
import React, { MutableRefObject } from "react";
import Translations from "../../localization/translations";
import Graph from "../../shared/graph";
import { StarFilled } from "@ant-design/icons";
import continue_arrow from "../../static/continue_arrow.png";
import { useNavigate } from "react-router-dom";

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
        <div style={{ width: 1100, height: 185 }}></div>
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
