import { DoneExercise } from "@api/doneExercise";

interface Avatar {
  skinColor: number;
  hairColor: number;
  hairStyle: number;
  eyeColor: number;
}

/**
 * Wrapper for the data being displayed on the user's profile.
 */
interface ProfileData {
  dailyRating: number;
  minutesTrainedGoal: number;
  doneExercises: DoneExercise[];
  accountCreated: number;
  motivation: string;
  avatar: Avatar;
  minutesTrained: number;
}
