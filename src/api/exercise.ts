/**
 * All the properties of an exercise.
 */
export interface Exercise {
  id: number,
  sets: number,
  repeats_per_set: number,
  date: string,
  activated: boolean,
  description: string,
  title: string,
  video: string,
}
