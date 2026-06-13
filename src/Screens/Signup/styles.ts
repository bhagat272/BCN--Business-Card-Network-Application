import {StyleSheet} from 'react-native';
import colors from '../../styles/colors';
import fontFamily from '../../styles/fontFamily';
import {
  moderateScale,
  moderateScaleVertical,
} from '../../styles/responsiveSize';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.appWhite,
    paddingHorizontal: moderateScale(12),
  },
  keyboard: {
    flex: 1,
  },
  checkboxContainer: {
    flex: 1,
    flexDirection: 'row',
    // marginTop: moderateScaleVertical(20),
    // paddingHorizontal: moderateScale(1),
  },
  error: {
    color: colors.red,
    marginStart: moderateScale(10),
    marginEnd: moderateScale(10),
    fontFamily: fontFamily.montserratRegular,
  },
});

export default styles;
