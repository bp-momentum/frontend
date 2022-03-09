import { parseInt } from "lodash";

export interface Achievement {
  name: string;
  description: string;
  level: number;
  progress: string;
  hidden: boolean;
  icon: string;
}

const isDone = (achievement: Achievement) => {
  return achievement.progress === "done";
};

const getProgress = (achievement: Achievement) => {
  if (isDone(achievement)) {
    return 1;
  }
  const progressSplit = achievement.progress.split("/");
  if (progressSplit.length !== 2) {
    return -1;
  }
  const done = parseInt(progressSplit[0]);
  const max = parseInt(progressSplit[1]);
  return done / max;
};

export { isDone, getProgress };
