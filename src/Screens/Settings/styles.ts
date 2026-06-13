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
    paddingHorizontal: moderateScale(12),
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.appWhite,
  },
  header: {
    paddingStart: moderateScale(8),
    paddingTop: moderateScaleVertical(10),
  },
  profileButton: {
    ...commonStyles.flexRowCenter,
    paddingHorizontal: moderateScale(15),
    paddingVertical: moderateScale(15),
    marginHorizontal: moderateScale(18),
    marginVertical: moderateScale(10),
    backgroundColor: colors.themeColor,
    borderRadius: moderateScale(16),
  },
  profileImage: {
    width: moderateScale(60),
    height: moderateScale(60),
    borderWidth: 1,
    borderColor: colors.tooLightGrey,
    borderRadius: moderateScale(35),
  },
  profileInfo: {
    marginHorizontal: moderateScale(10),
    flex: 1,
    justifyContent: 'center',
  },
  profileName: {
    ...commonStyles.boldFont18,
    color: colors.white,
  },
  profileEmail: {
    ...commonStyles.font14,
    color: colors.paleBlue,
    marginVertical: moderateScaleVertical(2),
  },
  user: {
    ...commonStyles.mediumFont14,
    color: colors.themeColor,
    flexShrink: 1,
  },
  account: {
    flex: 1,
    flexDirection: 'row',
    ...commonStyles.semiBoldFont18,
    marginStart: moderateScale(22),
    marginTop: moderateScaleVertical(15),
    marginBottom: moderateScale(5),
  },
  menuContainer: {
    marginBottom: moderateScaleVertical(30),
  },
  menuItem: {
    ...commonStyles.flexRowSpaceBtwn,
    paddingVertical: moderateScaleVertical(13),
    paddingBottom: moderateScaleVertical(3),
    paddingHorizontal: moderateScale(18),
  },
  menuItemLeft: {
    ...commonStyles.flexRowCenter,
  },
  menuIcon: {
    width: moderateScale(40),
    height: moderateScale(40),
    marginRight: moderateScale(15),
  },
  menuText: {
    ...commonStyles.mediumFont15,
  },
  menuItemRight: {
    alignItems: 'flex-end',
  },
  rightIcon: {
    width: moderateScale(8.44),
    height: moderateScale(8.01),
    resizeMode: 'contain',
  },
  toggle: {
    width: moderateScale(50),
    height: moderateScaleVertical(28),
  },
  arrow: {
    tintColor: colors.white,
    marginEnd: moderateScale(12),
  },
  tooltipContainer: {
    position: 'absolute',
    bottom: moderateScaleVertical(100),
    left: moderateScale(20),
    right: moderateScale(20),
    backgroundColor: colors.orange,
    padding: moderateScale(15),
    borderRadius: moderateScale(8),
  },
  tooltipText: {
    ...commonStyles.boldFont14,
    color: colors.white,
  },
  tooltipCloseButton: {
    position: 'absolute',
    top: moderateScale(5),
    right: moderateScale(5),
    padding: moderateScale(5),
  },
  tooltipCloseButtonText: {
    ...commonStyles.boldFont12,
    color: colors.white,
  },
  infoMessage: {
    width: moderateScale(10),
    height: moderateScale(10),
  },
});
