import React from "react";
import { Col, Row } from "antd";
import { Droppable } from "react-beautiful-dnd";
import Translations from "@localization/translations";
import Exercise from "../components/exercise";
import { useTranslation } from "react-i18next";

interface Props {
  list: ExerciseCardData[];
  name: string;
  displayName: string;
  exercises: Exercise[];
  openState: string;
  setOpenState: React.Dispatch<React.SetStateAction<string>>;
}

/**
 * A droppable context for the exercise cards that shows all exercises given
 * @param {Props} props The props for the component.
 * @returns {JSX.Element} The component.
 */
const Day: React.FC<Props> = ({
  list,
  name,
  displayName,
  exercises,
  openState,
  setOpenState,
}: Props): JSX.Element => {
  const { t } = useTranslation();

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
                  item={item}
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
