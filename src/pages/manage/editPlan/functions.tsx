import React from "react";
import { DraggableLocation } from "react-beautiful-dnd";

/**
 * Truncate a string with ellipsis if it is too long
 * @param str
 * @param num
 * @returns truncated string
 */
export const truncate = (str: string, n: number) => {
  return str?.length > n ? str.substr(0, n - 1) + "..." : str;
};

/**
 * Maps a given exercise id to its corresponding name
 * @param id
 * @returns the name of the exercise
 */
export const exerciseIdToName = (exercises: Exercise[], id: number) =>
  truncate(
    exercises
      .filter((exercise) => exercise.id === id)
      .map((exercise) => exercise.title)[0],
    15
  ) ?? <i>Unknown</i>;

/**
 * Reorders the two given lists based on the given indexes
 *
 * If source and destination are the same, the list is reordered
 *
 * If the source is the store, the item is duplicated from the store and added to the destination
 *
 * If the destination is the store, the item is removed from the source and destroyed
 *
 * If neither the source nor the destination is the store, the item is moved from the source to the destination
 *
 * It always returns the source list and the destination list after the reordering
 *
 * @param listLeave the list from which the item is moved
 * @param listJoin the list to which the item is moved
 * @param source the source location and index of the item
 * @param dest the destination location and index of the item
 * @returns {leave: ExerciseCardData[], join: ExerciseCardData[]}
 */
export const reorder = (
  listLeave: ExerciseCardData[],
  listJoin: ExerciseCardData[],
  source: DraggableLocation,
  dest: DraggableLocation,
  count: number,
  setCount: React.Dispatch<React.SetStateAction<number>>
): { leave: ExerciseCardData[]; join: ExerciseCardData[] } => {
  const leaveArr = Array.from(listLeave);
  const joinArr = Array.from(listJoin);
  const fromStore = source.droppableId === "store";
  const toStore = dest.droppableId === "store";

  // easy if in same list (just reorder)
  if (source.droppableId === dest.droppableId) {
    const item = leaveArr.splice(source.index, 1)[0];
    leaveArr.splice(dest.index, 0, item);
    return { leave: leaveArr, join: leaveArr };
  }

  // remove from source when moving to store
  if (toStore) {
    leaveArr.splice(source.index, 1);
    return { leave: leaveArr, join: joinArr };
  }

  // duplicate item when leaving store
  if (fromStore) {
    setCount(count + 1);
    const data = leaveArr[source.index].data;
    const item = { id: `exercise-${count}`, data: { ...data } };
    joinArr.splice(dest.index, 0, item);
    return { leave: leaveArr, join: joinArr };
  }

  // move from list to list (not store)
  const item = leaveArr.splice(source.index, 1)[0];
  joinArr.splice(dest.index, 0, item);
  return { leave: leaveArr, join: joinArr };
};
