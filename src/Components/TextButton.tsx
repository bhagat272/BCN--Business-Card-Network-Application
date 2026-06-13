import React, { FC } from 'react';
import {
  GestureResponderEvent,
  Insets,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import colors from '../styles/colors';
import commonStyles from '../styles/commonStyles';

interface Props {
  onPress?: (event: GestureResponderEvent) => void;
  title?: string;
  btnStyle?: StyleProp<ViewStyle>;
  disabled?: boolean;
  btnTxtStyle?: StyleProp<TextStyle>;
  activeOpacity?: number;
  hitSlop?: Insets;
}

const TextButton: FC<Props> = props => {
  const {
    onPress = () => {},
    title = '',
    btnStyle = {},
    disabled = false,
    btnTxtStyle = {},
    activeOpacity = 0.8,
    hitSlop = {},
  } = props;

  return (
    <TouchableOpacity
      hitSlop={hitSlop}
      style={{
        ...styles.btnTouchContainer,
        ...(btnStyle as object),
      }}
      disabled={disabled}
      onPress={onPress}
      activeOpacity={activeOpacity}
    >
      <Text
        allowFontScaling={false}
        allowFontScaling={false}
        style={{
          ...styles.title,
          ...(btnTxtStyle as object),
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btnTouchContainer: {},
  title: {
    ...commonStyles.mediumFont14,
    color: colors.black,
  },
});

export default React.memo(TextButton);
