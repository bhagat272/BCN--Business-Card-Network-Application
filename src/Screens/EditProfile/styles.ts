import {StyleSheet} from 'react-native';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../../styles/responsiveSize';
import commonStyles from '../../styles/commonStyles';
import colors from '../../styles/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.appWhite,
    paddingHorizontal: moderateScale(12),
  },
  keyboard: {
    flex: 1,
  },
  header: {
    paddingTop: moderateScaleVertical(10),
  },
  profileContainer: {
    ...commonStyles.alignJustifyCenter,
    paddingVertical: moderateScale(10),
    alignSelf: 'center',
  },
  profileImage: {
    width: moderateScale(110),
    height: moderateScale(110),
    borderRadius: moderateScale(55),
  },

  editIconImage: {
    // width: moderateScale(38),
    // height: moderateScale(38),
    borderRadius: moderateScale(60),
    position: 'absolute',
    bottom: moderateScaleVertical(8),
    right: moderateScale(10),
  },
  footer: {
    position: 'absolute',
    bottom: moderateScale(15),
    start: moderateScale(0),
    end: moderateScale(0),
  },
  profileImage2: {
    width: moderateScale(130),
    height: moderateScale(130),
    borderRadius: moderateScale(65),
    borderColor: colors.gradient,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifyBtn: {
    borderWidth: 0,
    height: undefined,
  },
  leftImg: {
    position: 'relative',
    left: -4,
    height: 20,
    width: 20,
  },
});
