import _ from 'lodash'; // TODO: lightweight imports and libraries
import PropTypes from 'prop-types';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {G, Rect, Svg, Text} from 'react-native-svg';
import ChartComponent from '../abstracts/abstract-chart';
import {DAYS_IN_WEEK, MILLISECONDS_IN_ONE_DAY, MONTH_LABELS} from './constants';
import {convertToDate, getBeginningTimeForDate, shiftDate} from '../../utils';
const SQUARE_SIZE = 20;
const MONTH_LABEL_GUTTER_SIZE = 8;
const paddingLeft = 32;
export class ContributionGraph extends ChartComponent {
  constructor(props) {
    super(props);
    this.state = {
      valueCache: ContributionGraph.getValueCache(props),
    };
  }
  static getDerivedStateFromProps(props) {
    return {
      valueCache: ContributionGraph.getValueCache(props),
    };
  }
  static getSquareSizeWithGutter(props) {
    return (props.squareSize || SQUARE_SIZE) + props.gutterSize;
  }
  static getMonthLabelSize(props) {
    let {squareSize = SQUARE_SIZE} = props;
    if (!props.showMonthLabels) {
      return 0;
    }
    if (props.horizontal) {
      return squareSize + MONTH_LABEL_GUTTER_SIZE;
    }
    return 2 * (squareSize + MONTH_LABEL_GUTTER_SIZE);
  }
  static getStartDate(props) {
    return shiftDate(ContributionGraph.getEndDate(props), -props.numDays + 1); // +1 because endDate is inclusive
  }
  static getEndDate(props) {
    return getBeginningTimeForDate(convertToDate(props.endDate));
  }
  static getStartDateWithEmptyDays(props) {
    return shiftDate(
      ContributionGraph.getStartDate(props),
      -ContributionGraph.getNumEmptyDaysAtStart(props),
    );
  }
  static getNumEmptyDaysAtStart(props) {
    return ContributionGraph.getStartDate(props).getDay();
  }
  static getNumEmptyDaysAtEnd(props) {
    return DAYS_IN_WEEK - 1 - ContributionGraph.getEndDate(props).getDay();
  }
  static getWeekCount(props) {
    const numDaysRoundedToWeek =
      props.numDays +
      ContributionGraph.getNumEmptyDaysAtStart(props) +
      ContributionGraph.getNumEmptyDaysAtEnd(props);
    return Math.ceil(numDaysRoundedToWeek / DAYS_IN_WEEK);
  }
  static getWeekWidth(props) {
    return DAYS_IN_WEEK * ContributionGraph.getSquareSizeWithGutter(props);
  }
  static getWidth(props) {
    return (
      ContributionGraph.getWeekCount(props) *
        ContributionGraph.getSquareSizeWithGutter(props) -
      props.gutterSize
    );
  }
  static getHeight(props) {
    return (
      ContributionGraph.getWeekWidth(props) +
      (ContributionGraph.getMonthLabelSize(props) - props.gutterSize)
    );
  }
  static getValueCache(props) {
    return props.values.reduce((memo, value) => {
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
  static getClassNameForIndex(props, state, index) {
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
  static getTitleForIndex(props, state, index) {
    if (state.valueCache[index]) {
      return state.valueCache[index].title;
    }
    return props.titleForValue ? props.titleForValue(null) : null;
  }
  static getTooltipDataAttrsForIndex(props, state, index) {
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
  static getTooltipDataAttrsForValue(props, value) {
    const {tooltipDataAttrs} = props;
    if (!tooltipDataAttrs) {
      return {};
    }
    if (typeof tooltipDataAttrs === 'function') {
      return tooltipDataAttrs(value);
    }
    return tooltipDataAttrs;
  }
  static getTransformForWeek(props, weekIndex) {
    if (props.horizontal) {
      return [weekIndex * ContributionGraph.getSquareSizeWithGutter(props), 50];
    }
    return [10, weekIndex * ContributionGraph.getSquareSizeWithGutter(props)];
  }
  static getSquareCoordinates(props, dayIndex) {
    if (props.horizontal) {
      return [0, dayIndex * ContributionGraph.getSquareSizeWithGutter(props)];
    }
    return [dayIndex * ContributionGraph.getSquareSizeWithGutter(props), 0];
  }
  static getMonthLabelCoordinates(props, weekIndex) {
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
  renderSquare(dayIndex, index) {
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
  renderWeek(weekIndex) {
    const [x, y] = ContributionGraph.getTransformForWeek(this.props, weekIndex);
    return (
      <G key={weekIndex} x={x} y={y}>
        {_.range(DAYS_IN_WEEK).map(dayIndex =>
          this.renderSquare(dayIndex, weekIndex * DAYS_IN_WEEK + dayIndex),
        )}
      </G>
    );
  }
  renderAllWeeks() {
    return _.range(ContributionGraph.getWeekCount(this.props)).map(weekIndex =>
      this.renderWeek(weekIndex),
    );
  }
  renderMonthLabels() {
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
  render() {
    const style = this.props.style ? StyleSheet.flatten(this.props.style) : {};
    const chartConfigStyle = this.props.chartConfig.style
      ? StyleSheet.flatten(this.props.chartConfig.style)
      : {};
    let borderRadius = style.borderRadius ?? chartConfigStyle.borderRadius ?? 0;
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
ContributionGraph.propTypes = {
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
  numDays: PropTypes.number,
  endDate: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.instanceOf(Date),
  ]),
  gutterSize: PropTypes.number,
  squareSize: PropTypes.number,
  horizontal: PropTypes.bool,
  showMonthLabels: PropTypes.bool,
  showOutOfRangeDays: PropTypes.bool,
  tooltipDataAttrs: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  titleForValue: PropTypes.func,
};
ContributionGraph.defaultProps = {
  numDays: 200,
  endDate: new Date(),
  gutterSize: 1,
  squareSize: SQUARE_SIZE,
  horizontal: true,
  showMonthLabels: true,
  showOutOfRangeDays: false,
};
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
//# sourceMappingURL=ContributionGraph.js.map
