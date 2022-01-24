import Text from "antd/lib/typography/Text";
import Translations from "../../../../localization/translations";
import { Calendar, Card, Col, Row } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import React from "react";
import { useTranslation } from "react-i18next";
import { useGetDoneExercisesInMonthQuery } from "../../../../redux/exercises/exerciseSlice";

const DateCell = (props: {
  month: number;
  year: number;
  date: Date;
}): JSX.Element => {
  const { data } = useGetDoneExercisesInMonthQuery({
    month: props.month + 1,
    year: props.year,
  });

  const exercises: {
    date: number;
    exercise_plan_id: number;
    id: number;
    points: number;
  }[] = data ? data.data.done : [];

  const stringToColor = (str: string): string => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
      hash = hash & hash;
    }
    if (hash < 0) {
      hash *= -1;
    }
    const mod = hash % 0xffffff;
    return "#" + mod.toString(16);
  };

  const doneExercises = exercises.filter((e) => {
    const d = new Date(e.date * 1000);
    return d.toDateString() === props.date.toDateString();
  });
  const text = (
    <Text
      style={{
        color:
          props.date.toDateString() === new Date().toDateString()
            ? "#466995"
            : "black",
        borderRadius: "50%",
      }}
    >
      {props.date.getDate()}
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
                key={e.date}
                style={{
                  padding: "2px",
                  width: "5px",
                  height: "5px",
                  backgroundColor: stringToColor(e.date.toString()),
                  borderRadius: "50%",
                }}
              />
            );
          })}
      </Row>
    </Col>
  );
};

const ActivityCalendarCard = (): JSX.Element => {
  const { t } = useTranslation();

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
        dateFullCellRender={(date) => (
          <DateCell
            month={date.month()}
            year={date.year()}
            date={date.toDate()}
          />
        )}
      />
    </Card>
  );
};

export default ActivityCalendarCard;
