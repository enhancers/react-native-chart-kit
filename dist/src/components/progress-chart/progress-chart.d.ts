import React from 'react';
import {Color} from 'react-native-svg';
import ChartComponent, {
  BaseChartConfig,
  BaseChartProps,
} from '../abstracts/abstract-chart';
export declare type ProgressChartData =
  | number[]
  | {
      labels?: string[];
      data: number[];
    };
interface ProgressChartConfig extends BaseChartConfig {
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
export interface ProgressChartProps
  extends BaseChartProps<ProgressChartConfig> {
  data: ProgressChartData;
  hideLegend: boolean;
}
export declare class ProgressChart<
  ChartProps extends ProgressChartProps = ProgressChartProps
> extends ChartComponent<ChartProps> {
  constructor(props: ChartProps);
  render(): React.ReactNode;
}
export {};
