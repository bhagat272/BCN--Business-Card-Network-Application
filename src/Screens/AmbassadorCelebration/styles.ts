import { StyleSheet } from 'react-native';
import colors from '../../styles/colors';
import commonStyles from '../../styles/commonStyles';
import fontFamily from '../../styles/fontFamily';
import {
  moderateScale,
  moderateScaleVertical,
} from '../../styles/responsiveSize';

export const AMBASSADOR_SCREEN_BG = '#009E91';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    // backgroundColor: AMBASSADOR_SCREEN_BG,
  },
  bgFill: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: moderateScale(20),
  },
  heroWrap: {
    alignItems: 'center',
    marginVertical: moderateScaleVertical(20),
  },
  ambassadorBadgeWrap: {
    borderRadius: moderateScale(50),
    borderWidth: 2,
    borderColor: colors.white,
    alignSelf: 'center',
    backgroundColor: colors.ambassadorCelebrationTextBg,
    marginTop: moderateScaleVertical(-25),
  },
  ambassadorBadgeText: {
    ...commonStyles.semiBoldFont12,
    marginHorizontal: moderateScale(15),
    marginVertical: moderateScale(5),
  },
  title: {
    ...commonStyles.semiBoldFont22,
    color: colors.white,
    textAlign: 'center',
    marginBottom: moderateScaleVertical(14),
  },
  congrats: {
    ...commonStyles.semiBoldFont16,
    color: colors.white,
    textAlign: 'center',
    lineHeight: moderateScaleVertical(25),
  },
  description: {
    ...commonStyles.mediumFont14,
    color: colors.white,
    textAlign: 'center',
    lineHeight: moderateScaleVertical(25),
    marginBottom: moderateScaleVertical(50),
  },
  benefitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: moderateScale(16),
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: 'rgba(255,255,255,0.55)',
    padding: moderateScale(16),
    marginBottom: moderateScaleVertical(12),
  },
  benefitIconCircle: {
    width: moderateScale(52),
    height: moderateScale(52),
    borderRadius: moderateScale(26),
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginEnd: moderateScale(14),
  },
  benefitIcon: {
    width: moderateScale(28),
    height: moderateScale(28),
    resizeMode: 'contain',
  },
  benefitTextCol: {
    flex: 1,
  },
  benefitTitle: {
    ...commonStyles.boldFont18,
    color: colors.ambassadorCelebrationTextBg,
    marginBottom: moderateScaleVertical(4),
  },
  benefitDesc: {
    ...commonStyles.mediumFont13,
    color: colors.white,
  },
  cta: {
    marginTop: moderateScaleVertical(8),
    backgroundColor: colors.white,
    borderRadius: moderateScale(14),
    alignItems: 'center',
    justifyContent: 'center',
    height: moderateScaleVertical(56),
  },
  ctaText: {
    ...commonStyles.mediumFont16,
    color: colors.themeColor,
  },
});

export default styles;
