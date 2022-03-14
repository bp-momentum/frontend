import { Card, Col, Row } from "antd";
import RatingStars from "../ratingStars";
import Translations from "@localization/translations";
import Text from "antd/lib/typography/Text";
import { ShareAltOutlined } from "@ant-design/icons";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  DoneExercise,
  getApproximateExerciseDurationMinutes,
} from "@api/doneExercise";
import Helper from "@util/helper";
import { useGetExerciseByIdQuery } from "@redux/exercises/exerciseSlice";

interface Props {
  rating: number;
  minutesTrained: number;
  minutesTrainedGoal: number;
  doneExercises: DoneExercise[];
  onClickShare: VoidFunction;
}

/**
 * A card containing a summary of the current day.
 * @param {Props} props The props for the component.
 * @returns {JSX.Element} The component.
 */
const DailySummaryCard: React.FC<Props> = ({
  rating,
  doneExercises,
  minutesTrained,
  minutesTrainedGoal,
  onClickShare,
}: Props): JSX.Element => {
  const { t, i18n } = useTranslation();

  const Exercise = (props: { exercise: DoneExercise }) => {
    const { data, isLoading, isError, error } = useGetExerciseByIdQuery(
      props.exercise.id
    );
    return (
      <Text>
        {isLoading
          ? t(Translations.exercises.loading)
          : isError
          ? error
          : data?.title}
        <br />
      </Text>
    );
  };

  return (
    <Card
      data-testid="daily-summary-card"
      style={{
        marginTop: "40px",
        borderRadius: "5px",
        backgroundColor: "#E6E7EA",
        boxShadow: "2px 4px 4px 0 rgba(0, 0, 0, 0.25)",
      }}
    >
      <Col>
        <Row justify="center" style={{ fontSize: 30 }}>
          {new Date().toLocaleDateString(i18n.language, {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </Row>
        <RatingStars rating={rating} />
        <Row justify="center" style={{ marginTop: "15px" }}>
          {t(Translations.profile.activeMinutes, {
            active: minutesTrained,
            goal: minutesTrainedGoal,
          })}
        </Row>
        <Row>
          <Col style={{ marginTop: "15px", marginLeft: "15px" }}>
            {doneExercises
              .filter((e) => e.done && e.date === Helper.getCurrentDayName())
              .map((e) => {
                return (
                  <Exercise
                    exercise={e}
                    key={e.id + e.date + e.done + e.sets}
                  />
                );
              })}
          </Col>
          <Col style={{ marginTop: "15px", marginLeft: "80px" }}>
            {doneExercises
              .filter((e) => e.done && e.date === Helper.getCurrentDayName())
              .map((e) => {
                return (
                  <Text key={e.id + e.date + e.done + e.sets}>
                    {getApproximateExerciseDurationMinutes(e)} min
                    <br />
                  </Text>
                );
              })}
          </Col>
        </Row>
        <Row justify="end">
          <ShareAltOutlined
            onClick={() => onClickShare()}
            style={{
              marginTop: "-15px",
              backgroundColor: "#EDEDF4",
              borderRadius: "50%",
              padding: "6px 7px 5px 5px",
            }}
          />
        </Row>
      </Col>
    </Card>
  );
};

export default DailySummaryCard;
