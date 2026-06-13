import colors from './colors';
import fontFamily from './fontFamily';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from './responsiveSize';

export const hitSlopProp = {
  top: 12,
  right: 12,
  left: 12,
  bottom: 12,
};

export default {
  alignJustifyCenter: {
    alignItems: 'center' as 'center',
    justifyContent: 'center' as 'center',
  },
  flexRowCenter: {
    flexDirection: 'row' as 'row',
    alignItems: 'center' as 'center',
  },
  flexRowSpaceBtwn: {
    flexDirection: 'row' as 'row',
    alignItems: 'center' as 'center',
    justifyContent: 'space-between' as 'space-between',
  },
  flex1AlignJustifyCenter: {
    flex: 1,
    alignItems: 'center' as 'center',
    justifyContent: 'center' as 'center',
  },
  flexRowJustifySpaceBtwn: {
    flexDirection: 'row' as 'row',
    justifyContent: 'space-between' as 'space-between',
  },
  itemSeparator: {
    height: moderateScaleVertical(16),
  },
  footerComp: {
    height: moderateScaleVertical(12),
  },
  footerComp2: {
    height: moderateScaleVertical(140),
  },
  absolute: {
    position: 'absolute' as 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
  },
  elevationShadow: {
    shadowColor: colors.grey,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  cardElevationShadow: {
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 6,
  },
  columnWrapper: {
    justifyContent: 'space-around' as 'space-around',
  },

  greyView: {
    backgroundColor: colors.vistaWhite,
    borderRadius: moderateScale(24),
    padding: moderateScale(20),
  },
  mediumFont8: {
    fontSize: textScale(8),
    color: colors.black,
    fontFamily: fontFamily.montserratMedium,
  },
  font10: {
    fontSize: textScale(10),
    color: colors.black,
    fontFamily: fontFamily.montserratRegular,
  },

  mediumFont10: {
    fontSize: textScale(10),
    color: colors.black,
    fontFamily: fontFamily.montserratMedium,
  },
  boldFont10: {
    fontSize: textScale(10),
    color: colors.black,
    fontFamily: fontFamily.montserratSemiBold,
  },
  font11: {
    fontSize: textScale(11),
    color: colors.black,
    fontFamily: fontFamily.montserratRegular,
  },
  mediumFont11: {
    fontSize: textScale(11),
    color: colors.black,
    fontFamily: fontFamily.montserratMedium,
  },

  boldFont11: {
    fontSize: textScale(11),
    color: colors.black,
    fontFamily: fontFamily.montserratSemiBold,
  },
  font12: {
    fontSize: textScale(12),
    color: colors.black,
    fontFamily: fontFamily.montserratRegular,
  },
  mediumFont12: {
    fontSize: textScale(12),
    color: colors.black,
    fontFamily: fontFamily.montserratMedium,
  },
  semiBoldFont12: {
    fontSize: textScale(12),
    color: colors.black,
    fontFamily: fontFamily.montserratSemiBold,
  },
  boldFont12: {
    fontSize: textScale(12),
    color: colors.black,
    fontFamily: fontFamily.montserratSemiBold,
  },

  font13: {
    fontSize: textScale(13),
    color: colors.black,
    fontFamily: fontFamily.montserratRegular,
  },
  mediumFont13: {
    fontSize: textScale(13),
    color: colors.black,
    fontFamily: fontFamily.montserratMedium,
  },
  semiBoldFont13: {
    fontSize: textScale(13),
    color: colors.black,
    fontFamily: fontFamily.montserratSemiBold,
  },
  boldFont13: {
    fontSize: textScale(13),
    color: colors.black,
    fontFamily: fontFamily.montserratSemiBold,
  },

  font14: {
    fontSize: textScale(14),
    color: colors.deepBlue,
    fontFamily: fontFamily.montserratRegular,
  },
  mediumFont14: {
    fontSize: textScale(14),
    color: colors.black,
    fontFamily: fontFamily.montserratMedium,
  },

  boldFont14: {
    fontSize: textScale(14),
    color: colors.black,
    fontFamily: fontFamily.montserratSemiBold,
  },
  font15: {
    fontSize: textScale(15),
    color: colors.black,
    fontFamily: fontFamily.montserratRegular,
  },
  mediumFont15: {
    fontSize: textScale(15),
    color: colors.black,
    fontFamily: fontFamily.montserratMedium,
  },

  boldFont15: {
    fontSize: textScale(15),
    color: colors.black,
    fontFamily: fontFamily.montserratSemiBold,
  },
  font16: {
    fontSize: textScale(16),
    color: colors.black,
    fontFamily: fontFamily.montserratRegular,
  },
  mediumFont16: {
    fontSize: textScale(16),
    color: colors.black,
    fontFamily: fontFamily.montserratMedium,
  },
  semiBoldFont16: {
    fontSize: textScale(16),
    color: colors.black,
    fontFamily: fontFamily.montserratSemiBold,
  },
  boldFont16: {
    fontSize: textScale(16),
    color: colors.black,
    fontFamily: fontFamily.montserratSemiBold,
  },
  font17: {
    fontSize: textScale(17),
    color: colors.black,
    fontFamily: fontFamily.montserratRegular,
  },
  mediumFont17: {
    fontSize: textScale(17),
    color: colors.black,
    fontFamily: fontFamily.montserratMedium,
  },

  boldFont17: {
    fontSize: textScale(17),
    color: colors.black,
    fontFamily: fontFamily.montserratSemiBold,
  },

  font18: {
    fontSize: textScale(18),
    color: colors.black,
    fontFamily: fontFamily.montserratRegular,
  },
  mediumFont18: {
    fontSize: textScale(18),
    color: colors.black,
    fontFamily: fontFamily.montserratMedium,
  },
  semiBoldFont18: {
    fontSize: textScale(18),
    color: colors.black,
    fontFamily: fontFamily.montserratSemiBold,
  },
  boldFont18: {
    fontSize: textScale(18),
    color: colors.black,
    fontFamily: fontFamily.montserratSemiBold,
  },

  font19: {
    fontSize: textScale(19),
    color: colors.black,
    fontFamily: fontFamily.montserratRegular,
  },
  mediumFont19: {
    fontSize: textScale(19),
    color: colors.black,
    fontFamily: fontFamily.montserratMedium,
  },

  boldFont19: {
    fontSize: textScale(19),
    color: colors.black,
    fontFamily: fontFamily.montserratSemiBold,
  },

  font20: {
    fontSize: textScale(20),
    color: colors.black,
    fontFamily: fontFamily.montserratRegular,
  },
  mediumFont20: {
    fontSize: textScale(20),
    color: colors.black,
    fontFamily: fontFamily.montserratMedium,
  },

  boldFont20: {
    fontSize: textScale(20),
    color: colors.black,
    fontFamily: fontFamily.montserratSemiBold,
  },
  semiBoldFont22: {
    fontSize: textScale(22),
    color: colors.black,
    fontFamily: fontFamily.montserratSemiBold,
  },
  boldFont22: {
    fontSize: textScale(22),
    color: colors.black,
    fontFamily: fontFamily.montserratSemiBold,
  },
  font24: {
    fontSize: textScale(24),
    color: colors.black,
    fontFamily: fontFamily.montserratRegular,
  },
  mediumFont24: {
    fontSize: textScale(24),
    color: colors.black,
    fontFamily: fontFamily.montserratMedium,
  },
  semiBoldFont24: {
    fontSize: textScale(24),
    color: colors.black,
    fontFamily: fontFamily.montserratSemiBold,
  },

  boldFont24: {
    fontSize: textScale(24),
    color: colors.black,
    fontFamily: fontFamily.montserratSemiBold,
  },
  font28: {
    fontSize: textScale(28),
    color: colors.black,
    fontFamily: fontFamily.montserratRegular,
  },
  mediumFont28: {
    fontSize: textScale(28),
    color: colors.black,
    fontFamily: fontFamily.montserratMedium,
  },

  boldFont28: {
    fontSize: textScale(28),
    color: colors.black,
    fontFamily: fontFamily.montserratSemiBold,
  },
  boldFont32: {
    fontSize: textScale(32),
    color: colors.black,
    fontFamily: fontFamily.montserratSemiBold,
  },
  boldFont26: {
    fontSize: textScale(26),
    color: colors.black,
    fontFamily: fontFamily.montserratSemiBold,
  },
};
