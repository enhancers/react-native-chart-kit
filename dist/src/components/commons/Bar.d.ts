import React, {PureComponent} from 'react';
import {Color} from 'react-native-svg';
export interface BarProps {
  startX?: number | null;
  startY?: number | null;
  isNegative?: boolean | null;
  barRadius?: number | null;
  width: number;
  height: number;
  fill: Color;
}
declare class Bar extends PureComponent<BarProps> {
  constructor(props: BarProps);
  render(): React.ReactNode;
  protected static getPath(config: {
    width: number;
    height: number;
    barRadius: number;
    isNegative: boolean;
    startX: number;
    startY: number;
  }): string;
}
export default Bar;
