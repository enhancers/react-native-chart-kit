export interface Dataset {
  /** The data corresponding to the x-axis label. */
  data: number[];
  /** A function returning the color of the stroke given an input opacity value. */
  color?: (opacity: number) => string;
  /** The width of the stroke. Defaults to 2. */
  strokeWidth?: number;
}

export interface ChartData {
  /** The x-axis labels */
  labels: string[];
  datasets: Dataset[];
}
