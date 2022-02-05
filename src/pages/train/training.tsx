import { Progress, Spin } from "antd";
import React, { useEffect, useState } from "react";
import "../../styles/train.css";
import Translations from "../../localization/translations";
import { t } from "i18next";
import { LoadingOutlined } from "@ant-design/icons";
import { ExerciseData } from ".";
import WebcamStreamCapture from "./components/webcamStreamCapture";
import api, { ApiSocketConnection } from "../../util/api";

interface trainingProps {
  loading: boolean;
  error: boolean;
  exercise?: ExerciseData;
}

const Training: React.FC<trainingProps> = ({ ...trainingProps }) => {
  const { loading, exercise, error } = trainingProps;

  const [debugExerciseRunning, setDebugExerciseRunning] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState<null | string>();
  const [progress /*, setProgress*/] = useState(10);

  const webSocketRef = React.useRef<ApiSocketConnection | null>(null);

  const debugExerciseNoVideo = () => {
    if (!debugExerciseRunning) {
      webSocketRef.current?.send(
        JSON.stringify({
          message_type: "start_set",
          data: { user_token: "", exercise_id: 1 },
        })
      );
    } else {
      webSocketRef.current?.send(
        JSON.stringify({ message_type: "end_set", data: {} })
      );
    }
    setDebugExerciseRunning(!debugExerciseRunning);
  };

  useEffect(() => {
    if (!loading) return;

    connectToWS();

    function connectToWS() {
      webSocketRef.current = api.openSocket();

      const webSocket = webSocketRef.current as ApiSocketConnection;

      webSocket.onmessage = (message) => {
        console.log(message);
        if (message?.success) {
          setCurrentFeedback(
            "Points: " +
              message.data.intensity +
              " / " +
              message.data.speed +
              " / " +
              message.data.cleanliness +
              "!"
          );
        }

        setTimeout(() => setCurrentFeedback(null), 2500);
      };

      webSocket.onclose = function (closeEvent) {
        setTimeout(function () {
          console.warn("WebSocket closed! Trying to reconnect...");
          connectToWS();
        }, 1000);
      };
    }
  }, [loading]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
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
              <div style={{ color: "white" }}>
                {t(Translations.planManager.loading)}
              </div>
            </>
          )}
        </div>
      ) : (
        <h1 style={{ color: "white", fontSize: "40px" }}>{exercise?.title}</h1>
      )}
      <div
        style={{
          width: "200px",
        }}
      >
        <Progress
          percent={progress}
          status="active"
          showInfo={false}
          strokeColor={"#0ff"}
          className="training-progress"
        />
      </div>
      <div style={{ color: "white", marginTop: "10px" }}>
        0/{exercise?.sets}
      </div>
      <div style={{ position: "relative" }}>
        <WebcamStreamCapture ws={webSocketRef} />
        {currentFeedback && (
          <span
            className="feedback"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "white",
              borderRadius: "5px",
              padding: "10px",
              width: "max-content",
              textAlign: "center",
            }}
          >
            {currentFeedback}
          </span>
        )}
      </div>
      <button onClick={debugExerciseNoVideo}>
        {debugExerciseRunning ? "End" : "Start"} Debug Exercise
      </button>
    </div>
  );
};

export default Training;
