import { Button, Layout, Progress, Spin } from "antd";
import { Content } from "antd/lib/layout/layout";
import React, { useEffect, useState } from "react";
import Container from "../shared/container";
import api from "../util/api";
import { ApiSocketConnection } from "../util/api";
import Routes from "../util/routes";
import "../styles/train.css";
import { useParams } from "react-router-dom";
import Translations from "../localization/translations";
import { t } from "i18next";
import { LoadingOutlined } from "@ant-design/icons";
import Webcam from "react-webcam";
import Paper from "../shared/paper";

const { Sider } = Layout;

interface ExerciseData {
  title: string;
  description: string;
  sets: number;
  repeatsPerSet: number;
  videoPath: string | null;
  activated: boolean;
}

const WebcamStreamCapture = (props: {
  ws: React.RefObject<ApiSocketConnection>;
}) => {
  const webcamRef = React.useRef<Webcam>(null);
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const [capturing, setCapturing] = React.useState(false);
  const [recordedChunks, setRecordedChunks] = React.useState([]);

  const webSocketRef = props.ws;

  const sendChunks = React.useCallback(
    (data: Blob): void => {
      webSocketRef.current?.send(data);
    },
    [webSocketRef]
  );

  const handleDataAvailable = React.useCallback(
    ({ data }) => {
      if (data.size > 0) {
        setRecordedChunks((prev) => prev.concat(data));
        sendChunks(data);
      }
    },
    [sendChunks]
  );

  const handleStartCaptureClick = React.useCallback(() => {
    if (!webcamRef.current?.stream?.active || !webSocketRef.current) return;
    setCapturing(true);

    webSocketRef.current?.send(
      JSON.stringify({
        message_type: "start_set",
        data: { user_token: "", exercise_id: 1 },
      })
    );

    mediaRecorderRef.current = new MediaRecorder(
      webcamRef.current.stream as MediaStream,
      {
        mimeType: "video/webm",
      }
    );
    mediaRecorderRef.current.addEventListener(
      "dataavailable",
      handleDataAvailable
    );
    // data available every 100 milliseconds
    mediaRecorderRef.current.start(100);
  }, [webSocketRef, handleDataAvailable]);

  const handleStopCaptureClick = React.useCallback(() => {
    mediaRecorderRef.current?.stop();
    setCapturing(false);
    const mediaRecorder = mediaRecorderRef.current as MediaRecorder;
    mediaRecorder.onstop = () =>
      webSocketRef.current?.send(
        JSON.stringify({ message_type: "end_set", data: {} })
      );
  }, [webSocketRef]);

  const handleDownload = React.useCallback(() => {
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, {
        type: "video/webm",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      document.body.appendChild(a);
      a.href = url;
      a.download = "react-webcam-stream-capture.webm";
      a.click();
      window.URL.revokeObjectURL(url);
      setRecordedChunks([]);
    }
  }, [recordedChunks]);

  const videoConstraints: MediaTrackConstraints = {
    width: { max: (16 * window.innerWidth) / 35 },
    height: { max: (9 * window.innerWidth) / 35 },
    // resizeMode: "crop-and-scale",
    //    -> https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints#properties_of_video_tracks why no work?
    //   => This does work tho?..
  };

  return (
    <div style={{ position: "relative", maxWidth: "80%", maxHeight: "80%" }}>
      <Webcam
        audio={false}
        ref={webcamRef}
        mirrored
        style={{ border: "1px solid red" }}
        videoConstraints={videoConstraints}
      />
      <button
        onClick={capturing ? handleStopCaptureClick : handleStartCaptureClick}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        {capturing ? "Stop" : "Start"} Capture
      </button>
    </div>
  );
};

const Train = () => {
  const [exercise, setExercise] = React.useState<ExerciseData>();
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [progress /*, setProgress*/] = useState(10);
  const [currentFeedback, setCurrentFeedback] = useState<null | string>();

  // exercisePlanId from the url
  const { exercisePlanId } = useParams();

  const webSocketRef = React.useRef<ApiSocketConnection | null>(null);

  const [debugExerciseRunning, setDebugExerciseRunning] = useState(false);

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
    let isMounted = true;

    if (!loading) return;

    api.execute(Routes.getDoneExercises()).then((response) => {
      if (!isMounted) return;
      if (!response.success) {
        setError(true);
      }
      const exerciseData = response.data.exercises.find((e: any) => {
        return e.exercise_plan_id === parseInt(exercisePlanId ?? "");
      });
      if (exerciseData)
        api
          .execute(Routes.getExercise({ id: exerciseData.id }))
          .then((response) => {
            setExercise({
              title: response.data.title,
              description: response.data.description,
              sets: exerciseData.sets,
              repeatsPerSet: exerciseData.repeats_per_set,
              videoPath:
                response.data.video ??
                "https://vid.pr0gramm.com/2021/12/28/130aaef3ab9c207a.mp4",
              activated: response.data.title,
            });
          });
      else setError(true);
      setLoading(false);
    });

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

    return () => {
      // clean up
      isMounted = false;
    };
  }, [loading, exercisePlanId]);

  return (
    <Container>
      <Layout style={{ height: "100%" }}>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={() => setCollapsed(!collapsed)}
          width={collapsed ? "50px" : "500px"}
          style={{
            height: "calc(100% - 48px)",
            background: "#466995",
            overflow: "hidden",
          }}
        >
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
            Instructions
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
                    Instructions
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
        </Sider>
        <Content
          className="shadow"
          style={{ background: "#466995", overflow: "hidden", padding: "20px" }}
        >
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
        </Content>
      </Layout>
    </Container>
  );
};

export default Train;
