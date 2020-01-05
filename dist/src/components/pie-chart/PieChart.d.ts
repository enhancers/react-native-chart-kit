import React from 'react';
import {Color} from 'react-native-svg';
import ChartComponent, {
  BaseChartConfig,
  BaseChartProps,
} from '../abstracts/abstract-chart';
export interface PieChartData {
  name: string;
  color: Color;
  legendFontColor: Color;
  legendFontSize: number;
}
export interface PieChartConfig extends BaseChartConfig {
  /**
   * Defines the first color in the linear gradient of a chart's background
   */
  backgroundGradientFrom: Color;
  /**
   * Defines the second color in the linear gradient of a chart's background
   */
  backgroundGradientTo: Color;
  /**
   * Defines the first color opacity in the linear gradient of a chart's background
   */
  backgroundGradientFromOpacity?: number;
  /**
   * Defines the second color opacity in the linear gradient of a chart's background
   */
  backgroundGradientToOpacity?: number;
  fillShadowGradient?: Color;
  fillShadowGradientOpacity?: number;
}
export interface PieChartProps extends BaseChartProps<PieChartConfig> {
  absolute?: false;
  hasLegend?: true;
  center?: [number, number];
  data: PieChartData[];
  accessor: string;
}
export declare class PieChart<
  ChartProps extends PieChartProps = PieChartProps
> extends ChartComponent<ChartProps> {
  constructor(props: ChartProps);
  render(): React.ReactNode;
}
