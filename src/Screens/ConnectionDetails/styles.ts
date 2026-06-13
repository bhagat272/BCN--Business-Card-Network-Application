import {StyleSheet} from 'react-native';
import colors from '../../styles/colors';
import commonStyles from '../../styles/commonStyles';
import {
  moderateScale,
  moderateScaleVertical,
} from '../../styles/responsiveSize';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: moderateScale(12),
  },
  keyboard: {
    flex: 1,
  },
  profileContainer: {
    ...commonStyles.alignJustifyCenter,
    paddingVertical: moderateScale(10),
    alignSelf: 'center',
  },
  profileImage: {
    width: moderateScale(114),
    height: moderateScale(114),
    borderRadius: moderateScale(70),
    borderWidth: 1,
    borderColor: colors.grey,
  },
  name: {
    ...commonStyles.boldFont20,
    color: colors.deepBlue3,
  },
  // footer: {
  //   position: 'absolute',
  //   bottom: moderateScale(15),
  //   start: moderateScale(0),
  //   end: moderateScale(0),
  // },
  profileImage2: {
    width: moderateScale(130),
    height: moderateScale(130),
    borderRadius: moderateScale(65),
    borderWidth: 4,
    borderColor: colors.themeColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifyBtn: {
    borderWidth: 0,
    height: undefined,
  },
  inputStyle: {
    backgroundColor: colors.snowGray,
    borderColor: colors.snowGray,
    borderWidth: 0,
  },
  footerButton: {
    position: 'absolute',
    bottom: moderateScale(10),
    start: 0,
    end: 0,
    marginHorizontal: moderateScale(12),
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: moderateScaleVertical(20),
  },
  clearButton: {
    flex: 1,
    borderWidth: moderateScale(1),
    borderColor: colors.deepBlue,
    borderRadius: moderateScale(56),
    alignItems: 'center',
    marginRight: moderateScale(10),
  },
  clearText: {
    ...commonStyles.mediumFont14,
    fontSize: moderateScale(16),
    borderColor: colors.deepBlue,
  },
  applyButton: {
    flex: 1,
    height: moderateScaleVertical(40),
    borderRadius: moderateScale(56),
  },
  rightIconContainer: {
    marginEnd: moderateScale(10),
    resizeMode: 'contain',
    width: moderateScale(25),
    height: moderateScale(25),
  },
});
