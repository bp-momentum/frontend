import React, { useEffect, useRef, useState } from "react";
import Routes from "@util/routes";
import "@styles/train.css";
import { useParams } from "react-router-dom";
import Training from "./training";
import SetDone from "./setDone";
import ExerciseDone from "./exerciseDone";
import { useGetExerciseByIdQuery } from "@redux/api/api";
import { Layout, message } from "antd";
import useApi, { ApiSocketConnection } from "@hooks/api";

export interface webSocketController {
  sendImage: (video: HTMLVideoElement) => Promise<void>;
  startSet: () => void;
  endSet: () => void;
  endRepetition: () => void;
}

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rawExercise: Record<string, any>;
}

/**
 * A component that renders the training page and everything related
 * @param {Props} props The properties of the component
 * @returns {JSX.Element} The component
 */
const Train: React.FC<Props> = ({ rawExercise }: Props): JSX.Element => {
  const [exercise, setExercise] = React.useState<ExerciseData>();

  const [subPage, setSubPage] = useState<subPage>("training");

  const { data, isLoading } = useGetExerciseByIdQuery(rawExercise.id);

  useEffect(() => {
    let isMounted = true;

    if (data && isMounted && rawExercise.id !== -1) {
      setExercise({
        id: rawExercise.id,
        title: data.title,
        description: data.description,
        sets: rawExercise.sets,
        repeatsPerSet: rawExercise.repeats_per_set,
        videoPath: data.video,
        expectation: data.expectation,
      });
    }

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, rawExercise.repeats_per_set, rawExercise.sets]);

  const currentSet = useRef<number>(1);

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

    webSocket.onclose = function () {
      setTimeout(function () {
        console.warn("WebSocket closed! Trying to reconnect...");
        connectToWS();
      }, 1000);
    };

    webSocket.onmessage = (event) => {
      if (!event) return;
      if (event.message_type === "live_feedback") {
        // TODO: figure out a nice data structure for this
        // and how to display it
        console.log(event.data);
      }
    };
  }

  const socketController = useRef<webSocketController>({
    sendImage: async (video: HTMLVideoElement) => {
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
    startSet: () => {
      webSocketRef.current?.send(
        JSON.stringify({
          message_type: "start_set",
        })
      );
    },
    endSet: () => {
      webSocketRef.current?.send(
        JSON.stringify({
          message_type: "end_set",
        })
      );
    },
    endRepetition: () => {
      webSocketRef.current?.send(
        JSON.stringify({
          message_type: "end_repetition",
        })
      );
    },
  });
  // ------------------------
  // WEBSOCKET CONNECTION END
  // ------------------------

  return (
    <Layout style={{ height: "100%", position: "absolute", width: "100%" }}>
      {isLoading || !exercise ? (
        <div>Loading...</div>
      ) : (
        <>
          {subPage === "training" && (
            <Training
              exercise={exercise}
              onFinishSet={() => {
                setSubPage(
                  currentSet.current === exercise.sets
                    ? "exerciseDone"
                    : "setDone"
                );
              }}
              currentSet={currentSet}
              socketController={socketController}
            />
          )}
          {subPage === "setDone" && (
            <SetDone
              exercise={exercise}
              continueTraining={() => {
                currentSet.current += 1;
                setSubPage("training");
              }}
              currentSet={currentSet}
            />
          )}
          {subPage === "exerciseDone" && <ExerciseDone exercise={exercise} />}
        </>
      )}
    </Layout>
  );
};

/**
 * A component that renders the training page and everything related
 * @returns {JSX.Element} The component
 */
const Wrapper: React.FC = (): JSX.Element => {
  const [exercise, setExercise] = useState({ id: -1 });

  const { exercisePlanId } = useParams();

  const api = useApi();

  const exercisePlanIdToExercise = async (planId: number) => {
    const response = await api.execute(Routes.getDoneExercises());
    if (!response) return [];
    if (!response.success) {
      message.error(response.description);
      return [];
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return response.data.exercises.find((e: any) => {
      return e.exercise_plan_id === planId;
    });
  };

  useEffect(() => {
    let isMounted = true;

    exercisePlanIdToExercise(parseInt(exercisePlanId ?? "")).then(
      (exerciseData) => {
        if (exerciseData && isMounted) setExercise(exerciseData);
      }
    );

    return () => {
      // clean up
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Train rawExercise={exercise} />;
};

export default Wrapper;
