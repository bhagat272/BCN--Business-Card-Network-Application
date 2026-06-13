import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import commonStyles from '../styles/commonStyles';
import { moderateScale } from '../styles/responsiveSize';
import colors from '../styles/colors';

type Props = {
  title: string;
  type: string;
  selected: boolean;
  setSelected: (selected: string) => void;
  color?: string;
  selectedColor?: string;
  disabled?: boolean;
};

const RadioButton = (props: Props) => {
  const { selected, setSelected, type, title, color, disabled, selectedColor } =
    props;
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={() => setSelected(type)}
      style={styles.container}
    >
      <View
        style={[
          styles.radio,
          selectedColor && { borderColor: selectedColor },
          disabled && { borderColor: colors.grey4 },
        ]}
      >
        {selected && (
          <View
            style={[
              styles.selectedRadio,
              selectedColor && { backgroundColor: selectedColor },
              disabled && { backgroundColor: colors.grey4 },
            ]}
          />
        )}
      </View>
      <Text
        allowFontScaling={false}
        style={[styles.text, disabled && { color: colors.grey4 }]}
      >
        {title || 'Radio'}
      </Text>
    </TouchableOpacity>
  );
};

export default RadioButton;

const styles = StyleSheet.create({
  container: {
    ...commonStyles.flexRowCenter,
    gap: moderateScale(8),
  },
  radio: {
    height: moderateScale(20),
    width: moderateScale(20),
    borderRadius: moderateScale(15),
    borderWidth: 2,
    borderColor: colors.themeColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedRadio: {
    height: moderateScale(12),
    width: moderateScale(12),
    borderRadius: moderateScale(10),
    backgroundColor: colors.themeColor,
  },
  text: {
    ...commonStyles.mediumFont16,
    marginHorizontal: moderateScale(10),
    marginStart: moderateScale(0),
  },
});
