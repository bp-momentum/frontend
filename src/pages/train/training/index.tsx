import { message, Progress, Spin } from "antd";
import React, {
  createRef,
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import "../../../styles/train.css";
import Translations from "../../../localization/translations";
import { t } from "i18next";
import { LoadingOutlined } from "@ant-design/icons";
import { ExerciseData, statsType } from "..";
import WebcamStreamCapture from "../components/webcamStreamCapture";
import api, { ApiSocketConnection } from "../../../util/api";
import TrainLayout from "../components/trainLayout";
import {
  doneCallback,
  endCallback,
  initCallback,
  statsCallback,
} from "./callbacks";

interface trainingProps {
  loadingExercise: boolean;
  error: boolean;
  exercise?: ExerciseData;
  stats: MutableRefObject<statsType>;
  setSubPage: Dispatch<SetStateAction<subPage>>;
  exercisePlanId?: string;
  initialCollapsed: MutableRefObject<boolean>;
}

const Training: React.FC<trainingProps> = ({ ...trainingProps }) => {
  // deconstruct props
  const {
    loadingExercise,
    exercise,
    error,
    stats,
    setSubPage,
    exercisePlanId,
    initialCollapsed,
  } = trainingProps;

  // TODO replace this
  const [currentFeedback, setCurrentFeedback] = useState<null | string>();

  // repeats done per repeats to do in percent
  const [progress, setProgress] = useState(0);

  // whether sending video to server
  const [active, setActive] = useState(false);

  const webSocketRef = useRef<ApiSocketConnection | null>(null);

  const currentRepeat = useRef(0);

  const [feedback, setFeedback] = useState<feedback>({
    x: -100,
    y: -100,
    addedPoints: 0,
    totalPoints: 0,
  });

  const totalPoints = useRef(0);

  useEffect(() => {
    totalPoints.current = feedback.totalPoints;
  }, [feedback.totalPoints]);

  // used to cache points per exercise
  const points = useRef<Points[]>([]);

  const getFeedback = useCallback(() => feedback, [feedback]);

  async function connectToWS() {
    webSocketRef.current = await api.openSocket();

    const webSocket = webSocketRef.current as ApiSocketConnection;

    webSocket.onopen = () => {
      webSocket.send(
        JSON.stringify({
          message_type: "init",
          data: { exercise: exercisePlanId },
        })
      );
    };

    webSocket.onmessage = (message) => {
      if (!message || !message?.success) return;

      if (message.message_type === "statistics") {
        setCurrentFeedback(
          "Points: " +
            message.data.intensity +
            " / " +
            message.data.speed +
            " / " +
            message.data.cleanliness +
            "!"
        );
        setTimeout(() => setCurrentFeedback(null), 2500);
      }

      switch (message.message_type) {
        case "init":
          initCallback(message.data, stats.current);
          break;
        case "start_set":
          setActive(true);
          break;
        case "statistics":
          statsCallback(
            message.data,
            points.current,
            setProgress,
            exercise?.repeatsPerSet || 1,
            currentRepeat,
            setFeedback,
            totalPoints
          );
          break;
        case "end_set":
          endCallback(stats.current, setActive, setSubPage, points.current);
          break;
        case "exercise_complete":
          doneCallback(stats.current, setActive, setSubPage, points.current);
          break;
      }
    };

    webSocket.onclose = function () {
      setTimeout(function () {
        console.warn("WebSocket closed! Trying to reconnect...");
        connectToWS();
      }, 1000);
    };
  }

  // start websocket connection on mount and disconnect on unmount
  useEffect(() => {
    connectToWS().catch(message.error);

    return () => {
      if (webSocketRef.current) webSocketRef.current.onclose = null;
      webSocketRef.current?.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ptsRef = createRef<HTMLSpanElement>();

  useEffect(() => {
    if (!ptsRef.current) return;
    ptsRef.current.style.fontSize = "2.2rem";
    setTimeout(() => {
      if (!ptsRef.current) return;
      ptsRef.current.style.fontSize = "2rem";
    }, 100);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feedback.totalPoints]);

  return (
    <TrainLayout
      loadingExercise={loadingExercise}
      error={error}
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
          {loadingExercise || error ? (
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
            <h1 style={{ color: "white", fontSize: "40px" }}>
              {exercise?.title}
            </h1>
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
            {stats.current.set}/{exercise?.sets}
          </div>
          <WebcamStreamCapture webSocketRef={webSocketRef} active={active}>
            <div
              style={{
                position: "relative",
                height: "45px",
                display: "flex",
                color: "#466995",
                fontWeight: "bold",
                textShadow:
                  "-1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff",
                alignItems: "flex-end",
              }}
            >
              <span
                style={{
                  fontSize: "2rem",
                }}
              >
                Pts:&nbsp;
              </span>
              <span
                ref={ptsRef}
                style={{
                  transition: "font-size 0.1s ease-in-out",
                  fontSize: "2rem",
                }}
              >
                {feedback.totalPoints}
              </span>
            </div>
            {currentFeedback && (
              <>
                <span
                  style={{
                    position: "absolute",
                    left: feedback?.x,
                    top: feedback?.y,
                    color: "#466995",
                    textShadow:
                      "-1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff",
                    transform: "translate(-50%, -50%)",
                    fontSize: "1.5rem",
                  }}
                >
                  +{feedback.addedPoints}
                </span>
              </>
            )}
          </WebcamStreamCapture>
        </div>
      </div>
    </TrainLayout>
  );
};

export default Training;
