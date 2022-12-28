import React, {
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import useWindowDimensions from "@hooks/windowDimension";
import { PlayCircleOutlined } from "@ant-design/icons";
import { Button, message, Progress } from "antd";
import { Camera } from "@mediapipe/camera_utils";
import {
  NormalizedLandmarkList,
  Pose,
  POSE_CONNECTIONS,
} from "@mediapipe/pose";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import useApi, { ApiSocketConnection } from "@hooks/api";
import { useAppDispatch } from "@redux/hooks";
import {
  resetTrainingPoints,
  setInformation,
  setLatestTrainingPoints,
  setSet,
} from "@redux/training/trainingSlice";
import { useParams } from "react-router-dom";
import { MdVideocam, MdVideocamOff } from "react-icons/md";

interface Props {
  exercise: ExerciseData;
  onFinishSet: () => void;
}

/**
 * The webcam stream capture component.
 * @param {Props} props The properties of the component.
 * @returns {JSX.Element} The component.
 */
const VideoElement: React.FC<Props> = ({
  exercise,
  onFinishSet,
}: Props): JSX.Element => {
  // CUSTOM HOOKS
  const { height } = useWindowDimensions();

  // STATES
  const [cameraShown, setCameraShown] = useState(true);
  const [countdown, setCountdown] = useState(-1);
  const [started, setStarted] = useState(false);

  // REFS
  const capturing = useRef(false);
  const progress = useRef(0);
  const currentPose = useRef<NormalizedLandmarkList>();

  const estimationCanvasRef = useRef<HTMLCanvasElement>(null);
  const expectedCanvasRef = useRef<HTMLCanvasElement>(null);

  // REDUX STUFF
  const dispatch = useAppDispatch();

  // --------------------------
  // WEBSOCKET CONNECTION START
  // --------------------------
  const webSocketRef = useRef<ApiSocketConnection>();

  useEffect(() => {
    // start websocket connection on mount and disconnect on unmount
    connectToWS().catch(message.error);

    return () => {
      if (webSocketRef.current) webSocketRef.current.onclose = null;
      webSocketRef.current?.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { exercisePlanId } = useParams();

  const api = useApi();

  async function connectToWS() {
    webSocketRef.current = api.openSocket();

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

      switch (message.message_type) {
        case "init":
          dispatch(resetTrainingPoints());
          dispatch(setSet(message.data.current_set));
          break;
        case "statistics":
          dispatch(
            setLatestTrainingPoints({
              accuracy: message.data.cleanliness,
              intensity: message.data.intensity,
              speed: message.data.speed,
            })
          );
          break;
        case "information":
          dispatch(setInformation(message.data.information));
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

  const sendImage = useCallback(
    async (video: HTMLVideoElement) => {
      if (!capturing.current) return;
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");
      if (!context) return;
      context.drawImage(video, 0, 0);
      const image = canvas.toDataURL("image/jpeg");
      const utf8Encode = new TextEncoder();
      webSocketRef.current?.send(utf8Encode.encode(image));
    },
    [webSocketRef]
  );
  // ------------------------
  // WEBSOCKET CONNECTION END
  // ------------------------

  // -------------------------
  // EXPECTATION OVERLAY START
  // -------------------------
  const comparePosition = useCallback(
    (
      actualLandmarks: NormalizedLandmarkList,
      expectedLandmarks: NormalizedLandmarkList
    ) => {
      if (!actualLandmarks || !expectedLandmarks) return;
      let sum = 0;
      for (let i = 0; i < actualLandmarks.length; i++) {
        const actual = actualLandmarks[i];
        const expected = expectedLandmarks[i];
        // get the normalized 2D position of the landmarks
        sum += Math.sqrt(
          Math.pow(actual.x - expected.x, 2) +
            Math.pow(actual.y - expected.y, 2)
        );
      }
      return sum / actualLandmarks.length;
    },
    []
  );

  const startSet = async () => {
    setStarted(true);
    // Wait for player to be positioned correctly
    // Show first frame of expectation
    onResults(exercise.expectation[0], expectedCanvasRef, true);

    // check every .1 seconds if currentPose is close enough to expectation
    // eslint-disable-next-line no-constant-condition
    while (true) {
      if (!currentPose.current) continue;
      const distance =
        comparePosition(currentPose.current, exercise.expectation[0]) || 1;
      // TODO: this value may need to be adjusted (it is good enough for now)
      if (distance < 0.05) break;
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    for (let i = 3; i > 0; i--) {
      setCountdown(i);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    setCountdown(0);

    webSocketRef.current?.send(
      JSON.stringify({
        message_type: "start_set",
        data: { user_token: "", exercise_id: 1 },
      })
    );
    capturing.current = true;
    for (let i = 0; i < exercise.repeatsPerSet; i++) {
      for (let j = 0; j < exercise.expectation.length; j++) {
        // draw landmarks on canvas
        onResults(exercise.expectation[j], expectedCanvasRef, true);
        // wait for 1/10th of a second
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }
    capturing.current = false;
    webSocketRef.current?.send(
      JSON.stringify({
        message_type: "end_set",
        data: { user_token: "", exercise_id: 1 },
      })
    );
    onFinishSet();
  };
  // -----------------------
  // EXPECTATION OVERLAY END
  // -----------------------

  // -----------------------------
  // GENERAL MEDIAPIPE STUFF START
  // -----------------------------
  const onResults = useCallback(
    (
      landmarks: NormalizedLandmarkList,
      canvasRef: RefObject<HTMLCanvasElement>,
      isExpected: boolean
    ) => {
      if (!landmarks || !canvasRef.current) return;
      const canvasCtx = canvasRef.current.getContext("2d");
      if (!canvasCtx) return;
      canvasCtx.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
      drawConnectors(canvasCtx, landmarks, POSE_CONNECTIONS, {
        color: isExpected ? "#ff9900" : "#00FF00",
        lineWidth: 4,
      });
      drawLandmarks(canvasCtx, landmarks, {
        color: isExpected ? "#0000" : "#FF0000",
        lineWidth: 2,
      });

      if (!isExpected) {
        currentPose.current = landmarks;
      }
    },
    []
  );
  // ---------------------------
  // GENERAL MEDIAPIPE STUFF END
  // ---------------------------

  // -------------------------------
  // MEDIAPIPE POSE ESTIMATION START
  // -------------------------------
  const [pose, setPose] = useState<Pose>();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const pose = new Pose({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
      },
    });
    pose.setOptions({
      modelComplexity: 0,
      smoothLandmarks: true,
      enableSegmentation: true,
      smoothSegmentation: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });
    pose.onResults((result) =>
      onResults(result.poseLandmarks, estimationCanvasRef, false)
    );
    setPose(pose);
    return () => {
      console.log("Cleaning up");
      pose.close();
    };
  }, [onResults]);

  useEffect(() => {
    if (!videoRef.current) return;
    const camera = new Camera(videoRef?.current, {
      onFrame: async () => {
        if (!videoRef.current) return;
        sendImage(videoRef.current);
        await pose?.send({ image: videoRef.current });
      },
      width: 4096,
      height: 2160,
    });
    camera.start();
    return () => {
      console.log("Stopping camera");
      camera.stop();
    };
  }, [videoRef, pose, sendImage]);

  // set the correct size attribute for the canvas
  // even though it is positioned with css,
  // mediapipe needs the width and height attributes for some unholy reason
  useEffect(() => {
    if (!videoRef.current || !estimationCanvasRef.current) return;
    const obs = new ResizeObserver(() => {
      estimationCanvasRef.current?.setAttribute(
        "width",
        `${videoRef.current?.clientWidth}`
      );
      estimationCanvasRef.current?.setAttribute(
        "height",
        `${videoRef.current?.clientHeight}`
      );
      expectedCanvasRef.current?.setAttribute(
        "width",
        `${videoRef.current?.clientWidth}`
      );
      expectedCanvasRef.current?.setAttribute(
        "height",
        `${videoRef.current?.clientHeight}`
      );
    });
    obs.observe(videoRef.current as Element);
  }, [videoRef, estimationCanvasRef]);
  // -----------------------------
  // MEDIAPIPE POSE ESTIMATION END
  // -----------------------------

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        margin: "0 50px",
        minWidth: "300px",
      }}
    >
      {/* WEBCAM */}
      <video
        ref={videoRef}
        style={{
          width: "100%",
          height: "100%",
          maxWidth: "100%",
          maxHeight: Math.max(height - 167 - 80, 200),
          objectFit: "cover",
          borderRadius: "5px",
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.5)",
        }}
      />
      {/* OVERLAY */}
      <div
        style={{
          position: "absolute",
          maxWidth: "100%",
          maxHeight: Math.max(height - 167 - 80, 200),
          width: "100%",
          height: "100%",
          backdropFilter: !cameraShown ? "blur(50px)" : "none",
          WebkitBackdropFilter: !cameraShown ? "blur(50px)" : "none",
          borderRadius: "5px",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            top: 0,
          }}
        >
          {/* MEDIAPIPE EXPECTED POSE */}
          <canvas
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
            }}
            ref={expectedCanvasRef}
          ></canvas>
          {/* MEDIAPIPE ACTUAL POSE ESTIMATION */}
          <canvas
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
            }}
            ref={estimationCanvasRef}
          ></canvas>
          {/* TODO: SHOW POINTS */}
          {/* CAMERA TOGGLE */}
          <div
            onClick={() => setCameraShown(!cameraShown)}
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              backgroundColor: "white",
              padding: "5px",
              cursor: "pointer",
            }}
          >
            {cameraShown ? (
              <MdVideocam color="black" size="40px" />
            ) : (
              <MdVideocamOff color="red" size="40px" />
            )}
          </div>
          {/* INTRA SET PROGRESS */}
          <div
            style={{
              position: "absolute",
              bottom: "-10px",
              width: "100%",
            }}
          >
            <Progress
              percent={progress.current}
              status="active"
              showInfo={false}
              strokeColor={"#0ff"}
              className="training-progress"
              style={{
                width: "100%",
              }}
            />
          </div>
          {/* START BUTTON */}
          {!started && (
            <Button
              onClick={startSet}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                borderRadius: "10px",
                padding: "10px",
                height: "initial",
                width: "initial",
                fontSize: "30px",
              }}
              icon={<PlayCircleOutlined style={{ fontSize: "30px" }} />}
              className="no-font-fix-button-weirdness"
            />
          )}
          {/* COUNTDOWN */}
          {countdown > 0 && (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                fontSize: "150px",
                color: "#fff",
                fontWeight: "bold",
                fontFamily: "BigBoy",
                WebkitTextStroke: "5px #0ff",
              }}
            >
              {countdown}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoElement;
