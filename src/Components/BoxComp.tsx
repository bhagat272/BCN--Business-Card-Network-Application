import React, { FC, useState } from 'react';
import {
  Image,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import imagePath from '../constants/imagePath';
import colors from '../styles/colors';
import commonStyles, { hitSlopProp } from '../styles/commonStyles';
import { moderateScale } from '../styles/responsiveSize';
import ImageButton from './ImageButton';

interface BoxCompProps {
  title: string;
  showCross?: boolean;
  onSelect?: () => void;
  boxStyle?: StyleProp<ViewStyle>;
  isSelected: boolean; // isSelected is now REQUIRED
}

const BoxComp: FC<BoxCompProps> = ({
  title,
  showCross = false,
  onSelect,
  boxStyle,
  isSelected,
}) => {
  const handlePress = () => {
    if (onSelect) {
      onSelect();
    }
  };

  return (
    <View
      style={[
        styles.container,
        boxStyle,
        isSelected ? styles.selectedBox : styles.defaultBox,
      ]}
    >
      {showCross && (
        <ImageButton
          imgSrc={imagePath.cross_black}
          btnStyle={styles.crossIcon}
          imgStyle={styles.crossIconStyle}
          resizeMode="contain"
          onPress={handlePress}
          hitSlop={hitSlopProp}
        />
      )}

      <Image
        source={
          isSelected
            ? imagePath.category_check_active
            : imagePath.category_check_inactive
        }
        style={styles.tickIcon}
        resizeMode="contain"
      />

      <Text
        allowFontScaling={false}
        style={[
          styles.text,
          isSelected ? styles.selectedText : styles.defaultText,
        ]}
      >
        {title}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: moderateScale(56),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    padding: moderateScale(8),
    marginBottom: moderateScale(5),
  },
  defaultBox: {
    backgroundColor: colors.grey10,
  },
  selectedBox: {
    backgroundColor: colors.lightGreen,
  },
  tickIcon: {
    width: moderateScale(12.23),
    height: moderateScale(12.23),
    marginRight: moderateScale(3),
  },
  crossIcon: {
    position: 'absolute',
    top: moderateScale(-8),
    right: moderateScale(-2),
    // borderWidth: moderateScale(1.5),
    // borderRadius: moderateScale(35),
    // borderColor: colors.grey11,
    zIndex: 1000,
  },
  crossIconStyle: {
    width: moderateScale(16),
    height: moderateScale(16),
  },
  text: {
    ...commonStyles.mediumFont14,
  },
  defaultText: {
    color: colors.grey11,
  },
  selectedText: {
    color: colors.green,
  },
});

export default React.memo(BoxComp);
