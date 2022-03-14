import { DoneExercise } from "@api/done_exercise";

/**
 * Wrapper for the data being displayed on the user's profile.
 */
interface ProfileData {
  dailyRating: number;
  minutesTrainedGoal: number;
  doneExercises: DoneExercise[];
  accountCreated: number;
  motivation: string;
  trainerName: string;
  trainerAddress: string;
  trainerPhone: string;
  trainerEmail: string;
  avatarId: number;
  minutesTrained: number;
  level: number;
  levelProgress: string;
}
