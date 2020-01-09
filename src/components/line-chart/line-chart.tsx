import React from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {
  Circle,
  CircleProps,
  Color,
  G,
  Path,
  Polygon,
  Polyline,
  Rect,
  Svg,
} from 'react-native-svg';

import {ChartData, Dataset} from '../../types';
import {numericOrDefault} from '../../utils';
import ChartComponent, {
  BaseChartConfig,
  BaseChartProps,
} from '../abstracts/abstract-chart';
import LegendItem from './LegendItem';

export interface LineChartData extends ChartData<Dataset<number>> {
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

export class LineChart<
  ChartProps extends LineChartProps = LineChartProps
> extends ChartComponent<ChartProps> {
  public constructor(props: ChartProps) {
    super(props);
  }

  protected static getColor(
    props: LineChartProps,
    dataset: Dataset,
    opacity: number = 1,
  ): string {
    return (dataset.color || props.chartConfig.color)(opacity);
  }

  protected static getStrokeWidth(
    props: LineChartProps,
    dataset: Dataset,
  ): number {
    return dataset.strokeWidth || props.chartConfig.strokeWidth || 3;
  }

  protected static getDatas(data: Dataset[]): number[] {
    return data.reduce(
      (acc, item) => (item.data ? [...acc, ...item.data] : acc),
      [] as number[],
    );
  }

  protected static getPropsForDots(
    props: LineChartProps,
    x: number,
    i: number,
  ): CircleProps {
    const {getDotProps} = props;
    if (typeof getDotProps === 'function') {
      return getDotProps(x, i);
    }

    const {propsForDots = {}} = props.chartConfig;

    return {r: 4, ...propsForDots};
  }

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
  }) {
    const {
      data,
      width,
      height,
      paddingTop,
      paddingRight,
      onDataPointClick,
    } = config;
    const output: React.ReactNode[] = [];
    const datas = LineChart.getDatas(data);
    const baseHeight = this.calcBaseHeight(datas, height);
    const {
      getDotColor,
      hidePointsAtIndex = [],
      renderDotContent = () => {
        return null;
      },
    } = this.props;

    data.forEach((dataset: Dataset, i) => {
      dataset.data.forEach((x, j) => {
        if (hidePointsAtIndex.includes(j)) {
          return;
        }
        const cx =
          paddingRight + (j * (width - paddingRight)) / dataset.data.length;
        const cy =
          ((baseHeight - this.calcHeight(x, datas, height)) / 4) * 3 +
          paddingTop;
        const onPress = () => {
          if (!onDataPointClick || hidePointsAtIndex.includes(j)) {
            return;
          }

          onDataPointClick({
            index: j,
            value: x,
            dataset,
            x: cx,
            y: cy,
            getColor: (opacity?: number) =>
              LineChart.getColor(this.props, dataset, opacity),
          });
        };
        output.push(
          <Circle
            key={`c1_${i}_${j}`}
            cx={cx}
            cy={cy}
            fill={
              typeof getDotColor === 'function'
                ? getDotColor(x, j)
                : LineChart.getColor(this.props, dataset, 0.9)
            }
            onPress={onPress}
            {...LineChart.getPropsForDots(this.props, x, j)}
          />,
          <Circle
            key={`c2_${i}_${j}`}
            cx={cx}
            cy={cy}
            r="14"
            fill="#fff"
            fillOpacity={0}
            onPress={onPress}
          />,
          renderDotContent({x: cx, y: cy, index: j}),
        );
      });
    });
    return output;
  }

  protected renderShadow(config: {
    data: Dataset[];
    width: number;
    height: number;
    paddingRight: number;
    paddingTop: number;
  }): React.ReactNode {
    if (this.props.bezier) {
      return this.renderBezierShadow(config);
    }

    const {data, width, height, paddingRight, paddingTop} = config;
    const datas = LineChart.getDatas(data);
    const baseHeight = this.calcBaseHeight(datas, height);

    return config.data.map((dataset, index) => {
      return (
        <Polygon
          key={index}
          points={
            dataset.data
              .map((d, i) => {
                const x =
                  paddingRight +
                  (i * (width - paddingRight)) / dataset.data.length;
                const y =
                  ((baseHeight - this.calcHeight(d, datas, height)) / 4) * 3 +
                  paddingTop;
                return `${x},${y}`;
              })
              .join(' ') +
            ` ${paddingRight +
              ((width - paddingRight) / dataset.data.length) *
                (dataset.data.length - 1)},${(height / 4) * 3 +
              paddingTop} ${paddingRight},${(height / 4) * 3 + paddingTop}`
          }
          fill="url(#fillShadowGradient)"
          strokeWidth={0}
        />
      );
    });
  }

  protected renderLine(config: {
    data: Dataset[];
    width: number;
    height: number;
    paddingRight: number;
    paddingTop: number;
  }): React.ReactNode {
    if (this.props.bezier) {
      return this.renderBezierLine(config);
    }

    const {width, height, paddingRight, paddingTop, data} = config;
    let output: JSX.Element[] = [];
    const datas = LineChart.getDatas(data);
    const baseHeight = this.calcBaseHeight(datas, height);
    data.forEach((dataset, index) => {
      const points = dataset.data.map((d, i) => {
        const x =
          (i * (width - paddingRight)) / dataset.data.length + paddingRight;
        const y =
          ((baseHeight - this.calcHeight(d, datas, height)) / 4) * 3 +
          paddingTop;
        return `${x},${y}`;
      });

      output = output.concat(
        <Polyline
          key={index}
          points={points.join(' ')}
          fill="none"
          stroke={LineChart.getColor(this.props, dataset, 0.2)}
          strokeWidth={LineChart.getStrokeWidth(this.props, dataset)}
        />,
      );
    });

    return output;
  }

  protected getBezierLinePoints(
    dataset: Dataset,
    config: {
      data: Dataset[];
      width: number;
      height: number;
      paddingRight: number;
      paddingTop: number;
    },
  ): string {
    const {width, height, paddingRight, paddingTop, data} = config;
    if (dataset.data.length === 0) {
      return 'M0,0';
    }

    const datas = LineChart.getDatas(data);
    const x = (i: number) =>
      Math.floor(
        paddingRight + (i * (width - paddingRight)) / dataset.data.length,
      );
    const baseHeight = this.calcBaseHeight(datas, height);
    const y = (i: number) => {
      const yHeight = this.calcHeight(dataset.data[i], datas, height);
      return Math.floor(((baseHeight - yHeight) / 4) * 3 + paddingTop);
    };

    return [`M${x(0)},${y(0)}`]
      .concat(
        dataset.data.slice(0, -1).map((_, i) => {
          const x_mid = (x(i) + x(i + 1)) / 2;
          const y_mid = (y(i) + y(i + 1)) / 2;
          const cp_x1 = (x_mid + x(i)) / 2;
          const cp_x2 = (x_mid + x(i + 1)) / 2;
          return (
            `Q ${cp_x1}, ${y(i)}, ${x_mid}, ${y_mid}` +
            ` Q ${cp_x2}, ${y(i + 1)}, ${x(i + 1)}, ${y(i + 1)}`
          );
        }),
      )
      .join(' ');
  }

  protected renderBezierLine(config: {
    data: Dataset[];
    width: number;
    height: number;
    paddingRight: number;
    paddingTop: number;
  }): React.ReactNode {
    return config.data.map((dataset, index) => {
      const result = this.getBezierLinePoints(dataset, config);
      return (
        <Path
          key={index}
          d={result}
          fill="none"
          stroke={LineChart.getColor(this.props, dataset, 0.2)}
          strokeWidth={LineChart.getStrokeWidth(this.props, dataset)}
        />
      );
    });
  }

  protected renderBezierShadow(config: {
    data: Dataset[];
    width: number;
    height: number;
    paddingRight: number;
    paddingTop: number;
  }): React.ReactNode {
    const {width, height, paddingRight, paddingTop, data} = config;
    return data.map((dataset, index) => {
      const d =
        this.getBezierLinePoints(dataset, config) +
        ` L${paddingRight +
          ((width - paddingRight) / dataset.data.length) *
            (dataset.data.length - 1)},${(height / 4) * 3 +
          paddingTop} L${paddingRight},${(height / 4) * 3 + paddingTop} Z`;
      return (
        <Path
          key={index}
          d={d}
          fill="url(#fillShadowGradient)"
          strokeWidth={0}
        />
      );
    });
  }

  protected renderLegend(width: number, legendOffset: number): React.ReactNode {
    if (!Array.isArray(this.props.data.legend)) {
      return null;
    }

    const {legend, datasets} = this.props.data;
    const baseLegendItemX = width / (legend.length + 1);

    return legend.map((legendItem, i) => (
      <G key={i}>
        <LegendItem
          index={i}
          iconColor={LineChart.getColor(this.props, datasets[i], 0.9)}
          baseLegendItemX={baseLegendItemX}
          legendText={legendItem}
          labelProps={{...this.getPropsForLabels()}}
          legendOffset={legendOffset}
        />
      </G>
    ));
  }

  public render(): React.ReactNode {
    const {
      width,
      height,
      data,
      withShadow = true,
      withDots = true,
      withInnerLines = true,
      withOuterLines = true,
      withHorizontalLabels = true,
      withVerticalLabels = true,
      decorator,
      onDataPointClick,
      verticalLabelRotation = 0,
      horizontalLabelRotation = 0,
      formatYLabel = (yLabel: string) => yLabel,
      formatXLabel = (xLabel: string) => xLabel,
    } = this.props;

    const style: ViewStyle = this.props.style
      ? StyleSheet.flatten(this.props.style as ViewStyle)
      : {};

    const {labels = []} = data;

    const borderRadius = numericOrDefault(style.borderRadius, 0);
    const paddingTop = numericOrDefault(style.paddingTop, 16);
    const paddingRight = numericOrDefault(style.paddingRight, 64);
    const margin = numericOrDefault(style.margin, 0);
    const marginRight = numericOrDefault(style.marginRight, 0);
    const paddingBottom = numericOrDefault(style.paddingBottom, 0);

    const config = {
      width,
      height,
      verticalLabelRotation,
      horizontalLabelRotation,
    };

    const datas = LineChart.getDatas(data.datasets);
    const legendOffset = this.props.data.legend ? height * 0.15 : 0;

    return (
      <View style={style}>
        <Svg
          height={height + paddingBottom + legendOffset}
          width={width - margin * 2 - marginRight}>
          <Rect
            width="100%"
            height={height + legendOffset}
            rx={borderRadius}
            ry={borderRadius}
            fill="url(#backgroundGradient)"
          />
          {this.props.data.legend &&
            this.renderLegend(config.width, legendOffset)}
          <G x="0" y={legendOffset}>
            {this.renderDefs({
              width: config.width,
              height: config.height,
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
            <G>
              {withInnerLines
                ? this.renderHorizontalLines({
                    width: config.width,
                    height: config.height,
                    count: 4,
                    paddingTop,
                    paddingRight,
                  })
                : withOuterLines
                ? this.renderHorizontalLine({
                    width: config.width,
                    height: config.height,
                    paddingTop,
                    paddingRight,
                  })
                : null}
            </G>
            <G>
              {withHorizontalLabels
                ? this.renderHorizontalLabels({
                    count: Math.min(...datas) === Math.max(...datas) ? 1 : 4,
                    data: datas,
                    height: config.height,
                    paddingTop,
                    paddingRight,
                    formatYLabel,
                    horizontalLabelRotation: config.horizontalLabelRotation,
                  })
                : null}
            </G>
            <G>
              {withInnerLines
                ? this.renderVerticalLines({
                    data: data.datasets[0].data,
                    width: config.width,
                    height: config.height,
                    paddingTop,
                    paddingRight,
                  })
                : withOuterLines
                ? this.renderVerticalLine({
                    height: config.height,
                    paddingTop,
                    paddingRight,
                  })
                : null}
            </G>
            <G>
              {withVerticalLabels
                ? this.renderVerticalLabels({
                    width: config.width,
                    height: config.height,
                    labels,
                    paddingRight,
                    paddingTop,
                    formatXLabel,
                    verticalLabelRotation: config.verticalLabelRotation,
                  })
                : null}
            </G>
            <G>
              {this.renderLine({
                data: data.datasets,
                width: config.width,
                height: config.height,
                paddingTop,
                paddingRight,
              })}
            </G>
            <G>
              {withShadow &&
                this.renderShadow({
                  data: data.datasets,
                  width: config.width,
                  height: config.height,
                  paddingRight,
                  paddingTop,
                })}
            </G>
            <G>
              {withDots &&
                this.renderDots({
                  data: data.datasets,
                  width: config.width,
                  height: config.height,
                  paddingTop,
                  paddingRight,
                  onDataPointClick,
                })}
            </G>
            <G>
              {decorator &&
                decorator({
                  data: data.datasets,
                  width: config.width,
                  height: config.height,
                  paddingTop,
                  paddingRight,
                })}
            </G>
          </G>
        </Svg>
      </View>
    );
  }
}
