import Helper from "../../util/helper";

const dayOrder = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export const isPast = (dayName: string): boolean => {
  const currentDayName = Helper.getCurrentDayName();
  return dayOrder.indexOf(dayName) < dayOrder.indexOf(currentDayName);
};

export const isFuture = (dayName: string): boolean => {
  const currentDayName = Helper.getCurrentDayName();
  return dayOrder.indexOf(dayName) > dayOrder.indexOf(currentDayName);
};
