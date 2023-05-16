import { NormalizedLandmark } from "@mediapipe/tasks-vision";

/**
 * All the properties of an exercise.
 */
export interface Exercise {
  activated: boolean;
  description: string;
  title: string;
  video: string;
  expectation: NormalizedLandmark[][];
}
