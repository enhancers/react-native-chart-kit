import React from 'react';
import {StyleSheet, View} from 'react-native';
import {G, Rect, Svg} from 'react-native-svg';
import ChartComponent from '../abstracts/abstract-chart';
import {numericOrDefault} from '../../utils';
const barWidth = 32;
export class BarChart extends ChartComponent {
  constructor(props) {
    super(props);
  }
  renderBars(config) {
    const {data, width, height, paddingTop, paddingRight} = config;
    const baseHeight = this.calcBaseHeight(data, height);
    return data.map((x, i) => {
      const barHeight = this.calcHeight(x, data, height);
      const calculatedBarWidth =
        barWidth * BarChart.getBarPercentage(this.props.chartConfig);
      return (
        <Rect
          key={Math.random()}
          x={
            paddingRight +
            (i * (width - paddingRight)) / data.length +
            calculatedBarWidth / 2
          }
          y={
            ((barHeight > 0 ? baseHeight - barHeight : baseHeight) / 4) * 3 +
            paddingTop
          }
          width={calculatedBarWidth}
          height={(Math.abs(barHeight) / 4) * 3}
          fill="url(#fillShadowGradient)"
        />
      );
    });
  }
  renderBarTops(config) {
    const {data, width, height, paddingTop, paddingRight} = config;
    const baseHeight = this.calcBaseHeight(data, height);
    return data.map((x, i) => {
      const barHeight = this.calcHeight(x, data, height);
      const calculatedBarWidth =
        barWidth * BarChart.getBarPercentage(this.props.chartConfig);
      return (
        <Rect
          key={Math.random()}
          x={
            paddingRight +
            (i * (width - paddingRight)) / data.length +
            calculatedBarWidth / 2
          }
          y={((baseHeight - barHeight) / 4) * 3 + paddingTop}
          width={calculatedBarWidth}
          height={2}
          fill={this.props.chartConfig.color(0.6)}
        />
      );
    });
  }
  render() {
    const {
      width,
      height,
      data,
      withHorizontalLabels = true,
      withVerticalLabels = true,
      verticalLabelRotation = 0,
      horizontalLabelRotation = 0,
      withInnerLines = true,
    } = this.props;
    const style = this.props.style ? StyleSheet.flatten(this.props.style) : {};
    const borderRadius = numericOrDefault(style.borderRadius, 0);
    const paddingTop = numericOrDefault(style.paddingTop, 16);
    const paddingRight = numericOrDefault(style.paddingRight, 64);
    const calculatedBarWidth =
      barWidth * BarChart.getBarPercentage(this.props.chartConfig);
    return (
      <View style={style}>
        <Svg height={height} width={width}>
          {this.renderDefs({
            width,
            height,
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
            {withInnerLines
              ? this.renderHorizontalLines({
                  width,
                  height,
                  count: 4,
                  paddingTop,
                  paddingRight,
                })
              : null}
          </G>
          <G>
            {withHorizontalLabels
              ? this.renderHorizontalLabels({
                  height,
                  count: 4,
                  data: data.datasets[0].data,
                  paddingTop,
                  paddingRight,
                })
              : null}
          </G>
          <G>
            {withVerticalLabels
              ? this.renderVerticalLabels({
                  width,
                  height,
                  labels: data.labels,
                  paddingRight,
                  paddingTop,
                  horizontalOffset: calculatedBarWidth,
                })
              : null}
          </G>
          <G>
            {this.renderBars({
              width,
              height,
              verticalLabelRotation,
              horizontalLabelRotation,
              data: data.datasets[0].data,
              paddingTop,
              paddingRight,
            })}
          </G>
          <G>
            {this.renderBarTops({
              width,
              height,
              data: data.datasets[0].data,
              paddingTop,
              paddingRight,
            })}
          </G>
        </Svg>
      </View>
    );
  }
}
BarChart.getBarPercentage = chartConfig => {
  const {barPercentage = 1} = chartConfig;
  return barPercentage;
};
//# sourceMappingURL=bar-chart.js.map
