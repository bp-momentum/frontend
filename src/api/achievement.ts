import { parseInt } from "lodash";

/**
 * Wrapper for the JSON document returned by {@link Routes.getAchievements()}.
 */
export interface Achievement {
  name: string;
  title: string;
  description: string;
  level: number;
  progress: string;
  hidden: boolean;
  icon?: string;
}

/**
 * Checks if the given {@link Achievement} is done.
 * @param {Achievement} achievement  the {@link Achievement} to check.
 * @returns {boolean} `true` if the {@link Achievement} is done, `false` otherwise.
 */
const isDone = (achievement: Achievement) => {
  return achievement.progress === "done";
};

/**
 * Parses the progress of the given {@link Achievement} to a number between 0 and 100 representing
 * the progress as percentage.
 * @param {Achievement} achievement  the {@link Achievement} to check.
 * @returns {number} the progress as percentage.
 */
const getProgress = (achievement: Achievement) => {
  if (isDone(achievement)) {
    return 100;
  }
  const progressSplit = achievement.progress.split("/");
  if (progressSplit.length !== 2) {
    return -1;
  }
  const done = parseInt(progressSplit[0]);
  const max = parseInt(progressSplit[1]);
  return (done / max) * 100;
};

export { isDone, getProgress };
