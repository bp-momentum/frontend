interface dataEntryType {
  type: "Intensity" | "Accuracy" | "Speed";
  set: string;
  performance: number;
}

interface Points {
  intensity: number;
  accuracy: number;
  speed: number;
  total: number;
}

type subPage = "training" | "setDone" | "exerciseDone";

interface feedback {
  x: number;
  y: number;
  addedPoints: number;
  totalPoints: number;
}

interface ExerciseData {
  title: string;
  description: string;
  sets: number;
  repeatsPerSet: number;
  videoPath: string | null;
  activated: boolean;
}

interface statsType {
  data: dataEntryType[];
  setAverages: dataEntryType[];
  set: number;
  totalPoints: number;
}
