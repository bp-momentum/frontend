import React, { MutableRefObject, useEffect } from "react";
import Translations from "@localization/translations";
import Graph from "@shared/graph";
import continue_arrow from "@static/continue_arrow.png";
import { useNavigate } from "react-router-dom";
import Medal from "@shared/medal";
import useApi from "@hooks/api";
import Routes from "@util/routes";
import { message } from "antd";
import { useTranslation } from "react-i18next";
import config from "@config";
import SpeechBubble from "@shared/speechBubble";

interface Props {
  stats: MutableRefObject<StatsType>;
  exercise?: ExerciseData;
}

/**
 * A component that renders when training is done
 * @param {Props} props The properties of the component
 * @returns {JSX.Element} The component
 */
const ExerciseDone: React.FC<Props> = ({
  stats,
  exercise,
}: Props): JSX.Element => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const api = useApi();

  const [avatarId, setAvatarId] = React.useState<number | null>(null);

  const checkForExerciseAchievements = async () => {
    const response = await api.execute(Routes.loadExerciseAchievements());
    if (!response || !response.success) {
      return;
    }
    const achievements = response.data.achievements;
    if (!achievements || achievements.length === 0) {
      return;
    }
    message.success(
      t(Translations.training.newAchievements, { count: achievements.length })
    );
  };

  const loadAvatar = async () => {
    const result = await api.execute(Routes.getProfile());
    if (!result.success) message.error(result.description);
    else setAvatarId(result.data.avatar ?? 0);
  };

  const goHome = (): void => {
    navigate("/");
  };

  useEffect(() => {
    checkForExerciseAchievements().catch();
    loadAvatar().catch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalPerf =
    stats.current.data.reduce((acc: number, set: DataEntryType) => {
      return acc + set.performance;
    }, 0) / stats.current.data.length;

  const medalType =
    totalPerf >= 90
      ? "gold"
      : totalPerf >= 75
      ? "silver"
      : totalPerf >= 50
      ? "bronze"
      : "none";

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#466995",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 20,
          marginBottom: 100,
        }}
      >
        <h1 style={{ color: "white", fontSize: "60px", marginRight: 40 }}>
          {exercise?.title}
        </h1>

        {medalType && (
          <Medal
            size="large"
            type={medalType}
            tooltipText={t(Translations.training.medal, {
              context: medalType === "none" ? null : medalType,
            })}
          />
        )}
      </div>

      <div
        style={{
          position: "relative",
          display: "flex",
          flexWrap: "wrap",
          flexDirection: "row-reverse",
          justifyContent: "center",
          marginBottom: 30,
          minHeight: "230px",
          width: "100%",
        }}
      >
        <div
          style={{
            width: 400,
            display: "flex",
            justifyContent: "center",
            height: "200px",
          }}
        >
          <div
            style={{
              position: "relative",
            }}
          >
            {avatarId && (
              <img
                alt="Avatar"
                src={config.avatarUrlFormatter(avatarId)}
                style={{
                  height: "200px",
                  width: "200px",
                }}
              />
            )}
            <div
              style={{
                position: "absolute",
                width: "300px",
                bottom: "220px",
                right: "130px",
              }}
            >
              <SpeechBubble
                text={t(Translations.training.mascotText)}
                padding={10}
              ></SpeechBubble>
            </div>
          </div>
        </div>
        <div
          style={{
            height: 200,
            marginLeft: "31px",
          }}
        >
          <Graph
            data={stats.current.data}
            setSize={exercise?.repeatsPerSet ?? 1}
            width={600}
            style={{ marginLeft: -31 }}
          />
        </div>
        <div style={{ width: 400, margin: "55px 20px" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              cursor: "pointer",
            }}
            onClick={goHome}
          >
            <img
              src={continue_arrow}
              alt="Continue"
              width="100px"
              style={{ transform: "rotate(180deg)" }}
            />
            <span
              style={{ marginTop: 10, color: "white", textAlign: "center" }}
            >
              {t(Translations.training.backHome)}
            </span>
          </div>
        </div>
      </div>
      <h1 style={{ color: "white", fontSize: "45px", marginTop: -50 }}>
        {t(Translations.training.score, {
          points: stats.current.totalPoints,
        })}
      </h1>
    </div>
  );
};

export default ExerciseDone;
