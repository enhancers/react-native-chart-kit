import React from 'react';

import {
  LinearGradient,
  Line,
  Text,
  Defs,
  Stop,
  Color,
  LineProps,
  TextProps,
} from 'react-native-svg';
import {StyleProp, ViewStyle} from 'react-native';

export interface BaseChartConfig {
  /**
   * Defines the base color function that is used to calculate colors of labels and sectors used in a chart
   */
  color: (opacity: number, index?: number) => string;
  /**
   * Defines the function that is used to calculate the color of the labels used in a chart.
   */
  labelColor?: (opacity: number, index?: number) => string;
  decimalPlaces?: number;
  /**
   * Override styles of the background lines, refer to react-native-svg's Line documentation
   */
  propsForBackgroundLines?: Partial<LineProps>;
  /**
   * Override styles of the labels, refer to react-native-svg's Text documentation
   */
  propsForLabels?: TextProps;
}

export interface BaseChartProps<
  ChartConfig extends BaseChartConfig = BaseChartConfig
> {
  width: number;
  height: number;
  style?: StyleProp<ViewStyle>;
  fromZero?: boolean;
  chartConfig: ChartConfig;
  /**
   * Prepend text to horizontal labels -- default: ''.
   */
  yAxisLabel?: string;
  /**
   * Append text to horizontal labels -- default: ''.
   */
  yAxisSuffix?: string;
  /**
   * Offset for Y axis labels.
   */
  yLabelsOffset?: number;
  /**
   * Offset for X axis labels.
   */
  xLabelsOffset?: number;
  /**
   * Prepend text to vertical labels -- default: ''.
   */
  xAxisLabel?: string;
  /**
   * Array of indices of the data points you don't want to display.
   */
  hidePointsAtIndex?: number[];
}

abstract class ChartComponent<
  P extends BaseChartProps = BaseChartProps,
  S extends {} = {}
