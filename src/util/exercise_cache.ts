import api from "./api";
import Routes from "./routes";
import { Exercise } from "../api/exercise";

interface CacheEntry {
  lastUpdated: number;
  id: number;
  exercise: Exercise;
}

class Cache {
  private entries: CacheEntry[] = [];

  private static timeoutDuration = 1800000;

  private getCacheEntry = (id: number): CacheEntry | undefined => {
    return this.entries.find((e) => e.id === id);
  };

  private fetchExercise = async (id: number): Promise<Exercise> => {
    const response = await api.execute(
      Routes.getExercise({ id: id.toString() })
    );
    if (!response.success) {
      return {
        title: "",
        description: "",
        activated: false,
        video: "",
      };
    }
    return response.data as Exercise;
  };

  getExerciseFromId = async (id: number): Promise<Exercise> => {
    const entry = this.getCacheEntry(id);
    if (!entry) {
      const exercise = await this.fetchExercise(id);
      this.entries.push({
        id: id,
        exercise: exercise,
        lastUpdated: Date.now(),
      });
      return exercise;
    }
    if (Date.now() - entry.lastUpdated > Cache.timeoutDuration) {
      const exercise = await this.fetchExercise(id);
      entry.lastUpdated = Date.now();
      entry.exercise = exercise;
      return exercise;
    }
    return entry.exercise;
  };

  getExerciseNameFromId = async (id: number): Promise<string> => {
    return (await this.getExerciseFromId(id)).title;
  };
}

const ExerciseCache = new Cache();

export default ExerciseCache;
