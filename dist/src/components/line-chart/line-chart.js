import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Circle, G, Path, Polygon, Polyline, Rect, Svg} from 'react-native-svg';
import {numericOrDefault} from '../../utils';
import ChartComponent from '../abstracts/abstract-chart';
import LegendItem from './LegendItem';
export class LineChart extends ChartComponent {
  constructor(props) {
    super(props);
  }
  static getColor(props, dataset, opacity = 1) {
    return (dataset.color || props.chartConfig.color)(opacity);
  }
  static getStrokeWidth(props, dataset) {
    return dataset.strokeWidth || props.chartConfig.strokeWidth || 3;
  }
  static getDatas(data) {
    return data.reduce(
      (acc, item) => (item.data ? [...acc, ...item.data] : acc),
      [],
    );
  }
  static getPropsForDots(props, x, i) {
    const {getDotProps} = props;
    if (typeof getDotProps === 'function') {
      return getDotProps(x, i);
    }
    const {propsForDots = {}} = props.chartConfig;
    return {r: 4, ...propsForDots};
  }
  renderDots(config) {
    const {
      data,
      width,
      height,
      paddingTop,
      paddingRight,
      onDataPointClick,
    } = config;
    const output = [];
    const datas = LineChart.getDatas(data);
    const baseHeight = this.calcBaseHeight(datas, height);
    const {
      getDotColor,
      hidePointsAtIndex = [],
      renderDotContent = () => {
        return null;
      },
    } = this.props;
    data.forEach((dataset, i) => {
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
            getColor: opacity =>
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
  renderShadow(config) {
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
  renderLine(config) {
    if (this.props.bezier) {
      return this.renderBezierLine(config);
    }
    const {width, height, paddingRight, paddingTop, data} = config;
    let output = [];
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
  getBezierLinePoints(dataset, config) {
    const {width, height, paddingRight, paddingTop, data} = config;
    if (dataset.data.length === 0) {
      return 'M0,0';
    }
    const datas = LineChart.getDatas(data);
    const x = i =>
      Math.floor(
        paddingRight + (i * (width - paddingRight)) / dataset.data.length,
      );
    const baseHeight = this.calcBaseHeight(datas, height);
    const y = i => {
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
  renderBezierLine(config) {
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
  renderBezierShadow(config) {
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
  renderLegend(width, legendOffset) {
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
  render() {
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
      formatYLabel = yLabel => yLabel,
      formatXLabel = xLabel => xLabel,
    } = this.props;
    const style = this.props.style ? StyleSheet.flatten(this.props.style) : {};
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
//# sourceMappingURL=line-chart.js.map