> extends React.PureComponent<P, S> {
  protected constructor(props: P) {
    super(props);
  }

  protected calcScaler(data: number[]): number {
    const [min, max] = this.props.fromZero
      ? [Math.min(...data, 0), Math.max(...data, 0)]
      : [Math.min(...data), Math.max(...data)];

    if (!isNaN(max) && !isNaN(min) && isFinite(max) && isFinite(min)) {
      return max - min !== 0 ? max - min : 1;
    }

    return 1;
  }

  protected calcBaseHeight(data: number[], height: number): number {
    const min: number = Math.min(...data);
    const max: number = Math.max(...data);

    if (isNaN(min) || isNaN(max) || !isFinite(min) || !isFinite(max)) {
      return 0;
    }

    if (min >= 0 && max >= 0) {
      return height;
    }

    if (min < 0 && max > 0) {
      const scaler: number = this.calcScaler(data);

      return (height * max) / scaler;
    }

    return 0;
  }

  protected calcHeight(val: number, data: number[], height: number) {
    const max = Math.max(...data);
    const min = Math.min(...data);

    const scaler: number = this.calcScaler(data);

    const scaledHeight = height * (val / scaler);

    if (min > 0 && max > 0) {
      return this.props.fromZero
        ? scaledHeight
        : height * ((val - min) / scaler);
    }

    if (min < 0 && max < 0) {
      return this.props.fromZero
        ? scaledHeight
        : height * ((val - max) / scaler);
    }

    return scaledHeight; // min < 0 && max > 0
  }

  protected getPropsForBackgroundLines() {
    const {propsForBackgroundLines = {}} = this.props.chartConfig;
    return {
      stroke: this.props.chartConfig.color(0.2),
      strokeDasharray: '5, 10',
      strokeWidth: 1,
      ...propsForBackgroundLines,
    };
  }

  protected getPropsForLabels() {
    const {
      propsForLabels = {},
      color,
      labelColor = color,
    } = this.props.chartConfig;
    return {
      fontSize: 12,
      fill: labelColor(0.8),
      ...propsForLabels,
    };
  }

  protected renderHorizontalLines(config: {
    count: number;
    width: number;
    height: number;
    paddingTop: number;
    paddingRight: number;
  }) {
    const {count, width, height, paddingTop = 0, paddingRight = 0} = config;

    return [...new Array(count)].map((_, i) => {
      return (
        <Line
          key={Math.random()}
          x1={paddingRight}
          y1={(height / 4) * i + paddingTop}
          x2={width}
          y2={(height / 4) * i + paddingTop}
          {...this.getPropsForBackgroundLines()}
        />
      );
    });
  }

  protected renderHorizontalLine(config: {
    width: number;
    height: number;
    paddingTop: number;
    paddingRight: number;
  }) {
    const {width, height, paddingTop, paddingRight} = config;
    return (
      <Line
        key={Math.random()}
        x1={paddingRight}
        y1={height - height / 4 + paddingTop}
        x2={width}
        y2={height - height / 4 + paddingTop}
        {...this.getPropsForBackgroundLines()}
      />
    );
  }

  protected renderHorizontalLabels(config: {
    count: number;
    data: number[];
    height: number;
    paddingTop: number;
    paddingRight: number;
    horizontalLabelRotation?: number;
    formatYLabel?: (yLabel: string) => string;
  }) {
    const {
      count,
      data,
      height,
      paddingTop,
      paddingRight,
      horizontalLabelRotation = 0,
      formatYLabel = (yLabel: string) => yLabel,
    } = config;
    const {
      yAxisLabel = '',
      yAxisSuffix = '',
      yLabelsOffset = 12,
      chartConfig,
    } = this.props;
    const {decimalPlaces = 2} = chartConfig;
    return [...new Array(count)].map((_, i) => {
      let yLabel;

      if (count === 1) {
        yLabel = `${yAxisLabel}${formatYLabel(
          data[0].toFixed(decimalPlaces),
        )}${yAxisSuffix}`;
      } else {
        const label = this.props.fromZero
          ? (this.calcScaler(data) / (count - 1)) * i + Math.min(...data, 0)
          : (this.calcScaler(data) / (count - 1)) * i + Math.min(...data);
        yLabel = `${yAxisLabel}${formatYLabel(
          label.toFixed(decimalPlaces),
        )}${yAxisSuffix}`;
      }

      const x = paddingRight - yLabelsOffset;
      const y =
        count === 1 && this.props.fromZero
          ? paddingTop + 4
          : (height * 3) / 4 - ((height - paddingTop) / count) * i + 12;
      return (
        <Text
          rotation={horizontalLabelRotation}
          origin={`${x}, ${y}`}
          key={Math.random()}
          x={x}
          textAnchor="end"
          y={y}
          {...this.getPropsForLabels()}>
          {yLabel}
        </Text>
      );
    });
  }

  protected renderVerticalLabels(config: {
    width: number;
    height: number;
    paddingRight: number;
    paddingTop: number;
    labels?: string[];
    horizontalOffset?: number;
    stackedBar?: boolean;
    verticalLabelRotation?: number;
    formatXLabel?: (xLabel: string) => string;
  }) {
    const {
      width,
      height,
      paddingRight,
      paddingTop,
      labels = [],
      horizontalOffset = 0,
      stackedBar = false,
      verticalLabelRotation = 0,
      formatXLabel = (xLabel: string) => xLabel,
    } = config;
    const {
      xAxisLabel = '',
      xLabelsOffset = 0,
      hidePointsAtIndex = [],
    } = this.props;
    const fontSize = 12;
    let fac = 1;

    if (stackedBar) {
      fac = 0.71;
    }

    return labels.map((label: string, i: number) => {
      if (hidePointsAtIndex.includes(i)) {
        return null;
      }

      const x =
        (((width - paddingRight) / labels.length) * i +
          paddingRight +
          horizontalOffset) *
        fac;
      const y = (height * 3) / 4 + paddingTop + fontSize * 2 + xLabelsOffset;

      return (
        <Text
          origin={`${x}, ${y}`}
          rotation={verticalLabelRotation}
          key={Math.random()}
          x={x}
          y={y}
          textAnchor={verticalLabelRotation === 0 ? 'middle' : 'start'}
          {...this.getPropsForLabels()}>
          {`${formatXLabel(label)}${xAxisLabel}`}
        </Text>
      );
    });
  }

  protected renderVerticalLines(config: {
    data: number[];
    width: number;
    height: number;
    paddingTop: number;
    paddingRight: number;
  }) {
    const {data, width, height, paddingTop, paddingRight} = config;
    return [...new Array(data.length)].map((_, i) => {
      return (
        <Line
          key={Math.random()}
          x1={Math.floor(
            ((width - paddingRight) / data.length) * i + paddingRight,
          )}
          y1={0}
          x2={Math.floor(
            ((width - paddingRight) / data.length) * i + paddingRight,
          )}
          y2={height - height / 4 + paddingTop}
          {...this.getPropsForBackgroundLines()}
        />
      );
    });
  }

  protected renderVerticalLine(config: {
    height: number;
    paddingTop: number;
    paddingRight: number;
  }) {
    const {height, paddingTop, paddingRight} = config;

    return (
      <Line
        key={Math.random()}
        x1={Math.floor(paddingRight)}
        y1={0}
        x2={Math.floor(paddingRight)}
        y2={height - height / 4 + paddingTop}
        {...this.getPropsForBackgroundLines()}
      />
    );
  }

  protected renderDefs(config: {
    backgroundGradientFrom: Color;
    backgroundGradientTo: Color;
    width?: number;
    height?: number;
    fillShadowGradient?: Color;
    fillShadowGradientOpacity?: number;
    backgroundGradientFromOpacity?: number;
    backgroundGradientToOpacity?: number;
  }) {
    const {
      backgroundGradientFrom,
      backgroundGradientTo,
      width = this.props.width,
      height = this.props.height,
    } = config;

    const fromOpacity = config.backgroundGradientFromOpacity ?? 1.0;
    const toOpacity = config.backgroundGradientToOpacity ?? 1.0;

    const fillShadowGradient =
      config.fillShadowGradient ?? this.props.chartConfig.color(1);

    const fillShadowGradientOpacity = config.fillShadowGradientOpacity ?? 0.1;

    return (
      <Defs>
        <LinearGradient
          id="backgroundGradient"
          x1="0"
          y1={height}
          x2={width}
          y2={0}>
          <Stop
            offset="0"
            stopColor={backgroundGradientFrom}
            stopOpacity={fromOpacity}
          />
          <Stop
            offset="1"
            stopColor={backgroundGradientTo}
            stopOpacity={toOpacity}
          />
        </LinearGradient>
        <LinearGradient
          id="fillShadowGradient"
          x1={0}
          y1={0}
          x2={0}
          y2={height}>
          <Stop
            offset="0"
            stopColor={fillShadowGradient}
            stopOpacity={fillShadowGradientOpacity}
          />
          <Stop offset="1" stopColor={fillShadowGradient} stopOpacity="0" />
        </LinearGradient>
      </Defs>
    );
  }

  // You must define an override for the render method
  public abstract render(): React.ReactNode;
}

export default ChartComponent;
