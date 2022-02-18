import React from "react";
import { Draggable } from "react-beautiful-dnd";
import VisibleExercise from "./visibleExercise";

interface exerciseProps {
  item: ExerciseCardData;
  index: number;
  details: boolean;
  exercises: Exercise[];
  openState: string;
  setOpenState: React.Dispatch<React.SetStateAction<string>>;
}

/**
 * Draggable wrapper for the VisibleExercise component
 * @param {item: ExerciseCardData, index: number, details: boolean} props
 * @returns draggable visible exercise card
 */
const Exercise: React.FC<exerciseProps> = ({ ...props }) => {
  const { item, index, details, exercises, openState, setOpenState } = props;

  return (
    <Draggable key={item.id} draggableId={item.id} index={index}>
      {(provided) => (
        <div
          onClick={(event) => {
            let target = event.target as HTMLElement;
            while (
              !target.classList.contains("ant-card-body") &&
              !target.classList.contains("ant-card-head") &&
              target.parentElement
            ) {
              target = target.parentElement;
            }
            if (target.classList.contains("ant-card-head"))
              setOpenState(item.id === openState ? "" : item.id);
          }}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            ...provided.draggableProps.style,
            userSelect: "none",
            margin: "0 0 8px 0",
          }}
        >
          <VisibleExercise
            card={item.data}
            details={details}
            collapsed={openState !== item.id}
            exercises={exercises}
          />
        </div>
      )}
    </Draggable>
  );
};

export default Exercise;
