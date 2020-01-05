import {FunctionComponent} from 'react';
import {TextProps} from 'react-native-svg';
interface LegendItemProps {
  baseLegendItemX: number;
  index: number;
  legendOffset: number;
  legendText: string;
  labelProps: TextProps;
  iconColor: string;
}
declare const LegendItem: FunctionComponent<LegendItemProps>;
export default LegendItem;
