import React from "react";
import { Col, Row } from "antd";
import { Droppable } from "react-beautiful-dnd";
import { t } from "i18next";
import Translations from "@localization/translations";
import Exercise from "../components/exercise";

interface dayProps {
  list: ExerciseCardData[];
  name: string;
  displayName: string;
  exercises: Exercise[];
  openState: string;
  setOpenState: React.Dispatch<React.SetStateAction<string>>;
}

/**
 * A droppable context for the exercise cards that shows all exercises given
 * @param {list: ExerciseCardData[], name: string, displayName: string} props
 * @returns a droppable context for the exercise cards
 */
const Day: React.FC<dayProps> = ({ ...props }) => {
  const { list, name, displayName, exercises, openState, setOpenState } = props;

  return (
    <Col>
      <h1>{displayName}</h1>
      <Row
        style={{
          background: "#fff",
          display: "grid",
          borderRadius: "10px",
          marginBottom: "20px",
          minWidth: "200px",
        }}
      >
        <Droppable droppableId={name}>
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={{
                gridRowStart: 1,
                gridColumnStart: 1,
                width: "200px",
                minHeight: "20px",
                padding: "10px",
                maxHeight: "400px",
                overflowY: "auto",
                overflowX: "hidden",
              }}
            >
              {list.map((item, index) => (
                <Exercise
                  key={item.id}
                  item={{ ...item }}
                  index={index}
                  details={true}
                  exercises={exercises}
                  openState={openState}
                  setOpenState={setOpenState}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        {list.length === 0 && (
          <div
            style={{
              gridRowStart: 1,
              gridColumnStart: 1,
              margin: "10px",
              width: "180px",
              padding: "20px",
              textAlign: "center",
              border: "2px dashed gray",
              borderRadius: "20px",
              userSelect: "none",
            }}
          >
            {t(Translations.planEditor.addExercise)}
          </div>
        )}
      </Row>
    </Col>
  );
};

export default Day;
