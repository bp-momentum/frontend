import { Spin } from "antd";
import React from "react";
import { LoadingOutlined } from "@ant-design/icons";
import Translations from "../../../localization/translations";
import { t } from "i18next";
import Paper from "../../../shared/paper";
import { ExerciseData } from "..";

interface trainSiderProps {
  loading: boolean;
  error: boolean;
  collapsed: boolean;
  exercise?: ExerciseData;
}

const TrainSider: React.FC<trainSiderProps> = ({ ...trainSiderProps }) => {
  const { loading, exercise, collapsed, error } = trainSiderProps;

  return (
    <>
      <div
        style={{
          position: "absolute",
          transform: collapsed
            ? "translate(-50%, -50%) rotate(-90deg)"
            : "translate(-50%, -50%) rotate(-90deg)",
          top: "50%",
          left: collapsed ? "50%" : "-50%",
          fontSize: "30px",
          color: "white",
          transition: "all 0.2s ease-in-out",
          overflow: "hidden",
        }}
      >
        {t(Translations.training.instructions)}
      </div>
      <div
        style={{
          position: "absolute",
          width: "100%",
          color: "white",
          top: collapsed ? "100%" : "0px",
          transition: "all 0.2s ease-in-out",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          overflowY: "auto",
          overflowX: "hidden",
          height: "100%",
          padding: "40px 0",
        }}
      >
        {loading || error ? (
          <div
            style={{
              height: "100%",
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            {error ? (
              <div>{t(Translations.planManager.error)}</div>
            ) : (
              <>
                <Spin
                  indicator={
                    <LoadingOutlined
                      style={{ fontSize: 24, color: "white" }}
                      spin
                    />
                  }
                />
                <div>{t(Translations.planManager.loading)}</div>
              </>
            )}
          </div>
        ) : (
          <Paper
            padding={60}
            backdropColor="#466995"
            lineColor="#A1C7DA"
            totalWidth={500}
            title={
              <span style={{ fontSize: "40px", lineHeight: "47.145px" }}>
                {t(Translations.training.instructions)}
              </span>
            }
          >
            {exercise?.description || ""}
          </Paper>
        )}

        {exercise?.videoPath && (
          <video
            src={exercise.videoPath}
            controls
            style={{
              marginTop: "80px",
              fontSize: "20px",
              fontWeight: "bold",
              width: "80%",
              background: "white",
            }}
          />
        )}
      </div>
    </>
  );
};

export default TrainSider;
