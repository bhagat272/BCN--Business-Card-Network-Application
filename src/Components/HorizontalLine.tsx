import React, {FC} from 'react';
import {StyleSheet, View} from 'react-native';
import colors from '../styles/colors';
import {moderateScaleVertical} from '../styles/responsiveSize';

interface Props {
  marginTop?: number;
  marginBottom?: number;
}

const HorizontalLine: FC<Props> = props => {
  const {
    marginTop = moderateScaleVertical(12),
    marginBottom = moderateScaleVertical(12),
  } = props;

  return (
    <View
      style={{
        ...styles.lineStyle,
        marginTop: marginTop,
        marginBottom: marginBottom,
      }}
    />
  );
};

export default React.memo(HorizontalLine);

const styles = StyleSheet.create({
  lineStyle: {
    height: 1,
    backgroundColor: colors.grey12,
  },
});
