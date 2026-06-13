import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { FC } from 'react';
import { GestureResponderEvent } from 'react-native-modal';
import { moderateScale, moderateScaleVertical } from '../styles/responsiveSize';
import colors from '../styles/colors';
import commonStyles from '../styles/commonStyles';
import imagePath from '../constants/imagePath';

interface Props {
  onPress?: (event: GestureResponderEvent) => void;
  title?: string;
  container?: object;
}

const ContainerWithTopCross: FC<Props> = props => {
  const { onPress = () => {}, title = '', container = {} } = props;
  return (
    <TouchableOpacity
      style={{ marginTop: moderateScaleVertical(12) }}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <View style={{ ...styles.selectedStyle, ...(container as object) }}>
        <Text allowFontScaling={false} style={styles.textSelectedStyle}>
          {title}
        </Text>
      </View>

      <Image style={styles.cross} source={imagePath.cross_black} />
    </TouchableOpacity>
  );
};

export default React.memo(ContainerWithTopCross);

const styles = StyleSheet.create({
  selectedStyle: {
    borderRadius: moderateScale(6),
    backgroundColor: colors.lightBlue,
    // marginTop: moderateScale(10),
    marginRight: moderateScale(10),
    borderColor: colors.black,
    borderWidth: 1,
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScaleVertical(4),
  },
  textSelectedStyle: {
    ...commonStyles.mediumFont13,
  },
  cross: {
    width: moderateScale(16),
    height: moderateScale(16),
    position: 'absolute',
    end: 4,
    top: -moderateScaleVertical(8),
  },
});
