import React, {
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import useWindowDimensions from "@hooks/windowDimension";
import { ApiSocketConnection } from "@hooks/api";
import { PlayCircleOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { Camera } from "@mediapipe/camera_utils";
import { Pose, POSE_CONNECTIONS, Results } from "@mediapipe/pose";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";

interface Props {
  webSocketRef: RefObject<ApiSocketConnection>;
  active: boolean;
  cameraShown: boolean;
  children: React.ReactNode;
}

/**
 * The webcam stream capture component.
 * @param {Props} props The properties of the component.
 * @returns {JSX.Element} The component.
 */
const WebcamStreamCapture: React.FC<Props> = ({
  children,
  webSocketRef,
  active,
  cameraShown,
}: Props): JSX.Element => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [capturing, setCapturing] = useState(false);

  const [countdown, setCountdown] = useState(-1);

  const sendImage = useCallback(
    async (video: HTMLVideoElement) => {
      if (!capturing || !active) return;
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
    [capturing, webSocketRef, active]
  );

  const startCountdown = useCallback(async () => {
    for (let i = 3; i > 0; i--) {
      setCountdown(i);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    setCountdown(0);
    setCapturing(true);
    webSocketRef.current?.send(
      JSON.stringify({
        message_type: "start_set",
        data: { user_token: "", exercise_id: 1 },
      })
    );
  }, [webSocketRef]);

  // -------------------------------
  // MEDIAPIPE POSE ESTIMATION START
  // -------------------------------
  const [pose, setPose] = useState<Pose>();

  const onResults = useCallback((results: Results) => {
    if (!results.poseLandmarks || !canvasRef.current) return;
    const canvasCtx = canvasRef.current.getContext("2d");
    if (!canvasCtx) return;
    canvasCtx.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
    drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, {
      color: "#00FF00",
      lineWidth: 4,
    });
    drawLandmarks(canvasCtx, results.poseLandmarks, {
      color: "#FF0000",
      lineWidth: 2,
    });
  }, []);

  useEffect(() => {
    // if (!webSocketRef.current) return;
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
    pose.onResults(onResults);
    setPose(pose);
    return () => {
      console.log("Cleaning up");
      pose.close();
    };
  }, [onResults, webSocketRef]);

  useEffect(() => {
    if (!videoRef.current) return;
    const camera = new Camera(videoRef?.current, {
      onFrame: async () => {
        if (!videoRef.current) return;
        sendImage(videoRef.current);
        await pose?.send({ image: videoRef.current });
      },
    });
    camera.start();
    return () => {
      console.log("Stopping camera");
      camera.stop();
    };
  }, [videoRef, pose, sendImage]);

  // set the correct size attribute for the canvas
  // even though it is possisioned with css,
  // mediapipe needs the width and height attributes for some unholy reason
  useEffect(() => {
    if (!videoRef.current || !canvasRef.current) return;
    const obs = new ResizeObserver(() => {
      canvasRef.current?.setAttribute(
        "width",
        `${videoRef.current?.clientWidth}`
      );
      canvasRef.current?.setAttribute(
        "height",
        `${videoRef.current?.clientHeight}`
      );
    });
    obs.observe(videoRef.current as Element);
  }, [videoRef, canvasRef]);
  // -----------------------------
  // MEDIAPIPE POSE ESTIMATION END
  // -----------------------------

  const { height } = useWindowDimensions();

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        margin: "10px",
      }}
    >
      <video
        ref={videoRef}
        style={{
          maxWidth: "80%",
          maxHeight: Math.max((height - 230) * 0.8, 200),
          objectFit: "cover",
          borderRadius: "30px",
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.5)",
          // filter: cameraShown ? "none" : "blur(15px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          margin: "auto",
          maxWidth: "80%",
          maxHeight: Math.max((height - 230) * 0.8, 200),
          width: "100%",
          height: "100%",
          backdropFilter:
            !cameraShown || (capturing && !active) ? "blur(50px)" : "none",
          WebkitBackdropFilter:
            !cameraShown || (capturing && !active) ? "blur(50px)" : "none",
          borderRadius: "30px",
        }}
      ></div>
      <canvas
        style={{
          position: "absolute",
          margin: "auto",
          maxWidth: "80%",
          maxHeight: Math.max((height - 230) * 0.8, 200),
          width: "100%",
          height: "100%",
          minWidth: "100px",
          borderRadius: "30px",
        }}
        ref={canvasRef}
      ></canvas>
      <div
        style={{
          position: "absolute",
          margin: "auto",
          maxWidth: "80%",
          maxHeight: Math.max((height - 230) * 0.8, 200),
          width: "100%",
          height: "100%",
          borderRadius: "30px",
          padding: "15px 20px",
          border: "2px solid #fff",
          minWidth: "100px",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
          }}
        >
          {children}
        </div>
      </div>
      {!capturing && countdown < 0 && (
        <Button
          onClick={startCountdown}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            borderRadius: "10px",
            padding: "10px",
            height: "inherit",
            width: "inherit",
            fontSize: "30px",
          }}
          icon={<PlayCircleOutlined style={{ fontSize: "30px" }} />}
          className="no-font-fix-button-weirdness"
        />
      )}
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
  );
};

export default WebcamStreamCapture;
