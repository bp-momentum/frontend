import React from "react";
import { Achievement } from "@api/achievement";

interface achievementCardProps {
  achievement: Achievement;
}

const AchievementCard: React.FC<achievementCardProps> = ({ ...props }) => {
  const { achievement } = props;

  return <>{achievement.name}</>;
};

export default AchievementCard;
