import React, { FC } from 'react';
import {
  ActivityIndicator,
  ColorValue,
  GestureResponderEvent,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import colors from '../styles/colors';
import commonStyles from '../styles/commonStyles';
import { moderateScale, moderateScaleVertical } from '../styles/responsiveSize';

interface Props {
  onPress?: (event: GestureResponderEvent) => void;
  title?: string;
  btnStyle?: StyleProp<ViewStyle>;
  isLoading?: boolean;
  loaderColor?: ColorValue;
  disabled?: boolean;
  btnTxtStyle?: StyleProp<TextStyle>;
  indicatorSize?: number;
  numberOfLines?: number | undefined;
  gradientColors?: string[]; // New prop for gradient colors
}

const ButtonComp: FC<Props> = props => {
  const {
    onPress = () => {},
    title = '',
    btnStyle = {},
    isLoading = false,
    loaderColor = colors.white,
    disabled = false,
    btnTxtStyle = {},
    indicatorSize = 20,
    numberOfLines,
    gradientColors = [colors.themeColor, colors.deepTeal], // Default gradient colors
  } = props;

  return (
    <TouchableOpacity
      style={[styles.btnTouchContainer, btnStyle]}
      disabled={disabled || isLoading}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        {isLoading ? (
          <ActivityIndicator size={indicatorSize} color={loaderColor} />
        ) : (
          <Text
            allowFontScaling={false}
            numberOfLines={numberOfLines}
            style={[styles.title, btnTxtStyle]}
          >
            {title}
          </Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btnTouchContainer: {
    minHeight: moderateScaleVertical(56),
    borderRadius: moderateScale(12),
    marginHorizontal: moderateScale(10),
    overflow: 'hidden', // Ensures no color leaks outside the gradient
  },
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...commonStyles.mediumFont16,
    color: colors.white,
    textAlign: 'center',
  },
});

export default React.memo(ButtonComp);
