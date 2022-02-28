interface Exercise {
  id: number;
  title: string;
}

/**
 * All data a single exercise instance can have
 */
interface BasicExerciseData {
  type: number;
  sets: number;
  repeats: number;
}

// All data a single exercise card instance can have
interface ExerciseCardData {
  id: string;
  data: BasicExerciseData;
}

interface ExerciseInPlan {
  id: number;
  sets: number;
  repeats_per_set: number;
  date: string;
}
