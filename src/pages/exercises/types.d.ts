interface Exercise {
  id: number;
  exercise_plan_id?: number;
  sets: number;
  repeats_per_set: number;
  date: string;
  done?: boolean;
}
