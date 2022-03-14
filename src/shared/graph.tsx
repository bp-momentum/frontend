import { Line, LineConfig } from "@ant-design/plots";
import React from "react";

interface graphData {
  type: string;
  set: string;
  performance: number;
}

interface graphProps {
  width?: number;
  data: graphData[];
  setSize: number;
  style?: React.CSSProperties;
}

const Graph: React.FC<graphProps> = ({ ...props }) => {
  const { width, data, setSize, style } = props;
  const maxWidth = width ? `${width}px` : "400px";

  const config: LineConfig = {
    data,
    xField: "set",
    yField: "performance",
    seriesField: "type",
    xAxis: {
      label: {
        formatter: (value: string) => `Set ${value.split("-")[0]}`,
        style: {
          fill: "#fff",
          fontSize: 15,
        },
      },
      tickInterval: setSize,
      tickCount: Math.floor(data.length / 3 / setSize),
    },
    yAxis: {
      label: {
        style: {
          fill: "#fff",
          fontSize: 15,
        },
      },
      max: 100,
    },
    tooltip: {
      showTitle: false,
    },
    legend: false,
    smooth: true,
    animation: {
      appear: {
        animation: "path-in",
        duration: 5000,
      },
    },
    width: 400,
    height: 200,
    color: ["#f00", "#0e0", "#ffd356"],
  };

  return <Line {...config} style={{ width: maxWidth, ...style }} />;
};

export default Graph;
