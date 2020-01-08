export interface Dataset<T = number> {
  /** The data corresponding to the x-axis label. */
  data: T[];
  /** A function returning the color of the stroke given an input opacity value. */
  color?: (opacity: number) => string;
  /** The width of the stroke. Defaults to 2. */
  strokeWidth?: number;
}

export interface ChartData<D extends Dataset<any> = Dataset<number>> {
  /** The x-axis labels */
  labels: string[];
  datasets: D[];
}
