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
  id: number;
  title: string;
  description: string;
  sets: number;
  repeatsPerSet: number;
  videoPath: string | null;
  expectation: NormalizedLandmarkList[];
}

interface StatsType {
  data: dataEntryType[];
  setAverages: dataEntryType[];
  set: number;
  totalPoints: number;
}

type audioCategory = "good" | "better" | "best" | "perfect";
