/**
 * All the properties of a friend.
 */
export interface Friend {
  username: string;
  level: number;
  level_progress: string;
  avatar: {
    hairStyle: number;
    hairColor: number;
    skinColor: number;
    eyeColor: number;
  };
  motivation: string;
  last_achievements: {
    name: string;
    icon: string;
  }[];
  last_login: string;
  days: number;
  flame_height: number;
}
