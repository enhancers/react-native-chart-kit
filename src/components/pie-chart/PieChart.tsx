import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Color, G, Path, Rect, Svg, Text} from 'react-native-svg';

//@ts-ignore: missing type definitions and module declaration for paths-js
import Pie from 'paths-js/pie';

import ChartComponent, {
  BaseChartConfig,
  BaseChartProps,
} from '../abstracts/abstract-chart';
import {isNumeric, numericOrDefault} from '../../utils';

export interface PieChartData {
  name: string;
  color: Color;
  legendFontColor: Color;
  legendFontSize: number;
}

export interface PieChartConfig extends BaseChartConfig {
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

export interface PieChartProps extends BaseChartProps<PieChartConfig> {
  absolute?: false;
  hasLegend?: true;
  center?: [number, number];
  data: PieChartData[];
  accessor: string;

  // backgroundColor: string;
  // paddingLeft: string; // TODO: fix (moved to chartConfig)
}

export class PieChart<
  ChartProps extends PieChartProps = PieChartProps
> extends ChartComponent<ChartProps> {
  public constructor(props: ChartProps) {
    super(props);
  }

  public render(): React.ReactNode {
    const {absolute = false, hasLegend = true} = this.props;

    const style = this.props.style ? StyleSheet.flatten(this.props.style) : {};

    const borderRadius = numericOrDefault(style.borderRadius, 0);
    const paddingLeft = numericOrDefault(style.paddingLeft, 0);

    const {curves} = Pie({
      center: this.props.center || [0, 0],
      r: 0, // this.props.height / 2.5 - 30, // TODO: prop for "hole"
      R: this.props.height / 2.5,
      data: this.props.data,
      accessor: (data: PieChartData) =>
        this.props.accessor in data &&
        isNumeric((data as any)[this.props.accessor])
          ? Number((data as any)[this.props.accessor]) // TODO: fix this TS hack
          : 0,
    }) as {curves: any[]}; // TODO: missing chart (paths-js) typings

    const total = this.props.data.reduce((sum, item) => {
      return (
        sum +
        (isNumeric((item as any)[this.props.accessor])
          ? Number((item as any)[this.props.accessor]) // TODO: fix this TS hack
          : 0)
      );
    }, 0);

    const slices = curves.map((c, i) => {
      let value;

      if (absolute) {
        value = c.item[this.props.accessor];
      } else {
        if (total === 0) {
          value = 0 + '%';
        } else {
          value = Math.round((100 / total) * c.item[this.props.accessor]) + '%';
        }
      }

      return (
        <G key={i}>
          <Path d={c.sector.path.print()} fill={c.item.color} />
          {hasLegend ? (
            <Rect
              width="16px"
              height="16px"
              fill={c.item.color}
              rx={8}
              ry={8}
              x={this.props.width / 2.5 - 24}
              y={
                -(this.props.height / 2.5) +
                ((this.props.height * 0.8) / this.props.data.length) * i +
                12
              }
            />
          ) : null}
          {hasLegend ? (
            <Text
              fill={c.item.legendFontColor}
              fontSize={c.item.legendFontSize}
              x={this.props.width / 2.5}
              y={
                -(this.props.height / 2.5) +
                ((this.props.height * 0.8) / this.props.data.length) * i +
                12 * 2
              }>
              {`${value} ${c.item.name}`}
            </Text>
          ) : null}
        </G>
      );
    });

    return (
      <View
        style={[
          styles.viewWithoutPadding,
          {
            width: this.props.width,
            height: this.props.height,
            ...style,
          },
        ]}>
        <Svg width={this.props.width} height={this.props.height}>
          <G>
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
          </G>
          <Rect
            width="100%"
            height={this.props.height}
            rx={borderRadius}
            ry={borderRadius}
            fill="url(#backgroundGradient)"
          />
          <G
            x={this.props.width / 2 / 2 + paddingLeft}
            y={this.props.height / 2}>
            {slices}
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
