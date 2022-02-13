import { message, Progress, Spin } from "antd";
import React, {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import "../../styles/train.css";
import Translations from "../../localization/translations";
import { t } from "i18next";
import { LoadingOutlined } from "@ant-design/icons";
import { dataEntryType, ExerciseData, statsType } from ".";
import WebcamStreamCapture from "./components/webcamStreamCapture";
import api, { ApiSocketConnection } from "../../util/api";
import TrainLayout from "./components/trainLayout";

interface trainingProps {
  loadingExercise: boolean;
  error: boolean;
  exercise?: ExerciseData;
  stats: MutableRefObject<statsType>;
  setSubPage: Dispatch<SetStateAction<"training" | "setDone" | "exerciseDone">>;
  exercisePlanId?: string;
  initialCollapsed: MutableRefObject<boolean>;
}

interface Points {
  intensity: number;
  accuracy: number;
  speed: number;
  total: number;
}

const Training: React.FC<trainingProps> = ({ ...trainingProps }) => {
  const {
    loadingExercise,
    exercise,
    error,
    stats,
    setSubPage,
    exercisePlanId,
    initialCollapsed,
  } = trainingProps;

  const [debugExerciseRunning, setDebugExerciseRunning] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState<null | string>();
  const [progress, setProgress] = useState(0);

  const [active, setActive] = useState(false);

  const webSocketRef = useRef<ApiSocketConnection | null>(null);

  const [points, setPoints] = useState<Points[]>([]);

  const calculatePoints = (): dataEntryType[] => {
    const intensity = stats.current.data.reduce(
      (acc, curr) => acc + curr.performance,
      0
    );

    const accuracy = stats.current.data.reduce(
      (acc, curr) => acc + curr.performance,
      0
    );

    const speed = stats.current.data.reduce(
      (acc, curr) => acc + curr.performance,
      0
    );

    const pts: dataEntryType[] = [
      {
        type: "Intensity",
        set: stats.current.set.toString(),
        performance: intensity,
      },
      {
        type: "Accuracy",
        set: stats.current.set.toString(),
        performance: accuracy,
      },
      {
        type: "Speed",
        set: stats.current.set.toString(),
        performance: speed,
      },
    ];

    return pts;
  };

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

  const firstUpdate = useRef(true);

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
      console.log(message);

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
      }

      setTimeout(() => setCurrentFeedback(null), 2500);

      switch (message.message_type) {
        case "init":
          setProgress(
            ((message.data.current_set + 1) / (exercise?.sets || 1)) * 100
          );
          break;
        case "start_set":
          setActive(true);
          break;
        case "statistics":
          setPoints(
            points.concat({
              intensity: message.data.intensity,
              accuracy: message.data.cleanliness,
              speed: message.data.speed,
              total: 0,
            })
          );
          break;
        case "end_set":
          setActive(false);
          // setStats({ ...stats, set: message.data.current_set + 1 });
          setSubPage("setDone");
          break;
        case "exercise_complete":
          // setStats({
          //   ...stats,
          //   set: message.data.current_set + 1,
          //   data: stats.data.concat(calculatePoints()),
          // });
          setSubPage("exerciseDone");
          break;
      }
    };

    webSocket.onclose = function (closeEvent) {
      // if (!mounted) return;
      setTimeout(function () {
        console.warn("WebSocket closed! Trying to reconnect...");
        connectToWS();
      }, 1000);
    };
  }

  useEffect(() => {
    console.log("render :(");

    if (firstUpdate.current) {
      firstUpdate.current = false;
    } else {
      return;
    }

    let mounted = true;

    if (mounted && webSocketRef.current?.connected()) return;

    connectToWS().catch(message.error);

    return () => {
      mounted = false;
      webSocketRef.current?.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  });
  // TODO(someone): please someone get a better dep for this

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
            {(progress / 100) * (exercise?.sets || 1)}/{exercise?.sets}
          </div>
          <WebcamStreamCapture webSocketRef={webSocketRef} active={active}>
            {currentFeedback}
          </WebcamStreamCapture>
          <button onClick={debugExerciseNoVideo}>
            {debugExerciseRunning ? "End" : "Start"} Debug Exercise
          </button>
        </div>
      </div>
    </TrainLayout>
  );
};

export default Training;
