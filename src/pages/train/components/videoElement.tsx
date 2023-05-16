import React, {
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import useWindowDimensions from "@hooks/windowDimension";
import { PlayCircleOutlined } from "@ant-design/icons";
import { Button, Progress, Tooltip } from "antd";
import {
  FilesetResolver,
  PoseLandmarker,
  DrawingUtils,
} from "@mediapipe/tasks-vision";
import type { NormalizedLandmark } from "@mediapipe/tasks-vision";
import { useAppSelector } from "@redux/hooks";
import { MdVideocam, MdVideocamOff } from "react-icons/md";
import { playBeep, playDing } from "../training/audio";
import { webSocketController } from "..";

interface Props {
  exercise: ExerciseData;
  onFinishSet: () => void;
  socketController: React.MutableRefObject<webSocketController>;
}

/**
 * The webcam stream capture component.
 * @param {Props} props The properties of the component.
 * @returns {JSX.Element} The component.
 */
const VideoElement: React.FC<Props> = ({
  exercise,
  onFinishSet,
  socketController,
}: Props): JSX.Element => {
  // CUSTOM HOOKS
  const { height } = useWindowDimensions();

  // STATES
  const [cameraShown, setCameraShown] = useState(true);
  const [countdown, setCountdown] = useState(-1);
  const [started, setStarted] = useState(false);
  const [diff, setDiff] = useState(-1);
  const diffRef = useRef(-1);

  const diffToError = (diff: number) => {
    const colorR1 = 0x00;
    const colorG1 = 0xff;
    const colorR2 = 0xff;
    const colorG2 = 0x00;

    // bad diff := diff > 10
    // good diff := diff < 3
    const colorR = (colorR1 * (10 - diff) + colorR2 * diff) / 10;
    const colorG = (colorG1 * (10 - diff) + colorG2 * diff) / 10;
    const color = `rgb(${colorR}, ${colorG}, 0)`;

    if (diff < 0) {
      let errorMsg = "";
      switch (diff) {
        case -1:
          errorMsg = "Not Initialized";
          break;
        case -2:
          errorMsg = "Missing Landmarks";
          break;
        case -3:
          errorMsg = "Invalid Landmarks";
          break;
        case -4:
          errorMsg = "Not fully in view";
          break;
        default:
          errorMsg = "Unknown Error";
      }
      return (
        <span
          style={{
            color: "white",
            fontFamily: "inherit",
            fontWeight: "inherit",
            fontSize: "inherit",
          }}
        >
          {errorMsg}
        </span>
      );
    }

    // Normal value
    return (
      <span>
        <Tooltip title={"Normalized Average Landmark Disposition"}>
          NALD:
        </Tooltip>
        <span
          style={{
            color: color,
            fontFamily: "inherit",
            fontWeight: "inherit",
            fontSize: "inherit",
          }}
        >
          {diff.toFixed(2)}
        </span>
      </span>
    );
  };

  useEffect(() => {
    setInterval(() => {
      if (!currentPose.current) return;
      comparePosition(currentPose.current, exercise.expectation[0]);
    }, 500);
  });

  // REFS
  const capturing = useRef(false);
  const progress = useRef(0);
  const currentPose = useRef<NormalizedLandmark[]>();

  const estimationCanvasRef = useRef<HTMLCanvasElement>(null);
  const expectedCanvasRef = useRef<HTMLCanvasElement>(null);

  // -------------------------
  // EXPECTATION OVERLAY START
  // -------------------------
  const isValidLandmark = (lm: NormalizedLandmark) => {
    return lm.x > 0 && lm.y > 0 && lm.x < 1 && lm.y < 1;
  };

  const comparePosition = useCallback(
    (
      actualLandmarks: NormalizedLandmark[],
      expectedLandmarks: NormalizedLandmark[]
    ) => {
      if (!actualLandmarks || !expectedLandmarks) {
        setDiff(-2);
        diffRef.current = -2;
        return -2;
      }

      if (actualLandmarks.length !== expectedLandmarks.length) {
        setDiff(-3);
        diffRef.current = -3;
        return -3;
      }

      // check if all landmarks are valid
      if (
        !actualLandmarks.every((lm) => isValidLandmark(lm)) ||
        !expectedLandmarks.every((lm) => isValidLandmark(lm))
      ) {
        setDiff(-4);
        diffRef.current = -4;
        return -4;
      }

      // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
      //                         EXPECTED LANDMARKS
      // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
      let internalExpectedLandmarks = expectedLandmarks;
      // find lowest y value in all expected landmarks
      const lowestY = Math.min(
        ...internalExpectedLandmarks.map((landmark) => landmark.y)
      );
      // find the average x value of all expected landmarks
      let averageX = internalExpectedLandmarks.reduce(
        (acc, landmark) => acc + landmark.x,
        0
      );
      averageX /= internalExpectedLandmarks.length;
      // find the average z value of all expected landmarks
      let averageZ = internalExpectedLandmarks.reduce(
        (acc, landmark) => acc + landmark.z,
        0
      );
      averageZ /= internalExpectedLandmarks.length;
      // subtract
      //  lowest y value,
      //  average x value and
      //  average z value from all expected landmarks
      internalExpectedLandmarks = internalExpectedLandmarks.map((landmark) => ({
        ...landmark,
        y: landmark.y - lowestY,
        x: landmark.x - averageX,
        z: landmark.z - averageZ,
      }));
      // find the highest y value in all expected landmarks
      const highestY = Math.max(
        ...internalExpectedLandmarks.map((landmark) => landmark.y)
      );
      // 3D scale to a total height of 100 with the origin at (0, 0)
      internalExpectedLandmarks = internalExpectedLandmarks.map((landmark) => ({
        ...landmark,
        y: (landmark.y / highestY) * 100,
        x: (landmark.x / highestY) * 100,
        z: (landmark.z / highestY) * 100,
      }));

      // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
      //                         ACTUAL LANDMARKS
      // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
      let internalActualLandmarks = actualLandmarks;
      // find lowest y value in all actual landmarks
      const lowestYActual = Math.min(
        ...internalActualLandmarks.map((landmark) => landmark.y)
      );
      // find the average x value of all actual landmarks
      let averageXActual = internalActualLandmarks.reduce(
        (acc, landmark) => acc + landmark.x,
        0
      );
      averageXActual /= internalActualLandmarks.length;
      // find the average z value of all actual landmarks
      let averageZActual = internalActualLandmarks.reduce(
        (acc, landmark) => acc + landmark.z,
        0
      );
      averageZActual /= internalActualLandmarks.length;
      // subtract
      //  lowest y value,
      //  average x value and
      //  average z value from all actual landmarks
      internalActualLandmarks = internalActualLandmarks.map((landmark) => ({
        ...landmark,
        y: landmark.y - lowestYActual,
        x: landmark.x - averageXActual,
        z: landmark.z - averageZActual,
      }));
      // find the highest y value in all actual landmarks
      const highestYActual = Math.max(
        ...internalActualLandmarks.map((landmark) => landmark.y)
      );
      // 3D scale to a total height of 100 with the origin at (0, 0)
      internalActualLandmarks = internalActualLandmarks.map((landmark) => ({
        ...landmark,
        y: (landmark.y / highestYActual) * 100,
        x: (landmark.x / highestYActual) * 100,
        z: (landmark.z / highestYActual) * 100,
      }));

      // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
      //                         CALCULATE DISTANCE
      // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
      let sum = 0;
      for (let i = 0; i < internalActualLandmarks.length; i++) {
        const actual = internalActualLandmarks[i];
        const expected = internalExpectedLandmarks[i];
        // get the normalized 2D position of the landmarks
        sum += Math.sqrt(
          Math.pow(actual.x - expected.x, 2) +
            Math.pow(actual.y - expected.y, 2) +
            Math.pow(actual.z - expected.z, 2)
        );
      }

      // average distance between actual and expected landmarks

      setDiff(sum / internalActualLandmarks.length);
      diffRef.current = sum / internalActualLandmarks.length;
      return sum / internalActualLandmarks.length;
    },
    []
  );

  const speed = useAppSelector((state) => state.exercisePrefs.speed);

  const startSet = async () => {
    setStarted(true);
    // Wait for player to be positioned correctly
    // Show first frame of expectation
    onResults(exercise.expectation[0], expectedCanvasRef, true);

    // check every .1 seconds if currentPose is close enough to expectation
    // eslint-disable-next-line no-constant-condition
    while (true) {
      if (!currentPose.current) continue;
      const distance = diffRef.current;
      // TODO: this value may need to be adjusted (it is good enough for now)
      // distance < 0 => error
      // distance > x.x => not close enough
      if (distance > 0 && distance < 10) break;
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    for (let i = 3; i > 0; i--) {
      setCountdown(i);
      playBeep(false);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    setCountdown(0);
    playBeep(true);

    socketController.current.startSet();
    capturing.current = true;
    for (let i = 0; i < exercise.repeatsPerSet; i++) {
      for (let j = 0; j < exercise.expectation.length; j++) {
        // draw landmarks on canvas
        onResults(exercise.expectation[j], expectedCanvasRef, true);
        // wait for 1/10th of a second
        await new Promise((resolve) => setTimeout(resolve, (1 / speed) * 1000));
      }
      // one repetition is done
      socketController.current.endRepetition();
      playDing();
    }
    // entire set is done
    capturing.current = false;
    socketController.current.endSet();
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
      landmarks: NormalizedLandmark[],
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

      const drawingUtils = new DrawingUtils(canvasCtx);
      drawingUtils.drawLandmarks(landmarks, {
        radius: (data) =>
          DrawingUtils.lerp(data.from?.z ?? 0, -0.15, 0.1, 5, 1),
      });
      drawingUtils.drawConnectors(landmarks, PoseLandmarker.POSE_CONNECTIONS);

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
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // wait for video to be there
    if (!videoRef.current) return;

    // load camera
    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) videoRef.current.srcObject = stream;
        })
        .catch(() => {
          console.log("Something went wrong!");
        });
    }

    const clear = (async () => {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );
      const pose = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
          delegate: "GPU",
        },
        runningMode: "IMAGE",
        minPoseDetectionConfidence: 0.5,
        minPosePresenceConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      const interval = setInterval(() => {
        if (!videoRef.current) return;
        if (videoRef.current.paused) {
          videoRef.current.play();
        }
        const canvas = document.createElement("canvas");
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        if (pose) {
          pose.detect(canvas, (result) => {
            if (result.landmarks && result.landmarks.length > 0) {
              onResults(result.landmarks[0], estimationCanvasRef, false);
            }
          });
        }
        if (capturing.current)
          socketController.current.sendImage(videoRef.current);
      }, 100);

      return () => {
        clearInterval(interval);
        pose.close();
      };
    })();
    return () => {
      console.log("Cleaning up");
      clear.then((clear) => clear());
    };
  }, [videoRef, socketController, onResults]);

  // set the correct size attribute for the canvas
  // even though it is positioned with css,
  // MediaPipe needs the width and height attributes for some unholy reason
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
    <>
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
          autoPlay
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
      {window._env_.DEBUG && (
        <div
          style={{
            position: "absolute",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            top: "20px",
            right: "20px",
            fontSize: "15px",
            fontFamily: "Consolas",
            fontWeight: "normal",
            padding: "10px",
            borderRadius: "5px",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            color: "#ddd",
          }}
        >
          Debug values: <br />
          {diffToError(diff)}
        </div>
      )}
    </>
  );
};

export default VideoElement;
