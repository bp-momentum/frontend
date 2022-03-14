import { DoneExercise } from "@api/doneExercise";

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
