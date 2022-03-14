/**
 * Wrapper for the JSON document returned by {@link Routes.getMedals()}.
 */
export interface Medal {
  exercise: string;
  bronze: number;
  silver: number;
  gold: number;
}
