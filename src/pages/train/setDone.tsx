import React from "react";
import { statsType } from ".";

interface setDoneProps {
  stats: statsType;
}

const SetDone: React.FC<setDoneProps> = ({ ...setDoneProps }) => {
  const { stats } = setDoneProps;

  return <></>;
};

export default SetDone;
