import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Color, G, Path, Rect, Svg, Text} from 'react-native-svg';

import ChartComponent, {
  BaseChartConfig,
  BaseChartProps,
} from '../abstracts/abstract-chart';
import {numericOrDefault} from '../../utils';

//@ts-ignore: missing type definitions and module declaration for paths-js
import Pie from 'paths-js/pie';

const barWidth: number = 32;

export type ProgressChartData = number[] | {labels?: string[]; data: number[]};

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

export class ProgressChart<
  ChartProps extends ProgressChartProps = ProgressChartProps
> extends ChartComponent<ChartProps> {
  public constructor(props: ChartProps) {
    super(props);
  }

  public render(): React.ReactNode {
    const {width, height, hideLegend} = this.props;
    const style = this.props.style ? StyleSheet.flatten(this.props.style) : {};

    const borderRadius = numericOrDefault(style.borderRadius, 0);
    const margin = numericOrDefault(style.margin, 0);
    const marginRight = numericOrDefault(style.marginRight, 0);

    const data: {labels?: string[]; data: number[]} = Array.isArray(
      this.props.data,
    )
      ? {
          data: this.props.data,
        }
      : (this.props.data as {labels?: string[]; data: number[]}); // TODO: review this TypeScript hack

    const pies = data.data.map((pieData, i) => {
      const r = ((height / 2 - barWidth) / data.data.length) * i + barWidth;
      return Pie({
        r,
        R: r,
        center: [0, 0],
        data: [pieData, 1 - pieData],
        accessor(x: number) {
          return x;
        },
      });
    });

    const pieBackgrounds = data.data.map((pieData, i) => {
      const r = ((height / 2 - barWidth) / data.data.length) * i + barWidth;
      return Pie({
        r,
        R: r,
        center: [0, 0],
        data: [0.999, 0.001],
        accessor(x: number) {
          return x;
        },
      });
    });

    const withLabel = (i: number) => data.labels && data.labels[i];

    const legend = !hideLegend && (
      <>
        <G>
          {pies.map((_, i) => {
            return (
              <Rect
                key={Math.random()}
                width="16px"
                height="16px"
                fill={this.props.chartConfig.color(0.2 * (i + 1), i)}
                rx={8}
                ry={8}
                x={this.props.width / 2.5 - 24}
                y={
                  -(this.props.height / 2.5) +
                  ((this.props.height * 0.8) / data.data.length) * i +
                  12
                }
              />
            );
          })}
        </G>
        <G>
          {pies.map((_, i) => {
            return (
              <Text
                key={Math.random()}
                x={this.props.width / 2.5}
                y={
                  -(this.props.height / 2.5) +
                  ((this.props.height * 0.8) / data.data.length) * i +
                  12 * 2
                }
                {...this.getPropsForLabels()}>
                {withLabel(i)
                  ? `${withLabel(i) as string} ${Math.round(
                      100 * data.data[i],
                    )}%`
                  : `${Math.round(100 * data.data[i])}%`}
              </Text>
            );
          })}
        </G>
      </>
    );

    return (
      <View
        style={[
          styles.viewWithoutPadding,
          {
            width,
            height,
            ...style,
          },
        ]}>
        <Svg width={width - margin * 2 - marginRight} height={height}>
          {this.renderDefs({
            backgroundGradientFrom: this.props.chartConfig
              .backgroundGradientFrom,
            backgroundGradientTo: this.props.chartConfig.backgroundGradientTo,
            width: this.props.width,
            height: this.props.height,
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
          <G x={this.props.width / 2.5} y={this.props.height / 2}>
            <G>
              {pieBackgrounds.map((pie, i) => {
                return (
                  <Path
                    key={Math.random()}
                    d={pie.curves[0].sector.path.print()}
                    strokeWidth={16}
                    stroke={this.props.chartConfig.color(0.2, i)}
                  />
                );
              })}
            </G>
            <G>
              {pies.map((pie, i) => {
                return (
                  <Path
                    key={Math.random()}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d={pie.curves[0].sector.path.print()}
                    strokeWidth={16}
                    stroke={this.props.chartConfig.color(
                      (i / pies.length) * 0.5 + 0.5,
                      i,
                    )}
                  />
                );
              })}
            </G>
            {legend}
          </G>
        </Svg>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewWithoutPadding: {
    padding: 0,
  },
});
