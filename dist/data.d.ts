declare const data: {
  labels: string[];
  datasets: (
    | {
        data: number[];
        color: (opacity?: number) => string;
      }
    | {
        data: number[];
        color?: undefined;
      }
  )[];
  legend: string[];
};
declare const contributionData: {
  date: string;
  count: number;
}[];
declare const pieChartData: {
  name: string;
  population: number;
  color: string;
  legendFontColor: string;
  legendFontSize: number;
}[];
declare const progressChartData: {
  labels: string[];
  data: number[];
};
declare const stackedBarGraphData: {
  labels: string[];
  legend: string[];
  data: number[][];
  barColors: string[];
};
export {
  data,
  contributionData,
  pieChartData,
  progressChartData,
  stackedBarGraphData,
};
