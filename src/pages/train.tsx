import { Layout, Progress, Spin } from "antd";
import { Content } from "antd/lib/layout/layout";
import React, { useEffect, useState } from "react";
import Container from "../shared/container";
import api from "../util/api";
import Routes from "../util/routes";
import "../styles/train.css";
import { useParams } from "react-router-dom";
import Translations from "../localization/translations";
import { t } from "i18next";
import { LoadingOutlined } from "@ant-design/icons";
import Webcam from "react-webcam";
import { waitFor } from "@testing-library/react";

const { Sider } = Layout;

interface ExerciseData {
  title: string;
  description: string;
  videoPath: string | null;
  activated: boolean;
}

const WebcamStreamCapture = (props: { ws: React.RefObject<WebSocket> }) => {
  const webcamRef = React.useRef<Webcam>(null);
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const [capturing, setCapturing] = React.useState(false);
  const [recordedChunks, setRecordedChunks] = React.useState([]);

  const webSocketRef = props.ws;

  const sendChunks = React.useCallback(
    (data: Blob): void => {
      webSocketRef.current?.send(data);
      // console.log("Sent BLOB to webSocket");
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
      // a.style = "display: none";
      a.href = url;
      a.download = "react-webcam-stream-capture.webm";
      a.click();
      window.URL.revokeObjectURL(url);
      setRecordedChunks([]);
    }
  }, [recordedChunks]);

  return (
    <>
      {capturing ? (
        <button onClick={handleStopCaptureClick}>Stop Capture</button>
      ) : (
        <button onClick={handleStartCaptureClick}>Start Capture</button>
      )}
      {recordedChunks.length > 0 && (
        <button onClick={handleDownload}>Download</button>
      )}
      <Webcam audio={false} ref={webcamRef} mirrored />
    </>
  );
};

const Train = () => {
  const [exercise, setExercise] = React.useState<ExerciseData>();
  const [collapsed, setCollapsed] = useState(false);
  // 0: not yet loading, 1: currently fetching data from api, 2: finished loading
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [progress /*, setProgress*/] = useState(10);

  // exerciseId from the url
  const { exerciseId } = useParams();

  const webSocketRef = React.useRef<WebSocket | null>(null);

  useEffect(() => {
    let isMounted = true;

    if (!loading) return;

    api
      .execute(Routes.getExercise({ id: exerciseId ?? "" }))
      .then((response) => {
        if (!isMounted) return;
        if (!response.success) {
          setError(true);
        }
        setExercise({
          title: response.data.title,
          description: response.data.description,
          videoPath:
            response.data.videoPath ??
            "https://vid.pr0gramm.com/2021/12/28/130aaef3ab9c207a.mp4",
          activated: response.data.title,
        });
        setLoading(false);
      });

    connectToWS();

    function connectToWS() {
      webSocketRef.current = api.openSocket();

      const webSocket = webSocketRef.current as WebSocket;

      webSocket.onmessage = function (event) {
        console.log(event.data);
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
  }, [loading, exerciseId]);

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
              paddingTop: "90px",
              height: "100%",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                transform: collapsed
                  ? "translate(-50%, -50%) rotate(-90deg)"
                  : "translate(-50%, -50%) rotate(0deg)",
                top: collapsed ? "50%" : "40px",
                left: "50%",
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
                top: collapsed ? "100%" : "90px",
                transition: "all 0.2s ease-in-out",
                transitionDelay: collapsed ? "0s" : "0.05s",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                overflow: "hidden",
              }}
            >
              {loading ? (
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
                exercise && exercise.description
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
            {loading ? (
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
                Squat Exercise
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
            <div style={{ color: "white", marginTop: "10px" }}>10/10</div>
            <WebcamStreamCapture ws={webSocketRef} />
          </div>
        </Content>
      </Layout>
    </Container>
  );
};

export default Train;
