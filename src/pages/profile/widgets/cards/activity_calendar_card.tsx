import Text from "antd/lib/typography/Text";
import Translations from "../../../../localization/translations";
import { Calendar, Card, Col, Row, Tooltip } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  useGetDoneExercisesInMonthQuery,
  useGetExerciseByIdQuery,
} from "../../../../redux/exercises/exerciseSlice";

interface dateCellProps {
  month: number;
  year: number;
  date: Date;
  currentMonth: number;
}

const DateCell: React.FC<dateCellProps> = ({ ...props }) => {
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

  const doneExercises = exercises.filter((e) => {
    const d = new Date(e.date * 1000);
    return d.toDateString() === props.date.toDateString();
  });
  const getTextColor = () => {
    if (props.month !== props.currentMonth) {
      return "gray";
    }
    const today = new Date();
    if (props.date.toDateString() === today.toDateString()) {
      return "#466995";
    }
    if (doneExercises.length !== 0) {
      return "green";
    }
    return "black";
  };
  const text = (
    <span
      style={{
        color: getTextColor(),
        borderRadius: "50%",
      }}
    >
      {props.date.getDate()}
    </span>
  );

  if (doneExercises.length === 0) {
    return text;
  }

  return (
    <Tooltip
      color={"white"}
      title={
        <Col>
          {doneExercises.map((e) => {
            return <ExerciseName key={e.id} id={e.id} points={e.points} />;
          })}
        </Col>
      }
    >
      {text}
    </Tooltip>
  );
};

const ExerciseName = (props: { id: number; points: number }): JSX.Element => {
  const { data, isLoading, isError, error } = useGetExerciseByIdQuery(props.id);
  const { t } = useTranslation();

  return (
    <span style={{ whiteSpace: "nowrap" }}>
      <Col>
        <Text>
          {isLoading
            ? t(Translations.exercises.loading)
            : isError
            ? error
            : data?.title +
              ": " +
              t(Translations.profile.points, { points: props.points })}
        </Text>
        <br />
      </Col>
    </span>
  );
};

const ActivityCalendarCard = (): JSX.Element => {
  const { t } = useTranslation();
  let currentMonthViewed = new Date().getMonth();

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
        onChange={(date) => (currentMonthViewed = date.month())}
        mode="month"
        style={{
          marginTop: "5px",
          height: "300px",
          backgroundColor: "#EDEDF4",
          color: "transparent",
        }}
        fullscreen={false}
        headerRender={({ value, onChange }) => {
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
            currentMonth={currentMonthViewed}
          />
        )}
      />
    </Card>
  );
};

export default ActivityCalendarCard;
