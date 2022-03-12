import React, { createRef, useEffect } from "react";
import Routes from "@util/routes";
import Container from "@shared/container";
import { Row, Layout, message } from "antd";
import Translations from "@localization/translations";
import { t } from "i18next";
import Helper from "@util/helper";
import { useAppSelector } from "@redux/hooks";
import { Emoji } from "react-apple-emojis";
import "@styles/home.css";
import Day from "./components/day";
import useApi from "@hooks/api";

const { Content } = Layout;

const Exercises: React.FC = () => {
  const [exercises, setExercises] = React.useState<Exercise[]>([]);

  const api = useApi();

  useEffect(() => {
    let isMounted = true;

    api.execute(Routes.getDoneExercises()).then((response) => {
      if (!response || !isMounted) return;
      if (!response.success) {
        message.error(
          t(response.description ?? Translations.errors.unknownError)
        );
        return;
      }
      setExercises(response.data.exercises);
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
    <Container currentPage="home" color="blue">
      <Layout
        style={{
          height: "100%",
          position: "absolute",
          maxHeight: "100%",
          width: "100%",
        }}
      >
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
                }}
              >
                <span
                  style={{
                    background:
                      "radial-gradient(#FF8A0060 15%, #ffbe3a00 70% )",
                    fontSize: "60px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    borderRadius: "50%",
                    padding: "8px 15px",
                  }}
                >
                  <Emoji style={{}} name="fire" width={60} />
                </span>
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
      </Layout>
    </Container>
  );
};

export default Exercises;
