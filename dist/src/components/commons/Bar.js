import React, {PureComponent} from 'react';
import {Path} from 'react-native-svg';
//@ts-ignore: missing type definitions and module declaration for paths-js
import path from 'paths-js/path';
import {isNumeric} from '../../utils';
class Bar extends PureComponent {
  constructor(props) {
    super(props);
  }
  render() {
    const {width = 0, height = 0, fill = 'transparent'} = this.props;
    const startX = this.props.startX ?? 0;
    const startY = this.props.startY ?? 0;
    const isNegative = this.props.isNegative || false;
    let barRadius = this.props.barRadius ?? 0;
    if (
      [width, height, startX, startY, barRadius].some(
        value => !isNumeric(value),
      ) ||
      width === 0 ||
      height === 0 ||
      fill === 'transparent'
    ) {
      return null;
    }
    if (barRadius < 0) {
      barRadius = 0;
    }
    barRadius = Math.min(height / 2, width / 2, barRadius);
    return (
      <Path
        d={Bar.getPath({width, height, barRadius, isNegative, startX, startY})}
        fill={fill}
      />
    );
  }
  static getPath(config) {
    const {width, height, barRadius, isNegative, startX, startY} = config;
    const arcIs180 = Math.abs(width / 2 - barRadius) < Number.EPSILON;
    let barPath = path();
    if (!isNegative && barRadius > 0) {
      // Draw top first-half (left arc) or full 180 arc (if arcIs180)
      const arcConfig = arcIs180
        ? {
            x: startX + width,
            y: startY + barRadius,
            xrot: 180,
            largeArcFlag: 1,
            sweepFlag: 1,
            rx: barRadius,
            ry: barRadius,
          }
        : {
            x: startX + barRadius,
            y: startY,
            xrot: 90,
            largeArcFlag: 0,
            sweepFlag: 1,
            rx: barRadius,
            ry: barRadius,
          };
      barPath = barPath.moveto(startX, startY + barRadius).arc(arcConfig);
      if (!arcIs180) {
        // If needed, draw top second-half (right arc)
        barPath = barPath.hlineto(startX + width - barRadius).arc({
          x: startX + width,
          y: startY + barRadius,
          xrot: 90,
          largeArcFlag: 0,
          sweepFlag: 1,
          rx: barRadius,
          ry: barRadius,
        });
      }
    } else {
      barPath = barPath.moveto(startX, startY).hlineto(startX + width);
    }
    if (isNegative && barRadius > 0) {
      // Draw bottom first-half (right arc) or full 180 arc (if arcIs180)
      const arcConfig = arcIs180
        ? {
            x: startX,
            y: startY + height - barRadius,
            xrot: 180,
            largeArcFlag: 1,
            sweepFlag: 1,
            rx: barRadius,
            ry: barRadius,
          }
        : {
            x: startX + width - barRadius,
            y: startY + height,
            xrot: 90,
            largeArcFlag: 0,
            sweepFlag: 1,
            rx: barRadius,
            ry: barRadius,
          };
      barPath = barPath.vlineto(startY + height - barRadius).arc(arcConfig);
      if (!arcIs180) {
        // If needed, draw bottom second-half (left arc)
        barPath = barPath.hlineto(startX + barRadius).arc({
          x: startX,
          y: startY + height - barRadius,
          xrot: 90,
          largeArcFlag: 0,
          sweepFlag: 1,
          rx: barRadius,
          ry: barRadius,
        });
      }
    } else {
      barPath = barPath.vlineto(startY + height).hlineto(startX);
    }
    barPath = barPath.vlineto(startY); // close the path
    return barPath.print();
  }
}
export default Bar;
//# sourceMappingURL=Bar.js.map
