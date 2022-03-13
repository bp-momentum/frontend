import React from "react";
import { Achievement, getProgress, isDone } from "@api/achievement";
import Container from "../../../components/container";
import { Col, Progress, Row } from "antd";
import Medal from "@shared/medal";
import Text from "antd/lib/typography/Text";

interface achievementCardProps {
  achievement: Achievement;
}

const AchievementCard: React.FC<achievementCardProps> = ({ ...props }) => {
  const { achievement } = props;

  return (
    <Container
      size={{ width: "350px", height: "130px" }}
      backgroundColor={isDone(achievement) ? undefined : "#E4E4E4"}
    >
      <Row>
        <div style={{ marginTop: "auto", marginBottom: "auto" }}>
          {achievement.icon && (
            <img
              src={achievement.icon}
              width="50px"
              height="50px"
              alt="Achievement Icon"
              style={{
                filter: isDone(achievement) ? undefined : "grayscale(100%)",
                borderRadius: "50%",
              }}
            />
          )}
          {!achievement.icon && <Medal type="unknown" size="small" />}
        </div>
        <Col style={{ marginLeft: "20px", overflow: "hidden" }}>
          <Text style={{ fontSize: 25 }}>{achievement.title}</Text>
          <br />
          <div style={{ width: "230px" }}>{achievement.description}</div>
          <Progress
            style={{ marginTop: "5px", marginBottom: "5px" }}
            type="line"
            size="small"
            format={() => (isDone(achievement) ? "" : achievement.progress)}
            status={isDone(achievement) ? "success" : "normal"}
            percent={isDone(achievement) ? 100 : getProgress(achievement)}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default AchievementCard;
