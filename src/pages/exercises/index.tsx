import React, { createRef, useEffect } from "react";
import Routes from "@util/routes";
import Container from "@shared/container";
import { Row, Layout, message, Spin } from "antd";
import Translations from "@localization/translations";
import "@styles/home.css";
import Day from "./components/day";
import useApi from "@hooks/api";
import { useTranslation } from "react-i18next";
import { LoadingOutlined } from "@ant-design/icons";
import { useAppSelector } from "@redux/hooks";

const { Content } = Layout;

/**
 * The home page for users
 * @returns {JSX.Element} The page
 */
const Exercises: React.FC = (): JSX.Element => {
  const { t } = useTranslation();

  const [exercises, setExercises] = React.useState<Exercise[]>([]);

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

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const username = useAppSelector((state) => state.profile.username);

  const wrapper = createRef<HTMLDivElement>();

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
            <Row
              style={{
                justifyContent: "center",
                width: "100%",
              }}
            >
              <h1 style={{ fontSize: "48px" }}>
                {t(Translations.exercises.motivation)}
                {username}!
              </h1>
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
