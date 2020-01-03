import React from 'react';
import {Color, LineProps, TextProps} from 'react-native-svg';
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
declare abstract class ChartComponent<
  P extends BaseChartProps = BaseChartProps,
  S extends {} = {}
> extends React.PureComponent<P, S> {
  protected constructor(props: P);
  protected calcScaler(data: number[]): number;
  protected calcBaseHeight(data: number[], height: number): number;
  protected calcHeight(val: number, data: number[], height: number): number;
  protected getPropsForBackgroundLines(): {
    opacity?: string | number | undefined;
    x1?: string | number | undefined;
    x2?: string | number | undefined;
    y1?: string | number | undefined;
    y2?: string | number | undefined;
    fill?: string | number | import('react-native-svg').rgbaArray | undefined;
    fillOpacity?: string | number | undefined;
    fillRule?: 'evenodd' | 'nonzero' | undefined;
    stroke: Color;
    strokeWidth: import('csstype').AnimationIterationCountProperty;
    strokeOpacity?: string | number | undefined;
    strokeDasharray:
      | string
      | number
      | readonly import('csstype').AnimationIterationCountProperty[];
    strokeDashoffset?: string | number | undefined;
    strokeLinecap?: 'round' | 'butt' | 'square' | undefined;
    strokeLinejoin?: 'round' | 'bevel' | 'miter' | undefined;
    strokeMiterlimit?: string | number | undefined;
    clipRule?: 'evenodd' | 'nonzero' | undefined;
    clipPath?: string | undefined;
    transform?:
      | string
      | import('react-native-svg').TransformObject
      | import('react-native-svg').ColumnMajorTransformMatrix
      | undefined;
    translate?:
      | string
      | number
      | import('csstype').AnimationIterationCountProperty[]
      | undefined;
    translateX?: string | number | undefined;
    translateY?: string | number | undefined;
    origin?:
      | string
      | number
      | import('csstype').AnimationIterationCountProperty[]
      | undefined;
    originX?: string | number | undefined;
    originY?: string | number | undefined;
    scale?:
      | string
      | number
      | import('csstype').AnimationIterationCountProperty[]
      | undefined;
    scaleX?: string | number | undefined;
    scaleY?: string | number | undefined;
    skew?:
      | string
      | number
      | import('csstype').AnimationIterationCountProperty[]
      | undefined;
    skewX?: string | number | undefined;
    skewY?: string | number | undefined;
    rotation?: string | number | undefined;
    x?:
      | string
      | number
      | import('csstype').AnimationIterationCountProperty[]
      | undefined;
    y?:
      | string
      | number
      | import('csstype').AnimationIterationCountProperty[]
      | undefined;
    vectorEffect?:
      | 'inherit'
      | 'none'
      | 'default'
      | 'non-scaling-stroke'
      | 'nonScalingStroke'
      | 'uri'
      | undefined;
    pointerEvents?: 'auto' | 'none' | 'box-none' | 'box-only' | undefined;
    onStartShouldSetResponder?:
      | ((event: import('react-native').GestureResponderEvent) => boolean)
      | undefined;
    onMoveShouldSetResponder?:
      | ((event: import('react-native').GestureResponderEvent) => boolean)
      | undefined;
    onResponderEnd?:
      | ((event: import('react-native').GestureResponderEvent) => void)
      | undefined;
    onResponderGrant?:
      | ((event: import('react-native').GestureResponderEvent) => void)
      | undefined;
    onResponderReject?:
      | ((event: import('react-native').GestureResponderEvent) => void)
      | undefined;
    onResponderMove?:
      | ((event: import('react-native').GestureResponderEvent) => void)
      | undefined;
    onResponderRelease?:
      | ((event: import('react-native').GestureResponderEvent) => void)
      | undefined;
    onResponderStart?:
      | ((event: import('react-native').GestureResponderEvent) => void)
      | undefined;
    onResponderTerminationRequest?:
      | ((event: import('react-native').GestureResponderEvent) => boolean)
      | undefined;
    onResponderTerminate?:
      | ((event: import('react-native').GestureResponderEvent) => void)
      | undefined;
    onStartShouldSetResponderCapture?:
      | ((event: import('react-native').GestureResponderEvent) => boolean)
      | undefined;
    onMoveShouldSetResponderCapture?:
      | ((event: import('react-native').GestureResponderEvent) => boolean)
      | undefined;
    disabled?: boolean | undefined;
    onPress?:
      | ((event: import('react-native').GestureResponderEvent) => void)
      | undefined;
    onPressIn?:
      | ((event: import('react-native').GestureResponderEvent) => void)
      | undefined;
    onPressOut?:
      | ((event: import('react-native').GestureResponderEvent) => void)
      | undefined;
    onLongPress?:
      | ((event: import('react-native').GestureResponderEvent) => void)
      | undefined;
    delayPressIn?: number | undefined;
    delayPressOut?: number | undefined;
    delayLongPress?: number | undefined;
    id?: string | undefined;
    marker?: string | undefined;
    markerStart?: string | undefined;
    markerMid?: string | undefined;
    markerEnd?: string | undefined;
    mask?: string | undefined;
  };
  protected getPropsForLabels(): {
    x?:
      | string
      | number
      | import('csstype').AnimationIterationCountProperty[]
      | undefined;
    y?:
      | string
      | number
      | import('csstype').AnimationIterationCountProperty[]
      | undefined;
    dx?:
      | string
      | number
      | import('csstype').AnimationIterationCountProperty[]
      | undefined;
    dy?:
      | string
      | number
      | import('csstype').AnimationIterationCountProperty[]
      | undefined;
    rotate?:
      | string
      | number
      | import('csstype').AnimationIterationCountProperty[]
      | undefined;
    opacity?: string | number | undefined;
    inlineSize?: string | number | undefined;
    alignmentBaseline?:
      | 'center'
      | 'baseline'
      | 'bottom'
      | 'top'
      | 'middle'
      | 'text-bottom'
      | 'text-top'
      | 'after-edge'
      | 'alphabetic'
      | 'before-edge'
      | 'central'
      | 'hanging'
      | 'ideographic'
      | 'mathematical'
      | 'text-after-edge'
      | 'text-before-edge'
      | undefined;
    baselineShift?:
      | string
      | number
      | readonly import('csstype').AnimationIterationCountProperty[]
      | undefined;
    verticalAlign?: string | number | undefined;
    lengthAdjust?: 'spacing' | 'spacingAndGlyphs' | undefined;
    textLength?: string | number | undefined;
    fontData?:
      | {
          [name: string]: unknown;
        }
      | null
      | undefined;
    fontFeatureSettings?: string | undefined;
    fill: Color;
    fillOpacity?: string | number | undefined;
    fillRule?: 'evenodd' | 'nonzero' | undefined;
    stroke?: string | number | import('react-native-svg').rgbaArray | undefined;
    strokeWidth?: string | number | undefined;
    strokeOpacity?: string | number | undefined;
    strokeDasharray?:
      | string
      | number
      | readonly import('csstype').AnimationIterationCountProperty[]
      | undefined;
    strokeDashoffset?: string | number | undefined;
    strokeLinecap?: 'round' | 'butt' | 'square' | undefined;
    strokeLinejoin?: 'round' | 'bevel' | 'miter' | undefined;
    strokeMiterlimit?: string | number | undefined;
    clipRule?: 'evenodd' | 'nonzero' | undefined;
    clipPath?: string | undefined;
    transform?:
      | string
      | import('react-native-svg').TransformObject
      | import('react-native-svg').ColumnMajorTransformMatrix
      | undefined;
    translate?:
      | string
      | number
      | import('csstype').AnimationIterationCountProperty[]
      | undefined;
    translateX?: string | number | undefined;
    translateY?: string | number | undefined;
    origin?:
      | string
      | number
      | import('csstype').AnimationIterationCountProperty[]
      | undefined;
    originX?: string | number | undefined;
    originY?: string | number | undefined;
    scale?:
      | string
      | number
      | import('csstype').AnimationIterationCountProperty[]
      | undefined;
    scaleX?: string | number | undefined;
    scaleY?: string | number | undefined;
    skew?:
      | string
      | number
      | import('csstype').AnimationIterationCountProperty[]
      | undefined;
    skewX?: string | number | undefined;
    skewY?: string | number | undefined;
    rotation?: string | number | undefined;
    vectorEffect?:
      | 'inherit'
      | 'none'
      | 'default'
      | 'non-scaling-stroke'
      | 'nonScalingStroke'
      | 'uri'
      | undefined;
    pointerEvents?: 'auto' | 'none' | 'box-none' | 'box-only' | undefined;
    onStartShouldSetResponder?:
      | ((event: import('react-native').GestureResponderEvent) => boolean)
      | undefined;
    onMoveShouldSetResponder?:
      | ((event: import('react-native').GestureResponderEvent) => boolean)
      | undefined;
    onResponderEnd?:
      | ((event: import('react-native').GestureResponderEvent) => void)
      | undefined;
    onResponderGrant?:
      | ((event: import('react-native').GestureResponderEvent) => void)
      | undefined;
    onResponderReject?:
      | ((event: import('react-native').GestureResponderEvent) => void)
      | undefined;
    onResponderMove?:
      | ((event: import('react-native').GestureResponderEvent) => void)
      | undefined;
    onResponderRelease?:
      | ((event: import('react-native').GestureResponderEvent) => void)
      | undefined;
    onResponderStart?:
      | ((event: import('react-native').GestureResponderEvent) => void)
      | undefined;
    onResponderTerminationRequest?:
      | ((event: import('react-native').GestureResponderEvent) => boolean)
      | undefined;
    onResponderTerminate?:
      | ((event: import('react-native').GestureResponderEvent) => void)
      | undefined;
    onStartShouldSetResponderCapture?:
      | ((event: import('react-native').GestureResponderEvent) => boolean)
      | undefined;
    onMoveShouldSetResponderCapture?:
      | ((event: import('react-native').GestureResponderEvent) => boolean)
      | undefined;
    disabled?: boolean | undefined;
    onPress?:
      | ((event: import('react-native').GestureResponderEvent) => void)
      | undefined;
    onPressIn?:
      | ((event: import('react-native').GestureResponderEvent) => void)
      | undefined;
    onPressOut?:
      | ((event: import('react-native').GestureResponderEvent) => void)
      | undefined;
    onLongPress?:
      | ((event: import('react-native').GestureResponderEvent) => void)
      | undefined;
    delayPressIn?: number | undefined;
    delayPressOut?: number | undefined;
    delayLongPress?: number | undefined;
    id?: string | undefined;
    marker?: string | undefined;
    markerStart?: string | undefined;
    markerMid?: string | undefined;
    markerEnd?: string | undefined;
    mask?: string | undefined;
    font?: import('react-native-svg').FontObject | undefined;
    fontStyle?: 'normal' | 'italic' | 'oblique' | undefined;
    fontVariant?: 'normal' | 'small-caps' | undefined;
    fontWeight?: string | number | undefined;
    fontStretch?:
      | 'normal'
      | 'condensed'
      | 'expanded'
      | 'extra-condensed'
      | 'extra-expanded'
      | 'semi-condensed'
      | 'semi-expanded'
      | 'ultra-condensed'
      | 'ultra-expanded'
      | 'wider'
      | 'narrower'
      | undefined;
    fontSize: import('csstype').AnimationIterationCountProperty;
    fontFamily?: string | undefined;
    textAnchor?: 'end' | 'start' | 'middle' | undefined;
    textDecoration?:
      | 'none'
      | 'blink'
      | 'line-through'
      | 'overline'
      | 'underline'
      | undefined;
    letterSpacing?: string | number | undefined;
    wordSpacing?: string | number | undefined;
    kerning?: string | number | undefined;
    fontVariantLigatures?: 'normal' | 'none' | undefined;
    fontVariationSettings?: string | undefined;
  };
  protected renderHorizontalLines(config: {
    count: number;
    width: number;
    height: number;
    paddingTop: number;
    paddingRight: number;
  }): JSX.Element[];
  protected renderHorizontalLine(config: {
    width: number;
    height: number;
    paddingTop: number;
    paddingRight: number;
  }): JSX.Element;
  protected renderHorizontalLabels(config: {
    count: number;
    data: number[];
    height: number;
    paddingTop: number;
    paddingRight: number;
    horizontalLabelRotation?: number;
    formatYLabel?: (yLabel: string) => string;
  }): JSX.Element[];
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
  }): (JSX.Element | null)[];
  protected renderVerticalLines(config: {
    data: number[];
    width: number;
    height: number;
    paddingTop: number;
    paddingRight: number;
  }): JSX.Element[];
  protected renderVerticalLine(config: {
    height: number;
    paddingTop: number;
    paddingRight: number;
  }): JSX.Element;
  protected renderDefs(config: {
    backgroundGradientFrom: Color;
    backgroundGradientTo: Color;
    width?: number;
    height?: number;
    fillShadowGradient?: Color;
    fillShadowGradientOpacity?: number;
    backgroundGradientFromOpacity?: number;
    backgroundGradientToOpacity?: number;
  }): JSX.Element;
  abstract render(): React.ReactNode;
}
export default ChartComponent;
