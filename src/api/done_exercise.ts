/**
 * Wrapper for the JSON document returned by {@link Routes.getDoneExercises()}.
 */
export interface DoneExercise {
  id: number;
  date: string;
  done: boolean;
  sets: number;
  repeats_per_set: number;
  exercise_plan_id: number;
  name?: string;
}

/**
 * Calculates the approximate duration to complete a given {@link Exercise} in seconds.
 * @param exercise  the {@link Exercise} to calculate.
 */
const getApproximateExerciseDurationSeconds = (
  exercise: DoneExercise
): number => {
  return exercise.sets * 30 + exercise.sets * exercise.repeats_per_set * 10;
};

/**
 * Calculates the approximate duration to complete a given {@link Exercise} in minutes.
 * @param exercise  the {@link Exercise} to calculate.
 */
const getApproximateExerciseDurationMinutes = (
  exercise: DoneExercise
): number => {
  return Math.ceil(getApproximateExerciseDurationSeconds(exercise) / 60);
};

export {
  getApproximateExerciseDurationMinutes,
  getApproximateExerciseDurationSeconds,
};
