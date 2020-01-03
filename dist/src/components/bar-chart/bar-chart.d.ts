import React from 'react';
import {Color} from 'react-native-svg';
import ChartComponent, {
  BaseChartConfig,
  BaseChartProps,
} from '../abstracts/abstract-chart';
import {ChartData} from '../../types';
export interface BarChartConfig extends BaseChartConfig {
  /**
   * Defines the first color in the linear gradient of a chart's background
   */
  backgroundGradientFrom: Color;
  /**
   * Defines the second color in the linear gradient of a chart's background
   */
  backgroundGradientTo: Color;
  /**
   * Defines the percent (0-1) of the available width each bar width in a chart
   */
  barPercentage?: number;
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
export interface BarChartProps extends BaseChartProps<BarChartConfig> {
  data: ChartData;
  withHorizontalLabels?: boolean;
  withVerticalLabels?: boolean;
  verticalLabelRotation?: number;
  horizontalLabelRotation?: number;
  withInnerLines?: boolean;
}
export declare class BarChart<
  ChartProps extends BarChartProps = BarChartProps
> extends ChartComponent<ChartProps> {
  constructor(props: ChartProps);
  protected static getBarPercentage: (chartConfig: BarChartConfig) => number;
  protected renderBars(config: {
    data: number[];
    width: number;
    height: number;
    verticalLabelRotation: number;
    horizontalLabelRotation: number;
    paddingTop: number;
    paddingRight: number;
  }): React.ReactNode;
  protected renderBarTops(config: {
    data: number[];
    width: number;
    height: number;
    paddingTop: number;
    paddingRight: number;
  }): React.ReactNode;
  render(): React.ReactNode;
}
