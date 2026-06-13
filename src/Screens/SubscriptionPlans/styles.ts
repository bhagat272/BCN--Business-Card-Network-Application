import {StyleSheet} from 'react-native';
import {
  moderateScale,
  moderateScaleVertical,
} from '../../styles/responsiveSize';
import commonStyles from '../../styles/commonStyles';
import colors from '../../styles/colors';

const styles = StyleSheet.create({
  container: {
    padding: moderateScale(16),
    backgroundColor: colors.white,
    flexGrow: 1,
  },
  section: {
    marginBottom: moderateScale(24),
    color: colors.lightText,
  },
  sectionTitle: {
    ...commonStyles.boldFont18,
    marginBottom: moderateScale(8),
  },
  planContainerPremium: {
    flex: 1,
    borderWidth: moderateScale(2),
    borderColor: colors.paleBlue2,
    borderRadius: moderateScale(8),
    padding: moderateScale(9),
    marginBottom: moderateScale(24),
    backgroundColor: colors.appWhite,
    marginHorizontal: moderateScale(2),
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  planTitle: {
    ...commonStyles.boldFont20,
    color: colors.lightText,
  },
  list: {
    marginTop: moderateScaleVertical(8),
  },
  listItem: {
    ...commonStyles.font14,
    color: colors.lightText,
    flex: 1,
  },
  listValue: {
    ...commonStyles.mediumFont15,
    color: colors.darkblue,
  },
  priceText: {
    ...commonStyles.font14,
    color: colors.lightText,
  },
  planPrice: {
    ...commonStyles.boldFont28,
    marginTop: moderateScaleVertical(1),
    color: colors.lightText,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: moderateScaleVertical(8),
  },
  switchLabel: {
    ...commonStyles.mediumFont16,
    marginHorizontal: moderateScale(10),
    marginStart: moderateScale(0),
  },
  saveText: {
    ...commonStyles.mediumFont16,
    backgroundColor: colors.yellow,
    margin: 0,
  },
  purchaseButton: {
    flex: 1,
    // marginHorizontal: moderateScale(12),
    marginBottom: moderateScale(64),
    marginLeft: 0,
    marginRight: 0,
  },
  footerContainer: {
    marginTop: moderateScaleVertical(8),
    marginBottom: moderateScaleVertical(10),
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  footerText: {
    ...commonStyles.font14,
    color: colors.darkblue,
  },
  toggle: {
    width: moderateScale(50),
    height: moderateScaleVertical(28),
    marginEnd: moderateScale(12),
  },
  premium_check: {
    width: moderateScale(18),
    height: moderateScale(18),
    tintColor: colors.darkOrange,
  },
  listItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: moderateScale(8),
  },
  listIcon: {
    position: 'absolute',
    tintColor: '#00C972',
    width: moderateScale(16),
    height: moderateScale(16),
    right: 5,
  },
  listIcon2: {
    tintColor: '#00C972',
    width: moderateScale(16),
    height: moderateScale(16),
    top: -8,
    marginRight: moderateScale(10),
  },
  selectedPlan: {
    borderColor: colors.darkblue,
    borderWidth: 2,
    backgroundColor: colors.lightBlue,
  },

  selectedProPlan: {
    borderColor: colors.darkOrange,
    borderWidth: 2,
    backgroundColor: colors.lightYellowish,
  },
  planSubtitle: {
    ...commonStyles.font15,
    color: colors.darkblue,
    marginTop: moderateScaleVertical(12),
  },
  planContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  manageButton: {
    alignItems: 'center',
    paddingVertical: moderateScale(10),
  },
  manageButtonText: {
    ...commonStyles.mediumFont16,
    color: colors.themeColor,
    textDecorationLine: 'underline',
  },
  subscribedButton: {
    marginBottom: moderateScale(24),
    borderRadius: moderateScale(8),
    overflow: 'hidden',
    marginTop: moderateScaleVertical(12),
  },
  gradient: {
    height: moderateScaleVertical(56),
    justifyContent: 'center',
    borderRadius: moderateScale(8),
    overflow: 'hidden',
  },
  subscribeButtonOverlay: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: moderateScale(6),
    margin: moderateScale(2),
    justifyContent: 'center',
  },
  subscribedButtonText: {
    ...commonStyles.boldFont18,
    color: colors.themeColor,
    textAlign: 'center',
  },
  restoreBtn: {
    color: colors.themeColor,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  restoreButtonContainer: {
    alignItems: 'center',
    // marginTop: moderateScaleVertical(4),
    // marginBottom: moderateScaleVertical(8),
  },
});
export default styles;
