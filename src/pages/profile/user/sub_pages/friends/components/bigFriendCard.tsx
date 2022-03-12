import config from "@config";
import EmptyDataRender from "@shared/emptyDataRender";
import Translations from "@localization/translations";
import { useGetFriendByIdQuery } from "@redux/friends/friendApiSlice";
import { Col, Progress, Row, Tooltip } from "antd";
import React from "react";
import { Emoji } from "react-apple-emojis";
import { useTranslation } from "react-i18next";
import { MdClose } from "react-icons/md";
import Container from "../../../components/container";
import "@styles/friends.css";
import Helper from "@util/helper";
import Medal from "@shared/medal";

interface Props {
  username: string;
  onClose: VoidFunction;
}

const BigFriendCard: React.FC<Props> = ({ onClose, username }) => {
  const { t } = useTranslation();
  const { data, isLoading, isError, error } = useGetFriendByIdQuery(username);

  if (isLoading) {
    return (
      <Container size={{ width: "280px", height: "90px" }}>
        {t(Translations.exercises.loading)}
      </Container>
    );
  }

  if (isError || !data) {
    return (
      <Container size={{ width: "280px", height: "90px" }}>
        {error && error.toString()}
      </Container>
    );
  }

  const { str, count } = Helper.getLastActiveFromDateString(data.last_login);
  const lastActive = t(str, { count: count });

  return (
    <Container size={{ width: "600px", height: "initial" }}>
      <MdClose
        onClick={onClose}
        style={{ position: "absolute", top: 10, right: 10, cursor: "pointer" }}
      />
      <Row gutter={10} style={{ width: "100%" }}>
        <Col style={{ width: "50%" }}>
          <Row style={{ marginBottom: "30px", alignItems: "center" }}>
            <div
              style={{
                backgroundColor: "#626FE5",
                borderRadius: "50%",
                height: "80px",
                width: "80px",
                cursor: "pointer",
                padding: "10px 5px 0px 5px",
                overflow: "hidden",
                marginRight: "20px",
                border: "1px solid gray",
              }}
            >
              <img
                alt="Avatar"
                key={data.avatar}
                src={config.avatarUrlFormatter(data.avatar)}
                style={{
                  height: "100%",
                  width: "100%",
                }}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span className="friendNameHeader">{data.username}</span>
              <span className="text">
                {t(Translations.friends.lastActive)}: {lastActive}
              </span>
            </div>
          </Row>
          <Row>
            <span className="friendHeader">
              {t(Translations.friends.motivation)}
            </span>
          </Row>
          <Row justify="center">
            <span className="text">{data.motivation}&nbsp;</span>
          </Row>
          <Row>
            <span className="friendHeader">
              {t(Translations.friends.level)}
            </span>
          </Row>
          <Row
            style={{ display: "flex", alignItems: "center" }}
            justify="center"
          >
            <span className="text">Lvl {data.level}</span>
            <Tooltip title={`${data.level_progress} XP`}>
              <Progress
                // eslint-disable-next-line no-eval
                percent={eval(data.level_progress)}
                status="active"
                showInfo={false}
                style={{ width: "60%", marginLeft: "5px", marginRight: "5px" }}
              />
            </Tooltip>
            <span className="text">Lvl {data.level + 1}</span>
          </Row>
        </Col>
        <Col style={{ width: "50%" }}>
          <Row style={{ marginTop: "30px" }} justify="center">
            <span className="friendHeader">
              {t(Translations.friends.lastAchievements)}
            </span>
          </Row>
          <Row justify="center" gutter={10}>
            {data.last_achievements.length === 0 ? (
              <EmptyDataRender
                customText={
                  <span className="text">
                    {t(Translations.friends.noAchievements)}
                  </span>
                }
              />
            ) : (
              data.last_achievements.map((achievement) => (
                <Col
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                  key={achievement.name}
                >
                  {achievement.icon && (
                    <img
                      src={achievement.icon}
                      width="50px"
                      height="50px"
                      alt="Achievement Icon"
                      style={{
                        borderRadius: "50%",
                      }}
                    />
                  )}
                  {!achievement.icon && <Medal type="unknown" size="small" />}
                  <span className="text">{achievement.name}</span>
                </Col>
              ))
            )}
          </Row>
          <Row justify="center">
            <span
              className="friendHeader"
              style={{ display: "flex", alignItems: "center" }}
            >
              {t(Translations.friends.currentStreak)}:
              <span style={{ margin: "10px" }}>{data.streak}</span>
              <Emoji name="fire" width={40} />
            </span>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default BigFriendCard;
