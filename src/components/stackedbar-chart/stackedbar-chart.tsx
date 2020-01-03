import React from 'react';
import {View, StyleProp, ViewStyle, StyleSheet} from 'react-native';
import {Svg, Rect, G, Text, Color} from 'react-native-svg';
import ChartComponent, {
  BaseChartConfig,
  BaseChartProps,
} from '../abstracts/abstract-chart';
import {numericOrDefault} from '../../utils';

const barWidth = 32;

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

  // barPercentage?: number;
}

export class StackedBarChart<
  ChartProps extends StackedBarChartProps = StackedBarChartProps
> extends ChartComponent<ChartProps> {
  public constructor(props: ChartProps) {
    super(props);
  }

  protected getBarPercentage(): number {
    const {barPercentage = 1} = this.props.chartConfig;
    return barPercentage;
  }

  protected getBarRadius = (ret: React.ReactElement[], x: number[]) => {
    return this.props.chartConfig.barRadius && ret.length === x.length - 1
      ? this.props.chartConfig.barRadius
      : 0;
  };

  protected renderBars(config: {
    width: number;
    height: number;
    data: number[][];
    colors: Color[];
    paddingTop: number;
    paddingRight: number;
    border: number;
  }): React.ReactNode {
    const {
      data,
      width,
      height,
      paddingTop,
      paddingRight,
      border,
      colors,
    } = config;

    return data.map((x, i) => {
      const calculatedBarWidth = barWidth * this.getBarPercentage();
      let ret: React.ReactElement[] = [];
      let h = 0;
      let st = paddingTop;

      for (let z = 0; z < x.length; z++) {
        h = (height - 55) * (x[z] / border);
        const y = (height / 4) * 3 - h + st;
        const xC =
          (paddingRight +
            (i * (width - paddingRight)) / data.length +
            calculatedBarWidth / 2) *
          0.7;
        ret = ret.concat(
          <Rect
            key={Math.random()}
            x={xC}
            y={y}
            rx={this.getBarRadius(ret, x)}
            ry={this.getBarRadius(ret, x)}
            width={calculatedBarWidth}
            height={h}
            fill={colors[z]}
          />,
        );
        if (!this.props.hideLegend) {
          ret = ret.concat(
            <Text
              key={Math.random()}
              x={xC + 7 + calculatedBarWidth / 2}
              textAnchor="end"
              y={h > 15 ? y + 15 : y + 7}
              {...this.getPropsForLabels()}>
              {x[z]}
            </Text>,
          );
        }

        st -= h;
      }

      return ret;
    });
  }

  protected renderLegend(config: {
    legend: string[];
    colors: Color[];
    width: number;
    height: number;
  }): React.ReactNode {
    const {legend, colors, width, height} = config;

    return legend.map((x, i) => {
      return (
        <G key={Math.random()}>
          <Rect
            width="16px"
            height="16px"
            fill={colors[i]}
            rx={8}
            ry={8}
            x={width * 0.71}
            y={height * 0.7 - i * 50}
          />
          <Text
            x={width * 0.78}
            y={height * 0.76 - i * 50}
            {...this.getPropsForLabels()}>
            {x}
          </Text>
        </G>
      );
    });
  }

  public render(): React.ReactNode {
    const paddingTop = 15;
    const paddingRight = 50;
    const {
      width,
      height,
      data,
      withHorizontalLabels = true,
      withVerticalLabels = true,
    } = this.props;

    const style = this.props.style ? StyleSheet.flatten(this.props.style) : {};

    const borderRadius = numericOrDefault(style.borderRadius, 0);

    const config = {
      width,
      height,
    };

    let border = 0;
    for (let i = 0; i < data.data.length; i++) {
      const actual = data.data[i].reduce((pv, cv) => pv + cv, 0);
      if (actual > border) {
        border = actual;
      }
    }

    return (
      <View style={style}>
        <Svg height={height} width={width}>
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
          <Rect
            width="100%"
            height={height}
            rx={borderRadius}
            ry={borderRadius}
            fill="url(#backgroundGradient)"
          />
          <G>
            {this.renderHorizontalLines({
              count: 4,
              paddingTop,
              width,
              height,
              paddingRight,
            })}
          </G>
          <G>
            {withHorizontalLabels
              ? this.renderHorizontalLabels({
                  ...config,
                  count: 4,
                  data: [0, border],
                  paddingTop,
                  paddingRight,
                })
              : null}
          </G>
          <G>
            {withVerticalLabels
              ? this.renderVerticalLabels({
                  ...config,
                  labels: data.labels,
                  paddingRight: paddingRight + 28,
                  stackedBar: true,
                  paddingTop,
                  horizontalOffset: barWidth,
                })
              : null}
          </G>
          <G>
            {this.renderBars({
              ...config,
              data: data.data,
              border,
              colors: this.props.data.barColors,
              paddingTop,
              paddingRight: paddingRight + 20,
            })}
          </G>
          {this.renderLegend({
            ...config,
            legend: data.legend,
            colors: this.props.data.barColors,
          })}
        </Svg>
      </View>
    );
  }
}
