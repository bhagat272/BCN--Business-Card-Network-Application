import React, { FC } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import imagePath from '../constants/imagePath';
import colors from '../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../styles/responsiveSize';
import commonStyles from '../styles/commonStyles';

const SearchComp: FC = () => {
  return (
    <TouchableOpacity activeOpacity={0.8} style={styles.container}>
      <Image source={imagePath.searchHomeImage} style={styles.icon} />
      <Text
        allowFontScaling={false}
        Input
        style={styles.input}
        placeholder="Search..."
        placeholderTextColor={colors.slateGray}
      />
    </TouchableOpacity>
  );
};

export default SearchComp;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: moderateScale(12),
    height: moderateScale(48),
    paddingHorizontal: moderateScale(10),
    borderWidth: 1,
    borderColor: colors.tooLightGrey,
  },
  icon: {
    height: moderateScale(16),
    width: moderateScale(16),
    tintColor: colors.themeColor,
  },
  input: {
    ...commonStyles.font16,
    flex: 1,
    marginLeft: moderateScale(10),
    color: colors.slateGray,
  },
});
