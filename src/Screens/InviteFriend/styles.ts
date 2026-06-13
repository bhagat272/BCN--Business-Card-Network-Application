import { Platform, StyleSheet } from 'react-native';
import colors from '../../styles/colors';
import commonStyles from '../../styles/commonStyles';
import fontFamily from '../../styles/fontFamily';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  width,
} from '../../styles/responsiveSize';

const AMBASSADOR_TARGET = 5;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    height: height,
    width: width,
    zIndex: 99,
    backgroundColor: colors.whiteOpacity80,
  },
  scrollContent: {
    paddingHorizontal: moderateScale(20),
    paddingBottom: moderateScaleVertical(32),
    flexGrow: 1,
  },
  achievementCardBasic: {
    backgroundColor: colors.inviteFriendBasicTierBg,
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: colors.grey4,
    borderRadius: moderateScale(16),
    padding: moderateScale(16),
    marginTop: moderateScaleVertical(8),
    marginBottom: moderateScaleVertical(4),
  },
  basicTierBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.white,
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: colors.grey12,
    paddingHorizontal: moderateScale(14),
    paddingVertical: moderateScaleVertical(6),
    borderRadius: moderateScale(24),
    marginBottom: moderateScaleVertical(12),
  },
  basicTierBadgeText: {
    ...commonStyles.boldFont16,
    color: colors.themeColor,
  },
  achievementTitleBasic: {
    ...commonStyles.boldFont12,
    color: colors.themeColor,
    marginBottom: moderateScaleVertical(6),
    lineHeight: moderateScaleVertical(20),
  },
  achievementSubtitleBasic: {
    ...commonStyles.mediumFont12,
    color: colors.themeColor,
    lineHeight: moderateScaleVertical(20),
  },
  achievementGradient: {
    borderRadius: moderateScale(16),
    // padding: moderateScale(16),
    marginVertical: moderateScaleVertical(10),
    height: moderateScaleVertical(117),
  },
  ambassadorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.white,
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScaleVertical(8),
    borderRadius: moderateScale(24),
    marginBottom: moderateScaleVertical(12),
  },
  ambassadorStarCircle: {
    width: moderateScale(24),
    height: moderateScale(24),
    borderRadius: moderateScale(12),
    backgroundColor: colors.lemon,
    alignItems: 'center',
    justifyContent: 'center',
    marginEnd: moderateScale(8),
  },
  ambassadorStarIcon: {
    width: moderateScale(14),
    height: moderateScale(14),
    resizeMode: 'contain',
  },
  ambassadorBadgeLabel: {
    ...commonStyles.semiBoldFont16,
    color: colors.teal,
    marginLeft: moderateScale(6),
  },
  achievementTitleAmbassador: {
    ...commonStyles.semiBoldFont13,
    color: colors.white,
    marginBottom: moderateScaleVertical(6),
    lineHeight: moderateScaleVertical(20),
  },
  achievementSubtitleAmbassador: {
    ...commonStyles.mediumFont13,
    color: colors.white,
    opacity: 0.95,
  },
  sectionLabel: {
    ...commonStyles.boldFont16,
    marginBottom: moderateScaleVertical(10),
    marginTop: moderateScaleVertical(20),
  },
  sectionLabelFirst: {
    marginTop: moderateScaleVertical(8),
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.grey9,
    borderRadius: moderateScale(12),
    paddingVertical: moderateScaleVertical(16),
    paddingHorizontal: moderateScale(16),
  },
  codeText: {
    ...commonStyles.boldFont18,
    letterSpacing: moderateScale(0.5),
    flex: 1,
    marginEnd: moderateScale(8),
  },
  copyRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(6),
  },
  copyLabel: {
    fontFamily: fontFamily.poppinsSemiBold,
    fontSize: moderateScale(14),
    color: colors.darkOrange,
  },
  copyIconSmall: {
    width: moderateScale(18),
    height: moderateScale(18),
    resizeMode: 'contain',
    tintColor: colors.darkOrange,
  },
  shareRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(4),
  },
  shareItem: {
    alignItems: 'center',
    width: moderateScale(72),
  },
  shareCircle: {
    width: moderateScale(62),
    height: moderateScale(62),
    borderRadius: moderateScale(40),
    backgroundColor: colors.grey9,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: moderateScaleVertical(8),
  },
  shareIcon: {
    width: moderateScale(26),
    height: moderateScale(26),
    resizeMode: 'contain',
  },
  shareIconTint: {
    tintColor: colors.themeColor,
  },
  shareLabel: {
    ...commonStyles.mediumFont12,
    color: colors.themeColor,
    textAlign: 'center',
  },
  progressBox: {
    backgroundColor: colors.lightYellowish,
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: colors.darkOrange,
    borderRadius: moderateScale(12),
    padding: moderateScale(16),
    marginTop: moderateScaleVertical(24),
  },
  progressBg: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: moderateScaleVertical(12),
  },
  progressTitle: {
    ...commonStyles.boldFont14,
    color: colors.themeColor,
  },
  completeLabel: {
    ...commonStyles.boldFont10,
    color: colors.orange,
  },
  trackWrap: {
    height: moderateScaleVertical(28),
    justifyContent: 'center',
    marginBottom: moderateScaleVertical(6),
    overflow: 'hidden',
  },
  track: {
    height: moderateScaleVertical(8),
    borderRadius: moderateScale(4),
    backgroundColor: colors.inviteTrackPath,
    overflow: 'visible',
    position: 'relative',
    flexDirection: 'row',
  },
  trackFill: {
    height: '100%',
    borderRadius: moderateScale(4),
    backgroundColor: colors.darkOrange,
    overflow: 'hidden',
  },
  thumb: {
    // position: 'absolute',
    width: moderateScale(16),
    height: moderateScale(16),
    borderRadius: moderateScale(8),
    backgroundColor: colors.invitePathPointer,
    top: moderateScaleVertical(-4),
    marginLeft: moderateScale(-15),
    borderWidth: 2,
    borderColor: colors.white,
    zIndex: 2,
  },
  scaleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // paddingHorizontal: moderateScale(2),
    marginBottom: moderateScaleVertical(8),
    // borderWidth: 1,
  },
  scaleNum: {
    ...commonStyles.mediumFont11,
    color: colors.themeColor,
    // width: moderateScale(20),
    textAlign: 'center',
  },
  unlockHint: {
    ...commonStyles.mediumFont11,
    color: colors.orange,
    textAlign: 'right',
  },
  rewardCard: {
    backgroundColor: colors.vistaWhite,
    borderRadius: moderateScale(12),
    borderWidth: 1,
    borderColor: colors.grey5,
    padding: moderateScale(16),
    marginBottom: moderateScaleVertical(12),
  },
  rewardCardHighlight: {
    backgroundColor: colors.lightYellowish,
    borderColor: '#FF572233',
  },
  rewardCardTitle: {
    ...commonStyles.semiBoldFont16,
    marginBottom: moderateScaleVertical(12),
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: moderateScaleVertical(10),
  },
  benefitIcon: {
    width: moderateScale(20),
    height: moderateScale(20),
    marginEnd: moderateScale(10),
    resizeMode: 'contain',
  },
  benefitText: {
    ...commonStyles.mediumFont14,
    flex: 1,
    paddingTop: moderateScaleVertical(1),
  },
});

export default styles;
export { AMBASSADOR_TARGET };
