import React, { createRef, useEffect } from "react";
import Routes from "@util/routes";
import Container from "@shared/container";
import { Row, Layout, message, Spin } from "antd";
import Translations from "@localization/translations";
import Helper from "@util/helper";
import { useAppSelector } from "@redux/hooks";
import "@styles/home.css";
import Day from "./components/day";
import useApi from "@hooks/api";
import { useTranslation } from "react-i18next";
import { LoadingOutlined } from "@ant-design/icons";

const { Content } = Layout;

/**
 * The home page for users
 * @returns {JSX.Element} The page
 */
const Exercises: React.FC = (): JSX.Element => {
  const { t } = useTranslation();

  const [exercises, setExercises] = React.useState<Exercise[]>([]);
  const [streak, setStreak] = React.useState<{
    days: number;
    flame_glow: boolean;
    flame_height: number;
  }>();

  const [hasPlan, setHasPlan] = React.useState<number>(0);

  const api = useApi();

  useEffect(() => {
    let isMounted = true;

    api.execute(Routes.getDoneExercises()).then((response) => {
      if (!response || !isMounted) return;
      if (!response.success) {
        // handle expected errors
        if (response.description === "User has no plan assigned") {
          setHasPlan(1);
          return;
        }
        // handle unexpected errors
        message.error(
          t(response.description ?? Translations.errors.unknownError)
        );
        return;
      }
      setHasPlan(2);
      setExercises(response.data.exercises);
    });

    api.execute(Routes.getStreak()).then((response) => {
      if (!response || !isMounted) return;
      if (!response.success) {
        message.error(
          t(response.description ?? Translations.errors.unknownError)
        );
        return;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setStreak(response.data as any);
    });

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const token = useAppSelector((state) => state.token.token);
  const username = token && Helper.getUserName(token);

  const wrapper = createRef<HTMLDivElement>();

  const dayName = Helper.getCurrentDayName();
  const todoExercises = exercises.filter((e) => e.date === dayName);
  const doneExercises = todoExercises.filter((e) => e.done);
  const medalCount = todoExercises.length - doneExercises.length;

  return (
    <Container currentPage="home">
      <Layout
        style={{
          height: "100%",
          position: "absolute",
          maxHeight: "100%",
          width: "100%",
        }}
      >
        {hasPlan === 0 ? (
          <Content
            style={{
              display: "flex",
              width: "100%",
              maxHeight: "80%",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Spin
              indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />}
            />
          </Content>
        ) : hasPlan === 2 ? (
          <Content
            style={{
              display: "flex",
              width: "100%",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Row style={{ alignItems: "center", width: "100%" }}>
              <div
                style={{
                  marginLeft: "50%",
                  transform: "translateX(-50%)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <h1 style={{ fontSize: "48px" }}>
                  {t(Translations.exercises.motivation)}
                  {username}!
                </h1>
                <h2 style={{ fontSize: "24px" }}>
                  {t(Translations.exercises.medalMotivation, {
                    count: medalCount,
                  })}
                </h2>
              </div>
              <div
                style={{
                  marginLeft: "auto",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  marginRight: "20px",
                }}
              >
                <span
                  style={{
                    fontSize: "50px",
                    color: "#FF8A00",
                    WebkitTextStroke: "1px black",
                    display: "flex",
                    flexWrap: "nowrap",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {streak?.days}
                  <div
                    style={{
                      background: streak?.flame_glow
                        ? "radial-gradient(#FF8A0060 15%, #ffbe3a00 70% )"
                        : "",
                      height: "76px",
                      width: "90px",
                      borderRadius: "50%",
                      margin: "15px",
                      position: "relative",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "Noto Color Emoji",
                        fontSize: 45,
                        position: "absolute",
                        top: "50%",
                        transform: "translateY(-50%)",
                        left: "0px",
                      }}
                      role="img"
                    >
                      🔥
                    </span>
                    <span
                      style={{
                        fontFamily: "Noto Color Emoji",
                        fontSize: 45,
                        position: "absolute",
                        clipPath: `polygon(0 0, 100% 0, 100% ${
                          100 - (streak?.flame_height || 0) * 100
                        }%, 0% ${100 - (streak?.flame_height || 0) * 100}%)`,
                        left: "0px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        filter: "grayscale(100%)",
                      }}
                      role="img"
                    >
                      🔥
                    </span>
                  </div>
                </span>
              </div>
            </Row>
            <Content
              style={{
                display: "flex",
                width: "100%",
                padding: "0px",
                paddingTop: "20px",
                overflow: "auto",
              }}
            >
              <div
                className="day-wrapper"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                <Row
                  style={{
                    padding: "10px 50px",
                    height: "100%",
                    alignContent: "flex-start",
                    overflow: "auto",
                    flexFlow: "row",
                    marginLeft: "0px",
                    marginTop: "0px", // needs to be split because of
                    marginRight: "0px", // https://github.com/facebook/react/issues/8689
                    marginBottom: "0px",
                    flexDirection: "row",
                  }}
                  gutter={[16, 16]}
                  ref={wrapper}
                >
                  <Day
                    list={exercises}
                    name="monday"
                    displayName={t(Translations.weekdays.monday)}
                    wrapper={wrapper}
                  />
                  <Day
                    list={exercises}
                    name="tuesday"
                    displayName={t(Translations.weekdays.tuesday)}
                    wrapper={wrapper}
                  />
                  <Day
                    list={exercises}
                    name="wednesday"
                    displayName={t(Translations.weekdays.wednesday)}
                    wrapper={wrapper}
                  />
                  <Day
                    list={exercises}
                    name="thursday"
                    displayName={t(Translations.weekdays.thursday)}
                    wrapper={wrapper}
                  />
                  <Day
                    list={exercises}
                    name="friday"
                    displayName={t(Translations.weekdays.friday)}
                    wrapper={wrapper}
                  />
                  <Day
                    list={exercises}
                    name="saturday"
                    displayName={t(Translations.weekdays.saturday)}
                    wrapper={wrapper}
                  />
                  <Day
                    list={exercises}
                    name="sunday"
                    displayName={t(Translations.weekdays.sunday)}
                    wrapper={wrapper}
                  />
                </Row>
                <div className="leftOverlay" />
                <div className="rightOverlay" />
              </div>
            </Content>
          </Content>
        ) : (
          <Content
            style={{
              display: "flex",
              width: "100%",
              maxHeight: "80%",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <h1 style={{ fontSize: "48px" }}>{t(Translations.home.welcome)}</h1>
            <h2
              style={{
                fontSize: "24px",
                whiteSpace: "pre-line",
                textAlign: "center",
              }}
            >
              {t(Translations.exercises.noPlan)}
            </h2>
          </Content>
        )}
      </Layout>
    </Container>
  );
};

export default Exercises;
