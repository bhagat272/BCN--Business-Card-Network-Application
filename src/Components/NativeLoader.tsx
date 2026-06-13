import React, { FC } from 'react';
import {
  ActivityIndicator,
  ColorValue,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import colors from '../styles/colors';
import { height, width } from '../styles/responsiveSize';

interface Props {
  color?: ColorValue;
  size?: number | 'small' | 'large' | undefined;
  indicator?: StyleProp<ViewStyle>;
}
const NativeLoader: FC<Props> = props => {
  const { color = colors.themeColor, size = 20, indicator = {} } = props;
  return (
    <View style={styles.container}>
      <ActivityIndicator
        size={size}
        color={color}
        style={{ ...(indicator as object) }}
      />
    </View>
  );
};

export default React.memo(NativeLoader);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    height: height,
    width: width,
    zIndex: 99,
  },
});
