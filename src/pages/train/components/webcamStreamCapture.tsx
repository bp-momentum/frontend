import React from "react";
import Webcam from "react-webcam";
import { ApiSocketConnection } from "../../../util/api";

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

export default WebcamStreamCapture;
