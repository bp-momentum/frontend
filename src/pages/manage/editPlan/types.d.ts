interface Exercise {
  id: number;
  title: string;
}

/**
 * All data a single exercise instance can have
 */
interface ExerciseData2 {
  type: number;
  sets: number;
  repeats: number;
}

// All data a single exercise card instance can have
interface ExerciseCardData {
  id: string;
  data: ExerciseData2;
}

interface ExerciseInPlan {
  id: number;
  sets: number;
  repeats_per_set: number;
  date: string;
}
