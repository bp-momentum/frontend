import React from "react";

interface hiddenAchievementCardProps {
  count: number;
}

const HiddenAchievementCard: React.FC<hiddenAchievementCardProps> = ({
  ...props
}) => {
  const { count } = props;

  return <>{count}</>;
};

export default HiddenAchievementCard;
