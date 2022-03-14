import React from "react";
import { Achievement, getProgress, isDone } from "@api/achievement";
import Container from "../../../components/container";
import { Col, Progress, Row, Tooltip } from "antd";
import Medal from "@shared/medal";
import Text from "antd/lib/typography/Text";
import { CheckCircleOutlined } from "@ant-design/icons";
import _ from "lodash";

interface Props {
  achievement: Achievement;
}

/**
 * A card for displaying a given {@link Achievement}.
 * @param {Props} props The props for the component.
 * @returns {JSX.Element} The component.
 */
const AchievementCard: React.FC<Props> = ({
  achievement,
}: Props): JSX.Element => {
  const description = (
    <div
      style={{
        width: "230px",
        height: "60px",
        display: "-webkit-box",
        maxHeight: "60px",
        WebkitLineClamp: "2",
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "break-spaces",
      }}
    >
      {_.truncate(achievement.description, { length: 50, separator: "..." })}
    </div>
  );

  return (
    <Container
      size={{ width: "350px", height: "140px" }}
      backgroundColor={achievement.level !== 0 ? undefined : "#E4E4E4"}
    >
      <Row style={{ height: "100%" }}>
        <div style={{ marginTop: "auto", marginBottom: "auto" }}>
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
        </div>
        <Col style={{ marginLeft: "20px", overflow: "hidden" }}>
          <Text style={{ fontSize: 25 }}>{achievement.title}</Text>
          <br />
          {achievement.description.length > 50 ? (
            <Tooltip title={achievement.description}>{description}</Tooltip>
          ) : (
            description
          )}
          <Progress
            style={{
              position: "absolute",
              bottom: "0",
            }}
            type="line"
            size="small"
            format={() =>
              isDone(achievement) ? (
                <CheckCircleOutlined style={{ color: "green" }} />
              ) : (
                achievement.progress
              )
            }
            status={isDone(achievement) ? "success" : "normal"}
            percent={getProgress(achievement)}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default AchievementCard;
