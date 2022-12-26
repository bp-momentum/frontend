import { NormalizedLandmarkList } from "@mediapipe/pose";

/**
 * All the properties of an exercise.
 */
export interface Exercise {
  activated: boolean;
  description: string;
  title: string;
  video: string;
  expectation: NormalizedLandmarkList[];
}
