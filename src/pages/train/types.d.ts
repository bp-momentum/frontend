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
