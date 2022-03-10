import Text from "antd/lib/typography/Text";
import Translations from "../../../../../localization/translations";
import { Calendar, Card, Col, Popover, Row } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  useGetDoneExercisesInMonthQuery,
  useGetExerciseByIdQuery,
} from "../../../../../redux/exercises/exerciseSlice";

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

  const isToday = (): boolean => {
    return props.date.toDateString() === new Date().toDateString();
  };

  const getTextColor = () => {
    if (props.month !== props.currentMonth) {
      return "gray";
    }
    if (doneExercises.length !== 0) {
      return "green";
    }
    return "black";
  };

  const text = (
    <div>
      <div
        style={{
          margin: "0 auto",
          width: "30px",
          height: "30px",
          borderRadius: "50%",
          borderColor: isToday() ? "#466995" : "transparent",
          borderStyle: "solid",
          borderWidth: "1px",
          color: getTextColor(),
        }}
      >
        {props.date.getDate()}
      </div>
    </div>
  );

  if (doneExercises.length === 0) {
    return text;
  }

  return (
    <Popover
      color={"white"}
      trigger="click"
      title={<Text>{props.date.toLocaleDateString()}</Text>}
      content={
        <Col>
          <ul
            style={{
              paddingLeft: "10px",
              marginBottom: "5px",
            }}
          >
            {doneExercises.map((e) => {
              return <ExerciseName key={e.id} id={e.id} points={e.points} />;
            })}
          </ul>
        </Col>
      }
    >
      {text}
    </Popover>
  );
};

const ExerciseName = (props: { id: number; points: number }): JSX.Element => {
  const { data, isLoading, isError, error } = useGetExerciseByIdQuery(props.id);
  const { t } = useTranslation();

  return (
    <li>
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
    </li>
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