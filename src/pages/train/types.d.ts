interface DataEntryType {
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

interface Feedback {
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

interface StatsType {
  data: dataEntryType[];
  setAverages: dataEntryType[];
  set: number;
  totalPoints: number;
}

type audioCategory = "good" | "better" | "best" | "perfect";
