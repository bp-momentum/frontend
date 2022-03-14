import React, { MutableRefObject } from "react";
import { DraggableLocation } from "react-beautiful-dnd";

/**
 * Truncate a string with ellipsis if it is too long
 * @param {string} str
 * @param {number} n
 * @returns {string}
 */
export const truncate = (str: string, n: number): string => {
  return str?.length > n ? str.substring(0, n - 1) + "…" : str;
};

/**
 * Maps a given exercise id to its corresponding name
 * @param {Exercise[]} exercises
 * @param {number} id
 * @returns {string}
 */
export const exerciseIdToName = (exercises: Exercise[], id: number): string =>
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
 * @param {ExerciseCardData[]} listLeave the list from which the item is moved
 * @param {ExerciseCardData[]} listJoin the list to which the item is moved
 * @param {DraggableLocation} source the source location and index of the item
 * @param {DraggableLocation} dest the destination location and index of the item
 * @param {MutableRefObject<number>} count the number of all items to generate unique ids
 * @returns {leave: ExerciseCardData[], join: ExerciseCardData[]}
 */
export const reorder = (
  listLeave: ExerciseCardData[],
  listJoin: ExerciseCardData[],
  source: DraggableLocation,
  dest: DraggableLocation,
  count: MutableRefObject<number>
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
    count.current += 1;
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
