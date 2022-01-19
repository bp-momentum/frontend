import Text from "antd/lib/typography/Text";
import Translations from "../../../../localization/translations";
import { Calendar, Card, Col, Row } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import Helper from "../../../../util/helper";
import React from "react";
import { useTranslation } from "react-i18next";
import { DoneExercise } from "../../../../api/done_exercise";

const ActivityCalendarCard = (props: {
  doneExercises: DoneExercise[];
}): JSX.Element => {
  const { t } = useTranslation();

  const stringToColour = (str: string): string => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = "#";
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff;
      color += value.toString(16).substring(-2);
    }
    return color;
  };

  return (
    <Card
      data-testid="activity-calendar"
      style={{
        marginTop: "40px",
        borderRadius: "5px",
        borderColor: "black",
        backgroundColor: "#EDEDF4",
        boxShadow: "2px 4px 4px 0 rgba(0, 0, 0, 0.25)",
      }}
    >
      <Text>{t(Translations.profile.chooseDate)}</Text>
      <Calendar
        mode="month"
        style={{
          marginTop: "5px",
          height: "300px",
          backgroundColor: "#EDEDF4",
          color: "transparent",
        }}
        fullscreen={false}
        headerRender={({ value, type, onChange, onTypeChange }) => {
          const localeData = value.localeData();
          return (
            <div style={{ padding: 8, color: "black" }}>
              <Row justify="space-between">
                <LeftOutlined
                  onClick={() => {
                    const newDate = value.clone();
                    newDate.subtract(1, "month");
                    onChange(newDate);
                  }}
                />
                <Text style={{ fontSize: 20, marginTop: -8 }}>
                  {localeData.months(value) + " " + value.year()}
                </Text>
                <RightOutlined
                  onClick={() => {
                    const newDate = value.clone();
                    newDate.add(1, "month");
                    onChange(newDate);
                  }}
                />
              </Row>
            </div>
          );
        }}
        dateFullCellRender={(date) => {
          const dayName = date
            .toDate()
            .toLocaleDateString("en-GB", { weekday: "long" })
            .toLowerCase();
          const doneExercises = props.doneExercises.filter(
            (e) =>
              e.done &&
              e.date === dayName &&
              Helper.getWeek(date.toDate()) === Helper.getCurrentWeek()
          );
          const text = (
            <Text
              style={{
                color:
                  date.toDate().toDateString() === new Date().toDateString()
                    ? "#466995"
                    : "black",
                borderRadius: "50%",
              }}
            >
              {date.date()}
            </Text>
          );
          return (
            <Col>
              {text}
              <Row justify="center">
                {doneExercises.length === 0 && (
                  <div
                    style={{
                      padding: "2px",
                      width: "5px",
                      height: "5px",
                    }}
                  />
                )}
                {doneExercises.length > 0 &&
                  doneExercises.map((e) => {
                    return (
                      <div
                        key={e.id}
                        style={{
                          padding: "2px",
                          width: "5px",
                          height: "5px",
                          backgroundColor: stringToColour(
                            e.date +
                              e.done +
                              e.repeats_per_set +
                              e.exercise_plan_id +
                              e.sets
                          ),
                          borderRadius: "50%",
                        }}
                      />
                    );
                  })}
              </Row>
            </Col>
          );
        }}
      />
    </Card>
  );
};

export default ActivityCalendarCard;
