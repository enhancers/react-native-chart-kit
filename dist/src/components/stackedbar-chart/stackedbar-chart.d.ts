import React from 'react';
import {StyleProp, ViewStyle} from 'react-native';
import {Color} from 'react-native-svg';
import ChartComponent, {
  BaseChartConfig,
  BaseChartProps,
} from '../abstracts/abstract-chart';
export interface StackedBarChartData {
  labels: string[];
  legend: string[];
  data: number[][];
  barColors: string[];
}
export interface StackedBarChartConfig extends BaseChartConfig {
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
  barRadius?: number;
  fillShadowGradient?: Color;
  fillShadowGradientOpacity?: number;
}
export interface StackedBarChartProps
  extends BaseChartProps<StackedBarChartConfig> {
  style: StyleProp<ViewStyle>;
  data: StackedBarChartData;
  withHorizontalLabels?: boolean;
  withVerticalLabels?: boolean;
  hideLegend?: boolean;
}
export declare class StackedBarChart<
  ChartProps extends StackedBarChartProps = StackedBarChartProps
> extends ChartComponent<ChartProps> {
  constructor(props: ChartProps);
  protected getBarPercentage(): number;
  protected getBarRadius: (
    ret: React.ReactElement<
      any,
      | string
      | ((
          props: any,
        ) => React.ReactElement<
          any,
          string | any | (new (props: any) => React.Component<any, any, any>)
        > | null)
      | (new (props: any) => React.Component<any, any, any>)
    >[],
    x: number[],
  ) => number;
  protected renderBars(config: {
    width: number;
    height: number;
    data: number[][];
    colors: Color[];
    paddingTop: number;
    paddingRight: number;
    border: number;
  }): React.ReactNode;
  protected renderLegend(config: {
    legend: string[];
    colors: Color[];
    width: number;
    height: number;
  }): React.ReactNode;
  render(): React.ReactNode;
}
