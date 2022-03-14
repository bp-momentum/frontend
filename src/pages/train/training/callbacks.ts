import config from "@config";
import React from "react";

/**
 * Calculates the average of the given points
 * @param {number} intensity intensity
 * @param {number} accuracy accuracy
 * @param {number} speed speed
 * @returns {number} average of intensity, accuracy and speed
 */
const totalPointsCalculation = (
  intensity: number,
  accuracy: number,
  speed: number
): number => {
  return Math.floor((intensity + accuracy + speed) / 3);
};

/**
 * Calculate points for the graph component
 * @param {Points[]} points array of points
 * @param {number} set number of set
 * @returns {DataEntryType[]} array of points for the graph component
 */
const calculatePoints = (points: Points[], set: number): DataEntryType[] => {
  const intensity = Math.floor(
    points.reduce((acc, curr) => acc + curr.intensity, 0) / points.length
  );

  const accuracy = Math.floor(
    points.reduce((acc, curr) => acc + curr.accuracy, 0) / points.length
  );

  const speed = Math.floor(
    points.reduce((acc, curr) => acc + curr.speed, 0) / points.length
  );

  return [
    {
      type: "Intensity",
      set: set.toString(),
      performance: intensity,
    },
    {
      type: "Accuracy",
      set: set.toString(),
      performance: accuracy,
    },
    {
      type: "Speed",
      set: set.toString(),
      performance: speed,
    },
  ];
};

const getStatsPoints = (points: Points[], set: number): DataEntryType[] => {
  const entries: DataEntryType[][] = points.map((p, i) => [
    {
      type: "Intensity",
      set: set.toString() + "-" + i,
      performance: Math.round(p.intensity),
    },
    {
      type: "Accuracy",
      set: set.toString() + "-" + i,
      performance: Math.round(p.accuracy),
    },
    {
      type: "Speed",
      set: set.toString() + "-" + i,
      performance: Math.round(p.speed),
    },
  ]);

  return entries.flat();
};

/**
 * Initialize the set data and stats for a new set
 * @param {Record<string, any>} data set data
 * @param {React.MutableRefObject<StatsType>} stats stats
 * @param {React.Dispatch<React.SetStateAction<number>>} setCurrentSet set current set
 * @returns {void}
 */
export const initCallback = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>,
  stats: React.MutableRefObject<StatsType>,
  setCurrentSet: React.Dispatch<React.SetStateAction<number>>
): void => {
  setCurrentSet(data.current_set + 1);
  stats.current.set = data.current_set + 1;
};

interface StatsCallbackProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>;
  points: Points[];
  setProgress: React.Dispatch<React.SetStateAction<number>>;
  repeats: number;
  currentRepeat: React.MutableRefObject<number>;
  setFeedback: React.Dispatch<React.SetStateAction<Feedback>>;
  totalPoints: React.MutableRefObject<number>;
  setIsFeedbackNew: React.Dispatch<React.SetStateAction<boolean>>;
  playRandomSound: (category: audioCategory) => void;
  audioFeedbackChance: React.MutableRefObject<number>;
}

/**
 * Handle points from the AI
 * @param {StatsCallbackProps} props callback props
 * @returns {void}
 */
export const statsCallback = ({
  data,
  points,
  setProgress,
  repeats,
  currentRepeat,
  setFeedback,
  totalPoints,
  setIsFeedbackNew,
  playRandomSound,
  audioFeedbackChance,
}: StatsCallbackProps): void => {
  const total = totalPointsCalculation(
    data.intensity,
    data.cleanliness,
    data.speed
  );

  points.push({
    intensity: data.intensity,
    accuracy: data.cleanliness,
    speed: data.speed,
    total: total,
  });
  currentRepeat.current++;
  setProgress((currentRepeat.current / repeats) * 100);
  setFeedback({
    x: data.x,
    y: data.y,
    addedPoints: total,
    totalPoints: totalPoints.current + total,
  });
  setIsFeedbackNew(true);
  if (Math.random() < audioFeedbackChance.current) {
    if (total <= config.audioThresholds.good * 100) {
      playRandomSound("good");
    } else if (total <= config.audioThresholds.better * 100) {
      playRandomSound("better");
    } else if (total <= config.audioThresholds.best * 100) {
      playRandomSound("best");
    } else {
      playRandomSound("perfect");
    }
    audioFeedbackChance.current = 0.2;
  } else {
    audioFeedbackChance.current += 0.2;
  }
};

/**
 * Handle the end of a set
 * @param {StatsType} stats stats
 * @param {React.Dispatch<React.SetStateAction<boolean>>} setActive set active
 * @param {React.Dispatch<React.SetStateAction<subPage>>} setSubPage set sub page
 * @param {Points[]} points points
 * @returns {void}
 */
export const endCallback = (
  stats: StatsType,
  setActive: React.Dispatch<React.SetStateAction<boolean>>,
  setSubPage: React.Dispatch<React.SetStateAction<subPage>>,
  points: Points[]
): void => {
  setActive(false);
  stats.data = stats.data.concat(getStatsPoints(points, stats.set));
  stats.setAverages = stats.setAverages.concat(
    calculatePoints(points, stats.set)
  );
  stats.totalPoints += points.reduce((acc, curr) => acc + curr.total, 0);
  setTimeout(() => setSubPage("setDone"), 2000);
};

/**
 * Handle the end of a training
 * @param {StatsType} stats stats
 * @param {React.Dispatch<React.SetStateAction<boolean>>} setActive set active
 * @param {React.Dispatch<React.SetStateAction<subPage>>} setSubPage set sub page
 * @param {Points[]} points points
 * @returns {void}
 */
export const doneCallback = (
  stats: StatsType,
  setActive: React.Dispatch<React.SetStateAction<boolean>>,
  setSubPage: React.Dispatch<React.SetStateAction<subPage>>,
  points: Points[]
): void => {
  setActive(false);
  stats.data = stats.data.concat(getStatsPoints(points, stats.set));
  stats.setAverages = stats.setAverages.concat(
    calculatePoints(points, stats.set)
  );
  stats.totalPoints += points.reduce((acc, curr) => acc + curr.total, 0);
  setTimeout(() => setSubPage("exerciseDone"), 2000);
};

/**
 * Handle information while training.
 * @param {string} information information
 * @param {React.Dispatch<React.SetStateAction<string | null>>} setInformation set information
 * @returns {void}
 */
export const informationCallback = (
  information: string,
  setInformation: React.Dispatch<React.SetStateAction<string | null>>
): void => {
  setInformation(information);
};
