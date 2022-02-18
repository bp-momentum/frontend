interface Exercise {
  id: number;
  title: string;
}

/**
 * All data a single exercise instance can have
 */
interface ExerciseData {
  type: number;
  sets: number;
  repeats: number;
}

// All data a single exercise card instance can have
interface ExerciseCardData {
  id: string;
  data: ExerciseData;
}
