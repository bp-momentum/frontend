const totalPointsCalculation = (
  intensity: number,
  accuracy: number,
  speed: number
): number => {
  return Math.floor((intensity + accuracy + speed) / 3);
};

const calculatePoints = (points: Points[], set: number): dataEntryType[] => {
  const intensity = Math.floor(
    points.reduce((acc, curr) => acc + curr.intensity, 0) / points.length
  );

  const accuracy = Math.floor(
    points.reduce((acc, curr) => acc + curr.accuracy, 0) / points.length
  );

  const speed = Math.floor(
    points.reduce((acc, curr) => acc + curr.speed, 0) / points.length
  );

  const pts: dataEntryType[] = [
    {
      type: "Intensity",
      set: set.toString(),
      performance: intensity,
    },
    {
      type: "Accuracy",
      set: set.toString(),
      performance: accuracy,
    },
    {
      type: "Speed",
      set: set.toString(),
      performance: speed,
    },
  ];

  return pts;
};

export const initCallback = (
  data: Record<string, any>,
  stats: React.MutableRefObject<statsType>,
  setCurrentSet: React.Dispatch<React.SetStateAction<number>>
): void => {
  setCurrentSet(data.current_set + 1);
  stats.current.set = data.current_set + 1;
};

export const statsCallback = (
  data: Record<string, any>,
  points: Points[],
  setProgress: React.Dispatch<React.SetStateAction<number>>,
  repeats: number,
  currentRepeat: React.MutableRefObject<number>,
  setFeedback: React.Dispatch<React.SetStateAction<feedback>>,
  totalPoints: React.MutableRefObject<number>,
  setIsFeedbackNew: React.Dispatch<React.SetStateAction<boolean>>
): void => {
  const total = totalPointsCalculation(
    data.intensity,
    data.cleanliness,
    data.speed
  );

  points.push({
    intensity: data.intensity,
    accuracy: data.cleanliness,
    speed: data.speed,
    total: total,
  });
  currentRepeat.current++;
  setProgress((currentRepeat.current / repeats) * 100);
  setFeedback({
    x: data.x,
    y: data.y,
    addedPoints: total,
    totalPoints: totalPoints.current + total,
  });
  setIsFeedbackNew(true);
};

export const endCallback = (
  stats: statsType,
  setActive: React.Dispatch<React.SetStateAction<boolean>>,
  setSubPage: React.Dispatch<React.SetStateAction<subPage>>,
  points: Points[]
): void => {
  setActive(false);
  stats.data = stats.data.concat(calculatePoints(points, stats.set));
  stats.totalPoints += points.reduce((acc, curr) => acc + curr.total, 0);
  setTimeout(() => setSubPage("setDone"), 2000);
};

export const doneCallback = (
  stats: statsType,
  setActive: React.Dispatch<React.SetStateAction<boolean>>,
  setSubPage: React.Dispatch<React.SetStateAction<subPage>>,
  points: Points[]
): void => {
  setActive(false);
  stats.data = stats.data.concat(calculatePoints(points, stats.set));
  stats.totalPoints += points.reduce((acc, curr) => acc + curr.total, 0);
  setTimeout(() => setSubPage("exerciseDone"), 2000);
};
