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
 * @param {DoneExercise} exercise  the {@link Exercise} to calculate.
 * @returns {number} the approximate duration to complete the {@link Exercise} in seconds.
 */
const getApproximateExerciseDurationSeconds = (
  exercise: DoneExercise
): number => {
  return exercise.sets * 30 + exercise.sets * exercise.repeats_per_set * 10;
};

/**
 * Calculates the approximate duration to complete a given {@link Exercise} in minutes.
 * @param {DoneExercise} exercise  the {@link Exercise} to calculate.
 * @returns {number} the approximate duration to complete the {@link Exercise} in minutes.
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
