import Helper from "@util/helper";

const dayOrder = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

/**
 * Checks if a day with a given name lays in the past.
 * @param dayName  the name of the day to check
 */
export const isPast = (dayName: string): boolean => {
  const currentDayName = Helper.getCurrentDayName();
  return dayOrder.indexOf(dayName) < dayOrder.indexOf(currentDayName);
};

/**
 * Checks if a day with a given name lays in the future.
 * @param dayName  the name of the day to check
 */
export const isFuture = (dayName: string): boolean => {
  const currentDayName = Helper.getCurrentDayName();
  return dayOrder.indexOf(dayName) > dayOrder.indexOf(currentDayName);
};
