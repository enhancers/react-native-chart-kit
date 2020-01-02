import _ from 'lodash'; // TODO: lightweight imports and libraries
import PropTypes, {InferProps} from 'prop-types';
import React from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {Color, G, Rect, Svg, Text, RectProps} from 'react-native-svg';

import ChartComponent, {
  BaseChartConfig,
  BaseChartProps,
} from '../abstracts/abstract-chart';
import {DAYS_IN_WEEK, MILLISECONDS_IN_ONE_DAY, MONTH_LABELS} from './constants';
import {
  Nullable,
  convertToDate,
  getBeginningTimeForDate,
  shiftDate,
} from '../../utils';

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

// <ChartConfig extends ContributionChartConfig = ContributionChartConfig>
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

const SQUARE_SIZE = 20;
const MONTH_LABEL_GUTTER_SIZE = 8;
const paddingLeft = 32;

export class ContributionGraph<
  ChartConfig extends ContributionGraphProps = ContributionGraphProps
> extends ChartComponent<ChartConfig, ContributionGraphState> {
  public static readonly propTypes: Readonly<
    InferProps<ContributionGraphProps>
  > = {
    values: PropTypes.arrayOf(
      // array of objects with date and arbitrary metadata
      PropTypes.shape({
        date: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.number,
          PropTypes.instanceOf(Date),
        ]).isRequired,
      }).isRequired,
    ).isRequired,
    numDays: PropTypes.number, // number of days back from endDate to show
    endDate: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.instanceOf(Date),
    ]), // end of date range
    gutterSize: PropTypes.number, // size of space between squares
    squareSize: PropTypes.number, // size of squares
    horizontal: PropTypes.bool, // whether to orient horizontally or vertically
    showMonthLabels: PropTypes.bool, // whether to show month labels
    showOutOfRangeDays: PropTypes.bool, // whether to render squares for extra days in week after endDate, and before start date
    tooltipDataAttrs: PropTypes.oneOfType([PropTypes.object, PropTypes.func]), // data attributes to add to square for setting 3rd party tooltips, e.g. { 'data-toggle': 'tooltip' } for bootstrap tooltips
    titleForValue: PropTypes.func, // function which returns title text for value
  };

  public static readonly defaultProps: Readonly<
    Partial<ContributionGraphProps>
  > = {
    numDays: 200,
    endDate: new Date(),
    gutterSize: 1,
    squareSize: SQUARE_SIZE,
    horizontal: true,
    showMonthLabels: true,
    showOutOfRangeDays: false,
  };

  public constructor(props: ChartConfig) {
    super(props);

    this.state = {
      valueCache: ContributionGraph.getValueCache(props),
    };
  }

  protected static getDerivedStateFromProps(
    props: ContributionGraphProps,
  ): ContributionGraphState {
    return {
      valueCache: ContributionGraph.getValueCache(props),
    };
  }

  protected static getSquareSizeWithGutter(
    props: ContributionGraphProps,
  ): number {
    return (props.squareSize || SQUARE_SIZE) + props.gutterSize;
  }

  protected static getMonthLabelSize(props: ContributionGraphProps): number {
    let {squareSize = SQUARE_SIZE} = props;
    if (!props.showMonthLabels) {
      return 0;
    }
    if (props.horizontal) {
      return squareSize + MONTH_LABEL_GUTTER_SIZE;
    }
    return 2 * (squareSize + MONTH_LABEL_GUTTER_SIZE);
  }

  protected static getStartDate(props: ContributionGraphProps): Date {
    return shiftDate(ContributionGraph.getEndDate(props), -props.numDays + 1); // +1 because endDate is inclusive
  }

  protected static getEndDate(props: ContributionGraphProps): Date {
    return getBeginningTimeForDate(convertToDate(props.endDate));
  }

  protected static getStartDateWithEmptyDays(
    props: ContributionGraphProps,
  ): Date {
    return shiftDate(
      ContributionGraph.getStartDate(props),
      -ContributionGraph.getNumEmptyDaysAtStart(props),
    );
  }

  protected static getNumEmptyDaysAtStart(
    props: ContributionGraphProps,
  ): number {
    return ContributionGraph.getStartDate(props).getDay();
  }

  protected static getNumEmptyDaysAtEnd(props: ContributionGraphProps): number {
    return DAYS_IN_WEEK - 1 - ContributionGraph.getEndDate(props).getDay();
  }

  protected static getWeekCount(props: ContributionGraphProps): number {
    const numDaysRoundedToWeek =
      props.numDays +
      ContributionGraph.getNumEmptyDaysAtStart(props) +
      ContributionGraph.getNumEmptyDaysAtEnd(props);
    return Math.ceil(numDaysRoundedToWeek / DAYS_IN_WEEK);
  }

  protected static getWeekWidth(props: ContributionGraphProps): number {
    return DAYS_IN_WEEK * ContributionGraph.getSquareSizeWithGutter(props);
  }

  protected static getWidth(props: ContributionGraphProps): number {
    return (
      ContributionGraph.getWeekCount(props) *
        ContributionGraph.getSquareSizeWithGutter(props) -
      props.gutterSize
    );
  }

  protected static getHeight(props: ContributionGraphProps): number {
    return (
      ContributionGraph.getWeekWidth(props) +
      (ContributionGraph.getMonthLabelSize(props) - props.gutterSize)
    );
  }

  protected static getValueCache(props: ContributionGraphProps): ValueCache {
    return props.values.reduce<ValueCache>((memo, value) => {
      const date = convertToDate(value.date);
      const index = Math.floor(
        (+date - +ContributionGraph.getStartDateWithEmptyDays(props)) /
          MILLISECONDS_IN_ONE_DAY,
      );

      memo[index] = {
        value,
        title: props.titleForValue ? props.titleForValue(value) : null,
        tooltipDataAttrs: ContributionGraph.getTooltipDataAttrsForValue(
          props,
          value,
        ),
      };

      return memo;
    }, {});
  }

  protected static getClassNameForIndex(
    props: ContributionGraphProps,
    state: ContributionGraphState,
    index: number,
  ): string {
    if (state.valueCache[index]) {
      if (state.valueCache[index].value) {
        const count = state.valueCache[index].value.count;

        if (count) {
          const opacity = (count * 0.15 > 1 ? 1 : count * 0.15) + 0.15;

          return props.chartConfig.color(opacity);
        }
      }
    }

    return props.chartConfig.color(0.15);
  }

  protected static getTitleForIndex(
    props: ContributionGraphProps,
    state: ContributionGraphState,
    index: number,
  ): string | null | undefined {
    if (state.valueCache[index]) {
      return state.valueCache[index].title;
    }

    return props.titleForValue ? props.titleForValue(null) : null;
  }

  protected static getTooltipDataAttrsForIndex(
    props: ContributionGraphProps,
    state: ContributionGraphState,
    index: number,
  ): RectProps {
    const cachedTooltipDataAttrs =
      state.valueCache[index] && state.valueCache[index].tooltipDataAttrs;

    if (cachedTooltipDataAttrs) {
      return cachedTooltipDataAttrs;
    }

    return ContributionGraph.getTooltipDataAttrsForValue(props, {
      date: null,
      count: null,
    });
  }

  protected static getTooltipDataAttrsForValue(
    props: ContributionGraphProps,
    value?: Nullable<Partial<ContributionValue>>,
  ): RectProps {
    const {tooltipDataAttrs} = props;

    if (!tooltipDataAttrs) {
      return {};
    }

    if (typeof tooltipDataAttrs === 'function') {
      return tooltipDataAttrs(value);
    }

    return tooltipDataAttrs;
  }

  protected static getTransformForWeek(
    props: ContributionGraphProps,
    weekIndex: number,
  ): number[] {
    if (props.horizontal) {
      return [weekIndex * ContributionGraph.getSquareSizeWithGutter(props), 50];
    }

    return [10, weekIndex * ContributionGraph.getSquareSizeWithGutter(props)];
  }

  protected static getSquareCoordinates(
    props: ContributionGraphProps,
    dayIndex: number,
  ) {
    if (props.horizontal) {
      return [0, dayIndex * ContributionGraph.getSquareSizeWithGutter(props)];
    }
    return [dayIndex * ContributionGraph.getSquareSizeWithGutter(props), 0];
  }

  protected static getMonthLabelCoordinates(
    props: ContributionGraphProps,
    weekIndex: number,
  ) {
    if (props.horizontal) {
      return [
        weekIndex * ContributionGraph.getSquareSizeWithGutter(props),
        ContributionGraph.getMonthLabelSize(props) - MONTH_LABEL_GUTTER_SIZE,
      ];
    }
    const verticalOffset = -2;
    return [
      0,
      (weekIndex + 1) * ContributionGraph.getSquareSizeWithGutter(props) +
        verticalOffset,
    ];
  }

  protected renderSquare(dayIndex: number, index: number): React.ReactNode {
    const indexOutOfRange =
      index < ContributionGraph.getNumEmptyDaysAtStart(this.props) ||
      index >=
        ContributionGraph.getNumEmptyDaysAtStart(this.props) +
          this.props.numDays;
    if (indexOutOfRange && !this.props.showOutOfRangeDays) {
      return null;
    }
    const [x, y] = ContributionGraph.getSquareCoordinates(this.props, dayIndex);
    const {squareSize = SQUARE_SIZE} = this.props;
    return (
      <Rect
        key={index}
        width={squareSize}
        height={squareSize}
        x={x + paddingLeft}
        y={y}
        fill={ContributionGraph.getClassNameForIndex(
          this.props,
          this.state,
          index,
        )}
        {...ContributionGraph.getTooltipDataAttrsForIndex(
          this.props,
          this.state,
          index,
        )}
      />
    );
  }

  protected renderWeek(weekIndex: number): React.ReactNode {
    const [x, y] = ContributionGraph.getTransformForWeek(this.props, weekIndex);
    return (
      <G key={weekIndex} x={x} y={y}>
        {_.range(DAYS_IN_WEEK).map(dayIndex =>
          this.renderSquare(dayIndex, weekIndex * DAYS_IN_WEEK + dayIndex),
        )}
      </G>
    );
  }

  protected renderAllWeeks(): React.ReactNode {
    return _.range(ContributionGraph.getWeekCount(this.props)).map(weekIndex =>
      this.renderWeek(weekIndex),
    );
  }

  protected renderMonthLabels(): React.ReactNode {
    if (!this.props.showMonthLabels) {
      return null;
    }
    const weekRange = _.range(ContributionGraph.getWeekCount(this.props) - 1); // don't render for last week, because label will be cut off
    return weekRange.map(weekIndex => {
      const endOfWeek = shiftDate(
        ContributionGraph.getStartDateWithEmptyDays(this.props),
        (weekIndex + 1) * DAYS_IN_WEEK,
      );
      const [x, y] = ContributionGraph.getMonthLabelCoordinates(
        this.props,
        weekIndex,
      );
      return endOfWeek.getDate() >= 1 && endOfWeek.getDate() <= DAYS_IN_WEEK ? (
        <Text
          key={weekIndex}
          x={x + paddingLeft}
          y={y + 8}
          {...this.getPropsForLabels()}>
          {MONTH_LABELS[endOfWeek.getMonth()]}
        </Text>
      ) : null;
    });
  }

  public render(): React.ReactNode {
    const style = this.props.style ? StyleSheet.flatten(this.props.style) : {};
    const chartConfigStyle = this.props.chartConfig.style
      ? StyleSheet.flatten(this.props.chartConfig.style)
      : {};

    let borderRadius: number =
      style.borderRadius ?? chartConfigStyle.borderRadius ?? 0;

    return (
      <View style={style}>
        <Svg height={this.props.height} width={this.props.width}>
          {this.renderDefs({
            // TODO: review this
            backgroundGradientFrom: this.props.chartConfig
              .backgroundGradientFrom,
            backgroundGradientTo: this.props.chartConfig.backgroundGradientTo,
            fillShadowGradient: this.props.chartConfig.fillShadowGradient,
            fillShadowGradientOpacity: this.props.chartConfig
              .fillShadowGradientOpacity,
            backgroundGradientFromOpacity: this.props.chartConfig
              .backgroundGradientFromOpacity,
            backgroundGradientToOpacity: this.props.chartConfig
              .backgroundGradientToOpacity,
          })}
          <Rect
            width="100%"
            height={this.props.height}
            rx={borderRadius}
            ry={borderRadius}
            fill="url(#backgroundGradient)"
          />
          <G>{this.renderMonthLabels()}</G>
          <G>{this.renderAllWeeks()}</G>
        </Svg>
      </View>
    );
  }
}

Object.defineProperty(ContributionGraph, 'propTypes', {
  writable: false,
  configurable: false,
});

// eslint-disable-next-line react/forbid-foreign-prop-types
Object.freeze(ContributionGraph.propTypes);

Object.defineProperty(ContributionGraph, 'defaultProps', {
  writable: false,
  configurable: false,
});

Object.freeze(ContributionGraph.defaultProps);
