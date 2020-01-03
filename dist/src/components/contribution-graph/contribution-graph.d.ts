import {InferProps} from 'prop-types';
import React from 'react';
import {StyleProp, ViewStyle} from 'react-native';
import {Color, RectProps} from 'react-native-svg';
import ChartComponent, {
  BaseChartConfig,
  BaseChartProps,
} from '../abstracts/abstract-chart';
import {Nullable} from '../../utils';
export interface ContributionChartConfig extends BaseChartConfig {
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
  fillShadowGradient?: string;
  fillShadowGradientOpacity?: number;
  style?: StyleProp<ViewStyle>;
}
export interface ContributionValue {
  count: number;
  date: string;
}
export interface ContributionGraphProps
  extends BaseChartProps<ContributionChartConfig> {
  values: ContributionValue[];
  numDays: number;
  endDate: Date;
  chartConfig: ContributionChartConfig;
  gutterSize: number;
  squareSize: number;
  horizontal: boolean;
  showMonthLabels: boolean;
  showOutOfRangeDays: boolean;
  tooltipDataAttrs?:
    | RectProps
    | ((value?: Nullable<Partial<ContributionValue>>) => RectProps);
  titleForValue?: (value?: ContributionValue | null) => string;
  style?: StyleProp<ViewStyle>;
}
interface ValueCache {
  [value: number]: {
    title?: string | null;
    tooltipDataAttrs?: RectProps;
    value: ContributionValue;
  };
}
interface ContributionGraphState {
  valueCache: ValueCache;
}
export declare class ContributionGraph<
  ChartConfig extends ContributionGraphProps = ContributionGraphProps
> extends ChartComponent<ChartConfig, ContributionGraphState> {
  static readonly propTypes: Readonly<InferProps<ContributionGraphProps>>;
  static readonly defaultProps: Readonly<Partial<ContributionGraphProps>>;
  constructor(props: ChartConfig);
  protected static getDerivedStateFromProps(
    props: ContributionGraphProps,
  ): ContributionGraphState;
  protected static getSquareSizeWithGutter(
    props: ContributionGraphProps,
  ): number;
  protected static getMonthLabelSize(props: ContributionGraphProps): number;
  protected static getStartDate(props: ContributionGraphProps): Date;
  protected static getEndDate(props: ContributionGraphProps): Date;
  protected static getStartDateWithEmptyDays(
    props: ContributionGraphProps,
  ): Date;
  protected static getNumEmptyDaysAtStart(
    props: ContributionGraphProps,
  ): number;
  protected static getNumEmptyDaysAtEnd(props: ContributionGraphProps): number;
  protected static getWeekCount(props: ContributionGraphProps): number;
  protected static getWeekWidth(props: ContributionGraphProps): number;
  protected static getWidth(props: ContributionGraphProps): number;
  protected static getHeight(props: ContributionGraphProps): number;
  protected static getValueCache(props: ContributionGraphProps): ValueCache;
  protected static getClassNameForIndex(
    props: ContributionGraphProps,
    state: ContributionGraphState,
    index: number,
  ): string;
  protected static getTitleForIndex(
    props: ContributionGraphProps,
    state: ContributionGraphState,
    index: number,
  ): string | null | undefined;
  protected static getTooltipDataAttrsForIndex(
    props: ContributionGraphProps,
    state: ContributionGraphState,
    index: number,
  ): RectProps;
  protected static getTooltipDataAttrsForValue(
    props: ContributionGraphProps,
    value?: Nullable<Partial<ContributionValue>>,
  ): RectProps;
  protected static getTransformForWeek(
    props: ContributionGraphProps,
    weekIndex: number,
  ): number[];
  protected static getSquareCoordinates(
    props: ContributionGraphProps,
    dayIndex: number,
  ): number[];
  protected static getMonthLabelCoordinates(
    props: ContributionGraphProps,
    weekIndex: number,
  ): number[];
  protected renderSquare(dayIndex: number, index: number): React.ReactNode;
  protected renderWeek(weekIndex: number): React.ReactNode;
  protected renderAllWeeks(): React.ReactNode;
  protected renderMonthLabels(): React.ReactNode;
  render(): React.ReactNode;
}
export {};
