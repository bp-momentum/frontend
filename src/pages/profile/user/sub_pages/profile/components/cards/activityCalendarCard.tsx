import Text from "antd/lib/typography/Text";
import Translations from "@localization/translations";
import { Calendar, Card, Col, Popover, Row } from "antd";
import {
  LeftOutlined,
  RightOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  useGetDoneExercisesInMonthQuery,
  useGetExerciseByIdQuery,
} from "@redux/api/api";
import { round } from "lodash";

interface Props {
  month: number;
  year: number;
  date: Date;
  currentMonth: number;
}

/**
 * A component for a single date in the calendar.
 * @param {Props} props   the date, the month and the year
 * @returns {JSX.Element} a component for a single date in the calendar
 */
const DateCell: React.FC<Props> = ({
  month,
  year,
  date,
  currentMonth,
}: Props): JSX.Element => {
  const { data } = useGetDoneExercisesInMonthQuery({
    month: month + 1,
    year: year,
  });

  const exercises: {
    date: number;
    exercise_plan_id: number;
    id: number;
    points: number | null;
    done: boolean | undefined;
  }[] = data && data.data && data.data.done ? data.data.done : [];

  const daysExercises = exercises.filter((e) => {
    const d = new Date(e.date * 1000);
    return d.toDateString() === date.toDateString();
  });
  const doneExercises = daysExercises.filter((e) => e.done ?? e.points !== 0);
  const openExercises = daysExercises.filter((e) => !e.done ?? e.points === 0);

  const allDone = openExercises.length === 0;
  const nothingDone = doneExercises.length === 0;
  const percent =
    daysExercises.length === 0
      ? 0
      : round((doneExercises.length / daysExercises.length) * 100);

  const isToday = (): boolean => {
    return date.toDateString() === new Date().toDateString();
  };

  const getTextColor = () => {
    if (month !== currentMonth) {
      return "gray";
    }
    if (daysExercises.length === 0) {
      return "black";
    }
    if (allDone) {
      return "green";
    }
    if (nothingDone) {
      return "red";
    }
    return "orange";
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
        {date.getDate()}
      </div>
    </div>
  );

  if (daysExercises.length === 0) {
    return text;
  }

  return (
    <Popover
      color={"white"}
      trigger="click"
      title={<Text>{date.toLocaleDateString() + " - " + percent + "%"}</Text>}
      content={
        <Col>
          {daysExercises.map((e) => {
            return (
              <ExerciseName
                key={e.exercise_plan_id}
                id={e.id}
                points={e.points}
                done={e.done ?? e.points !== 0}
              />
            );
          })}
        </Col>
      }
    >
      {text}
    </Popover>
  );
};

/**
 * Displays the name of an exercise, the points achieved and whether it was done.
 * @param {Props} props   the id, the points and if the exercise was done
 * @returns {JSX.Element} the name of the exercise, the points and whether it was done
 */
const ExerciseName = (props: {
  id: number;
  points: number | null;
  done: boolean;
}): JSX.Element => {
  const { data, isLoading, isError, error } = useGetExerciseByIdQuery(props.id);
  const { t } = useTranslation();
  const text =
    data?.title +
    (props.done
      ? ": " + t(Translations.profile.points, { points: props.points })
      : "");
  return (
    <span style={{ whiteSpace: "nowrap" }}>
      <Col>
        <Text>
          <>
            {props.done ? (
              <CheckOutlined style={{ color: "green", paddingRight: "5px" }} />
            ) : (
              <CloseOutlined style={{ color: "red", paddingRight: "5px" }} />
            )}
            {isLoading
              ? t(Translations.exercises.loading)
              : isError
              ? error
              : text}
          </>
        </Text>
        <br />
      </Col>
    </span>
  );
};

/**
 * A calendar view which contains the exercise history of a user.
 * @returns {JSX.Element} a calendar view which contains the exercise history of a user
 */
const ActivityCalendarCard = (): JSX.Element => {
  const { t } = useTranslation();
  let currentMonthViewed = new Date().getMonth();

  const { refetch } = useGetDoneExercisesInMonthQuery({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          return (
            <div style={{ padding: 8, color: "black" }}>
              <Row justify="space-between">
                <LeftOutlined
                  onClick={() => {
                    const newDate = value.clone().subtract(1, "month");
                    onChange(newDate);
                  }}
                />
                <Text style={{ fontSize: 20, marginTop: -8 }}>
                  {value.format("MM YYYY")}
                </Text>
                <RightOutlined
                  onClick={() => {
                    const newDate = value.clone().add(1, "month");
                    onChange(newDate);
                  }}
                />
              </Row>
            </div>
          );
        }}
        fullCellRender={(date) => (
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
