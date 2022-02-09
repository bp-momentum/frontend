import React, { RefObject, useCallback, useRef, useState } from "react";
import Webcam from "react-webcam";
import useWindowDimensions from "../../../hooks/windowDimension";
import { ApiSocketConnection } from "../../../util/api";

const WebcamStreamCapture = (props: { ws: RefObject<ApiSocketConnection> }) => {
  const webcamRef = useRef<Webcam>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [capturing, setCapturing] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);

  const webSocketRef = props.ws;

  const sendChunks = useCallback(
    (data: Blob): void => {
      webSocketRef.current?.send(data);
    },
    [webSocketRef]
  );

  const handleDataAvailable = useCallback(
    ({ data }) => {
      if (data.size > 0) {
        setRecordedChunks((prev) => prev.concat(data));
        sendChunks(data);
      }
    },
    [sendChunks]
  );

  const handleStartCaptureClick = useCallback(() => {
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

  const handleStopCaptureClick = useCallback(() => {
    mediaRecorderRef.current?.stop();
    setCapturing(false);
    const mediaRecorder = mediaRecorderRef.current as MediaRecorder;
    mediaRecorder.onstop = () =>
      webSocketRef.current?.send(
        JSON.stringify({ message_type: "end_set", data: {} })
      );
  }, [webSocketRef]);

  const handleDownload = useCallback(() => {
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

  const { height } = useWindowDimensions();

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
      }}
    >
      <Webcam
        audio={false}
        ref={webcamRef}
        mirrored
        style={{
          border: "1px solid red",
          maxWidth: "80%",
          maxHeight: Math.max((height - 230) * 0.8, 200),
          objectFit: "cover",
        }}
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

export default WebcamStreamCapture;
