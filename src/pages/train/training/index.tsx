import React, { useEffect } from "react";
import "@styles/train.css";
import Translations from "@localization/translations";
import TrainLayout from "../components/trainLayout";
import { useTranslation } from "react-i18next";
import Paper from "@shared/paper";
import useWindowDimensions from "@hooks/windowDimension";
import VideoElement from "../components/videoElement";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import { Slider } from "antd";
import useApi from "@hooks/api";
import Routes from "@util/routes";
import { setExercisePrefs } from "@redux/exercise/prefsSlice";
import { webSocketController } from "..";

const SpeedSlider: React.FC<{ exId: number }> = ({
  exId,
}: {
  exId: number;
}) => {
  const [tmpValue, setTmpValue] = React.useState(10);

  const speed = useAppSelector((state) => state.exercisePrefs.speed);

  useEffect(() => {
    setTmpValue(speed);
  }, [speed]);

  const api = useApi();
  const dispatch = useAppDispatch();

  const updateInstructionPrefs = () => {
    api.execute(Routes.getExercisePreferences({ id: exId })).then((res) => {
      dispatch(
        setExercisePrefs({
          visible: res.data.visible,
          speed: res.data.speed,
        })
      );
    });
  };

  const setSpeed = (value: number) => {
    api.execute(Routes.setExercisePreferences({ id: exId, speed: value }));
    updateInstructionPrefs();
  };

  return (
    <Slider
      style={{ width: "100%" }}
      value={tmpValue}
      onAfterChange={setSpeed}
      onChange={setTmpValue}
      min={5}
      max={15}
      step={1}
      tooltip={{
        formatter: (val) => {
          return (val || 10) * 10 + "%";
        },
      }}
    />
  );
};

const PointsPaper: React.FC<{ exId: number }> = ({
  exId,
}: {
  exId: number;
}) => {
  const { t } = useTranslation();

  return (
    <Paper
      title={
        <span style={{ fontSize: "40px", lineHeight: "47.145px" }}>
          {t(Translations.training.stats)}
        </span>
      }
      backdropColor="#466995"
      totalWidth={400}
      lineColor="#A1C7DA"
      padding={20}
      margin="40px 20px 40px 40px"
    >
      TODO: Find Replacement for Live Stats
      <br />
      <span
        style={{
          display: "block",
          marginTop: "20px",
          fontSize: "30px",
          lineHeight: "47.145px",
        }}
      >
        {t(Translations.tabBar.settings)}
      </span>
      {t(Translations.training.speed)}
      <SpeedSlider exId={exId} />
    </Paper>
  );
};

interface Props {
  exercise: ExerciseData;
  onFinishSet: () => void;
  currentSet: React.MutableRefObject<number>;
  socketController: React.MutableRefObject<webSocketController>;
}

/**
 * The component that handles the training itself.
 * @param {Props} props The properties of the component.
 * @returns {JSX.Element} The component.
 */
const Training: React.FC<Props> = ({
  exercise,
  onFinishSet,
  currentSet,
  socketController,
}: Props): JSX.Element => {
  const { width } = useWindowDimensions();

  return (
    <TrainLayout exercise={exercise} currentSet={currentSet}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          overflowY: "auto",
          height: "100%",
          paddingTop: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h1
            style={{
              color: "white",
              fontSize: "40px",
              marginBottom: 0,
              fontFamily: "BigBoy",
            }}
          >
            {exercise?.title}
          </h1>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexWrap: width < 900 ? "wrap" : "nowrap",
            justifyContent: "center",
          }}
        >
          <VideoElement
            onFinishSet={onFinishSet}
            exercise={exercise}
            socketController={socketController}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <PointsPaper exId={exercise.id} />
          </div>
        </div>
      </div>
    </TrainLayout>
  );
};

export default Training;
