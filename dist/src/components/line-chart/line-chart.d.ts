import React from 'react';
import {StyleProp, ViewStyle} from 'react-native';
import {CircleProps, Color} from 'react-native-svg';
import {ChartData, Dataset} from '../../types';
import ChartComponent, {
  BaseChartConfig,
  BaseChartProps,
} from '../abstracts/abstract-chart';
export interface LineChartData extends ChartData {
  legend?: string[];
}
export interface LineChartConfig extends BaseChartConfig {
  strokeWidth?: number;
  propsForDots?: CircleProps;
  backgroundGradientFrom: Color;
  backgroundGradientTo: Color;
  fillShadowGradient?: string;
  fillShadowGradientOpacity?: number;
  backgroundGradientFromOpacity?: number;
  backgroundGradientToOpacity?: number;
}
export interface LineChartProps extends BaseChartProps<LineChartConfig> {
  /**
   * Data for the chart.
   *
   * Example from [docs](https://github.com/indiespirit/react-native-chart-kit#line-chart):
   *
   * ```javascript
   * const data = {
   *   labels: ['January', 'February', 'March', 'April', 'May', 'June'],
   *   datasets: [{
   *     data: [ 20, 45, 28, 80, 99, 43 ],
   *     color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
   *     strokeWidth: 2 // optional
   *   }],
   *   legend: ["Rainy Days", "Sunny Days", "Snowy Days"] // optional
   * }
   * ```
   */
  data: LineChartData;
  /**
   * Width of the chart, use 'Dimensions' library to get the width of your screen for responsive.
   */
  width: number;
  /**
   * Height of the chart.
   */
  height: number;
  /**
   * Show dots on the line - default: True.
   */
  withDots?: boolean;
  /**
   * Show shadow for line - default: True.
   */
  withShadow?: boolean;
  /**
   * Show inner dashed lines - default: True.
   */
  withInnerLines?: boolean;
  /**
   * Show outer dashed lines - default: True.
   */
  withOuterLines?: boolean;
  /**
   * Show vertical labels - default: True.
   */
  withVerticalLabels?: boolean;
  /**
   * Show horizontal labels - default: True.
   */
  withHorizontalLabels?: boolean;
  /**
   * Render charts from 0 not from the minimum value. - default: False.
   */
  fromZero?: boolean;
  /**
   * Configuration object for the chart, see example:
   *
   * ```javascript
   * const chartConfig = {
   *   backgroundGradientFrom: "#1E2923",
   *   backgroundGradientFromOpacity: 0,
   *   backgroundGradientTo: "#08130D",
   *   backgroundGradientToOpacity: 0.5,
   *   color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
   *   labelColor: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
   *   strokeWidth: 2, // optional, default 3
   *   barPercentage: 0.5
   * };
   * ```
   */
  chartConfig: LineChartConfig;
  /**
   * This function takes a [whole bunch](https://github.com/indiespirit/react-native-chart-kit/blob/master/src/line-chart.js#L266)
   * of stuff and can render extra elements,
   * such as data point info or additional markup.
   */
  decorator?: Function;
  /**
   * Callback that is called when a data point is clicked.
   */
  onDataPointClick?: (data: {
    index: number;
    value: number;
    dataset: Dataset;
    x: number;
    y: number;
    getColor: (opacity: number) => string;
  }) => void;
  /**
   * Style of the container view of the chart.
   */
  style?: StyleProp<ViewStyle>;
  /**
   * Add this prop to make the line chart smooth and curvy.
   *
   * [Example](https://github.com/indiespirit/react-native-chart-kit#bezier-line-chart)
   */
  bezier?: boolean;
  /**
   * Defines the dot color function that is used to calculate colors of dots in a line chart.
   * Takes `(dataPoint, dataPointIndex)` as arguments.
   */
  getDotColor?: (dataPoint: number, index: number) => string;
  /**
   * Rotation angle of the horizontal labels - default 0 (degrees).
   */
  horizontalLabelRotation?: number;
  /**
   * Rotation angle of the vertical labels - default 0 (degrees).
   */
  verticalLabelRotation?: number;
  /**
   * This function change the format of the display value of the Y label.
   * Takes the y value as argument and should return the desirable string.
   */
  formatYLabel?: (yValue: string) => string;
  /**
   * This function change the format of the display value of the X label.
   * Takes the X value as argument and should return the desirable string.
   */
  formatXLabel?: (xValue: string) => string;
  /**
   * Provide props for a data point dot.
   */
  getDotProps?: (dataPoint: number, index: number) => CircleProps;
  /**
   * Renders additional content for dots in a line chart.
   * Takes `({x, y, index})` as arguments.
   */
  renderDotContent?: (params: {
    x: number;
    y: number;
    index: number;
  }) => React.ReactNode;
}
export declare class LineChart<
  ChartProps extends LineChartProps = LineChartProps
> extends ChartComponent<ChartProps> {
  constructor(props: ChartProps);
  protected static getColor(
    props: LineChartProps,
    dataset: Dataset,
    opacity?: number,
  ): string;
  protected static getStrokeWidth(
    props: LineChartProps,
    dataset: Dataset,
  ): number;
  protected static getDatas(data: Dataset[]): number[];
  protected static getPropsForDots(
    props: LineChartProps,
    x: number,
    i: number,
  ): CircleProps;
  protected renderDots(config: {
    data: Dataset[];
    width: number;
    height: number;
    paddingTop: number;
    paddingRight: number;
    onDataPointClick?: (data: {
      index: number;
      value: number;
      dataset: Dataset;
      x: number;
      y: number;
      getColor: (opacity: number) => string;
    }) => void;
  }): React.ReactNode[];
  protected renderShadow(config: {
    data: Dataset[];
    width: number;
    height: number;
    paddingRight: number;
    paddingTop: number;
  }): React.ReactNode;
  protected renderLine(config: {
    data: Dataset[];
    width: number;
    height: number;
    paddingRight: number;
    paddingTop: number;
  }): React.ReactNode;
  protected getBezierLinePoints(
    dataset: Dataset,
    config: {
      data: Dataset[];
      width: number;
      height: number;
      paddingRight: number;
      paddingTop: number;
    },
  ): string;
  protected renderBezierLine(config: {
    data: Dataset[];
    width: number;
    height: number;
    paddingRight: number;
    paddingTop: number;
  }): React.ReactNode;
  protected renderBezierShadow(config: {
    data: Dataset[];
    width: number;
    height: number;
    paddingRight: number;
    paddingTop: number;
  }): React.ReactNode;
  protected renderLegend(width: number, legendOffset: number): React.ReactNode;
  render(): React.ReactNode;
}
