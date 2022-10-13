import React, {
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Webcam from "react-webcam";
import useWindowDimensions from "@hooks/windowDimension";
import { ApiSocketConnection } from "@hooks/api";
import { PlayCircleOutlined } from "@ant-design/icons";
import { Button, Tooltip } from "antd";
import Translations from "@localization/translations";
import { useTranslation } from "react-i18next";

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
  const webcamRef = useRef<Webcam>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [capturing, setCapturing] = useState(false);

  const { t } = useTranslation();

  const sendChunks = useCallback(
    (data: Blob): void => {
      if (!active) return;
      webSocketRef.current?.send(data);
    },
    [active, webSocketRef]
  );

  const handleDataAvailable = useCallback(
    ({ data }: { data: Blob }) => {
      if (data.size > 0) {
        sendChunks(data);
      }
    },
    [sendChunks]
  );

  const handlerRef = useRef<({ data }: { data: Blob }) => void>();

  useEffect(() => {
    if (handlerRef.current)
      mediaRecorderRef.current?.removeEventListener(
        "dataavailable",
        handlerRef.current
      );
    mediaRecorderRef.current?.addEventListener(
      "dataavailable",
      handleDataAvailable
    );
    handlerRef.current = handleDataAvailable;
  }, [handleDataAvailable]);

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
      <Webcam
        audio={false}
        ref={webcamRef}
        mirrored
        style={{
          maxWidth: "80%",
          maxHeight: Math.max((height - 230) * 0.8, 200),
          objectFit: "cover",
          borderRadius: "30px",
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.5)",
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
      {!capturing && (
        <Tooltip
          title={t(Translations.training.clickToStart)}
          defaultOpen={true}
        >
          <Button
            onClick={handleStartCaptureClick}
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
        </Tooltip>
      )}
    </div>
  );
};

export default WebcamStreamCapture;
