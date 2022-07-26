import { message, Progress, Tooltip } from "antd";
import React, {
  createRef,
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import "@styles/train.css";
import Translations from "@localization/translations";
import { t } from "i18next";
import WebcamStreamCapture from "../components/webcamStreamCapture";
import useApi, { ApiSocketConnection } from "@hooks/api";
import TrainLayout from "../components/trainLayout";
import {
  doneCallback,
  endCallback,
  informationCallback,
  initCallback,
  statsCallback,
} from "./callbacks";
import { useParams } from "react-router-dom";
import { MdVideocam, MdVideocamOff } from "react-icons/md";
import { MedalType } from "@api/medal";

const soundsPerCategory: Record<audioCategory, string[]> = {
  good: ["good.opus", "keep_it_up.opus", "way_to_go.opus"],
  better: [
    "NICE.opus",
    "RIGHT_ON.opus",
    "there_you_go.opus",
    "WOUW.opus",
    "WOW.opus",
    "YEAH.opus",
  ],
  best: [
    "AMAZING.opus",
    "EXCELLENT.opus",
    "INCREDIBLE.opus",
    "LOOKS_GREAT.opus",
    "THERE_IT_IS.opus",
  ],
  perfect: ["GREAT_AIR.opus", "NICE_JUMP.opus"],
};

const playRandomSound = (category: audioCategory) => {
  const audioFiles = soundsPerCategory[category];

  const file = Math.floor(Math.random() * audioFiles.length);
  const fileId = audioFiles[file];

  const url = process.env.PUBLIC_URL + "/audio/" + fileId;

  const audio = new Audio(url);
  audio.volume = 0.2;
  audio.play();
};

interface Props {
  exercise?: ExerciseData;
  stats: MutableRefObject<StatsType>;
  setSubPage: Dispatch<SetStateAction<subPage>>;
  initialCollapsed: MutableRefObject<boolean>;
  setCameraShown: Dispatch<SetStateAction<boolean>>;
  setMedalType: Dispatch<SetStateAction<MedalType>>;
  cameraShown: boolean;
}

/**
 * The component that handles the training itself.
 * @param {Props} props The properties of the component.
 * @returns {JSX.Element} The component.
 */
const Training: React.FC<Props> = ({
  exercise,
  stats,
  setSubPage,
  initialCollapsed,
  setCameraShown,
  cameraShown,
  setMedalType,
}: Props): JSX.Element => {
  const [progress, setProgress] = useState(0); // repeats done per repeats to do in percent
  const [active, setActive] = useState(false); // whether sending video to server
  const [currentSet, setCurrentSet] = useState(stats.current.set);
  const [isFeedbackNew, setIsFeedbackNew] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>({
    x: -100,
    y: -100,
    addedPoints: 0,
    totalPoints: 0,
  });
  const [information, setInformation] = useState<string | null>(null);

  const currentRepeat = useRef(0);
  const totalPoints = useRef(0);
  const webSocketRef = useRef<ApiSocketConnection | null>(null);
  const points = useRef<Points[]>([]); // used to cache points per exercise

  const ptsRef = createRef<HTMLSpanElement>();
  const addPtsRef = createRef<HTMLSpanElement>();

  const { exercisePlanId } = useParams();

  const audioFeedbackChance = useRef(1);

  const api = useApi();

  useEffect(() => {
    totalPoints.current = feedback.totalPoints;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feedback.totalPoints]);

  useEffect(() => {
    if (!isFeedbackNew || !addPtsRef.current) return;

    //animate total points
    if (!ptsRef.current) return;
    ptsRef.current.style.fontSize = "2.2rem";
    setTimeout(() => {
      if (!ptsRef.current) return;
      ptsRef.current.style.fontSize = "2rem";
    }, 100);

    // animate added points
    addPtsRef.current.style.transform = "translate(-50%, -100%)";
    setTimeout(() => {
      if (!addPtsRef.current) return;
      addPtsRef.current.style.opacity = "0";
    }, 300);
    setTimeout(() => {
      if (!addPtsRef.current) return;
      addPtsRef.current.style.opacity = "1";
      addPtsRef.current.style.transform = "translate(-50%, -50%)";
      setIsFeedbackNew(false);
    }, 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFeedbackNew]);

  useEffect(() => {
    // start websocket connection on mount and disconnect on unmount
    connectToWS().catch(message.error);

    return () => {
      if (webSocketRef.current) webSocketRef.current.onclose = null;
      webSocketRef.current?.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

      switch (message.message_type) {
        case "init":
          initCallback(message.data, stats, setCurrentSet);
          break;
        case "start_set":
          setActive(true);
          break;
        case "statistics":
          statsCallback({
            data: message.data,
            points: points.current,
            repeats: exercise?.repeatsPerSet || 1,
            setProgress,
            currentRepeat,
            setFeedback,
            totalPoints,
            setIsFeedbackNew,
            playRandomSound,
            audioFeedbackChance,
          });
          break;
        case "information":
          informationCallback(message.data.information, setInformation);
          break;
        case "end_set":
          endCallback(stats.current, setActive, setSubPage, points.current);
          break;
        case "exercise_complete":
          doneCallback(
            stats.current,
            message.data.medal,
            setActive,
            setSubPage,
            setMedalType,
            points.current
          );
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

  return (
    <TrainLayout exercise={exercise} initialCollapsed={initialCollapsed}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          overflowY: "auto",
        }}
      >
        <h1 style={{ color: "white", fontSize: "40px" }}>{exercise?.title}</h1>
        <div style={{ color: "white", marginBottom: "20px" }}>
          <Tooltip title={t(Translations.training.currentSet)}>
            {currentSet}/{exercise?.sets}
          </Tooltip>
        </div>
        <div
          style={{
            width: "100%",
            maxWidth: "min(64%, 500px)",
            marginTop: "20px",
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
        <WebcamStreamCapture
          webSocketRef={webSocketRef}
          active={active}
          cameraShown={cameraShown}
        >
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
              {t(Translations.training.scoreShort)}:&nbsp;
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

            {active && (
              <div
                onClick={() => setCameraShown(!cameraShown)}
                style={{
                  marginRight: "-5px",
                  marginLeft: "auto",
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
            )}
          </div>
          <span
            style={{
              position: "absolute",
              left: `${feedback?.x}%`,
              top: `${feedback?.y}%`,
              color: "#466995",
              textShadow:
                "-1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff",
              transform: "translate(-50%, -50%)",
              fontSize: "1.5rem",
              transition: "transform 0.5s ease-out, opacity 0.2s ease-out",
            }}
            ref={addPtsRef}
          >
            {isFeedbackNew && <>+{feedback.addedPoints}</>}
          </span>
        </WebcamStreamCapture>
        {information && (
          <h1 style={{ color: "white", fontSize: "25px", paddingTop: "10px" }}>
            {information}
          </h1>
        )}
      </div>
    </TrainLayout>
  );
};

export default Training;
