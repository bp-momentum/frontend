export interface DoneExercise {
  id: number;
  date: string;
  done: boolean;
  sets: number;
  repeats_per_set: number;
  exercise_plan_id: number;
  name?: string;
}

const getApproximateExerciseDurationSeconds = (
  exercise: DoneExercise
): number => {
  return exercise.sets * 30 + exercise.sets * exercise.repeats_per_set * 10;
};
const getApproximateExerciseDurationMinutes = (
  exercise: DoneExercise
): number => {
  return Math.ceil(getApproximateExerciseDurationSeconds(exercise) / 60);
};

export {
  getApproximateExerciseDurationMinutes,
  getApproximateExerciseDurationSeconds,
};
