import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Svg, Rect, G, Text} from 'react-native-svg';
import ChartComponent from '../abstracts/abstract-chart';
import {numericOrDefault} from '../../utils';
const barWidth = 32;
export class StackedBarChart extends ChartComponent {
  constructor(props) {
    super(props);
    this.getBarRadius = (ret, x) => {
      return this.props.chartConfig.barRadius && ret.length === x.length - 1
        ? this.props.chartConfig.barRadius
        : 0;
    };
  }
  getBarPercentage() {
    const {barPercentage = 1} = this.props.chartConfig;
    return barPercentage;
  }
  renderBars(config) {
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
      let ret = [];
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
            key={`rec_${i}_${z}`}
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
              key={`tex_${i}_${z}`}
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
  renderLegend(config) {
    const {legend, colors, width, height} = config;
    return legend.map((x, i) => {
      return (
        <G key={i}>
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
  render() {
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
//# sourceMappingURL=StackedBarChart.js.map
