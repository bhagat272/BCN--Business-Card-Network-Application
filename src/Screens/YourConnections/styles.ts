import {StyleSheet} from 'react-native';
import colors from '../../styles/colors';
import commonStyles from '../../styles/commonStyles';
import {
  moderateScale,
  moderateScaleVertical,
} from '../../styles/responsiveSize';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  tabsContainer: {
    borderBottomWidth: 1,
    borderBottomColor: colors.grey10,
    maxHeight: moderateScaleVertical(50), // Fixed height for tabs
  },
  tab: {
    paddingHorizontal: moderateScale(12), // Reduced horizontal padding
    paddingVertical: moderateScaleVertical(10), // Reduced vertical padding
    borderBottomWidth: moderateScale(5),
    borderBottomColor: 'transparent',
    marginRight: moderateScale(8), // Spacing between tabs
  },
  activeTab: {
    position: 'relative',
    borderBottomColor: 'transparent',
    borderBottomWidth: 0, // Remove the default underline
  },
  activeTabUnderline: {
    position: 'absolute',
    left: moderateScale(0),
    bottom: 0,
    width: moderateScale(29),
    height: moderateScaleVertical(5),
    backgroundColor: colors.orange,
    borderRadius: moderateScale(3),
    marginLeft: moderateScale(12), // Adjust to align it properly with the tab
  },
  tabText: {
    ...commonStyles.mediumFont16,
  },
  activeTabText: {
    ...commonStyles.boldFont16,
    color: colors.orange,
  },
  content: {
    // paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScaleVertical(12),
    flex: 1,
  },
  cardDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  card: {
    flex: 1,
    flexDirection: 'row',
    padding: moderateScale(12),
    alignItems: 'center',
    marginBottom: moderateScaleVertical(8),
    borderRadius: moderateScale(16),
    marginHorizontal: moderateScale(16),
    backgroundColor: colors.white,
    // shadowColor: colors.transparentBlack,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.0,
    elevation: 5,
    marginTop: 10,
  },
  pendingCard: {
    flex: 1,
    flexDirection: 'row',
    padding: moderateScale(12),
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: moderateScaleVertical(8),
    borderRadius: moderateScale(16), // Smooth corners
    marginHorizontal: moderateScale(16),
    backgroundColor: colors.white,
    // shadowColor: colors.transparentBlack,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.0,
    elevation: 5,
    marginTop: 10,
    // Matches Android shadow level
  },
  profileImage: {
    width: moderateScale(50),
    height: moderateScale(50),
    borderRadius: moderateScale(25),
    marginRight: moderateScale(12),
  },
  name: {
    ...commonStyles.boldFont18,
    color: colors.darkblue,
    flex: 1,
  },
  email: {
    ...commonStyles.font14,
    color: colors.darkGrey,
  },
  message: {
    textAlign: 'center',
    fontSize: moderateScale(14),
    color: '#999',
    marginTop: moderateScaleVertical(20),
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  accept: {
    fontSize: moderateScale(20),
    color: colors.white,
  },
  reject: {
    fontSize: moderateScale(20),
    color: colors.black,
  },
  rejectButton: {
    // backgroundColor: colors.slateGray2,
    borderRadius: moderateScale(33),
    alignItems: 'center',
    width: moderateScale(32),
    height: moderateScaleVertical(32),
    marginHorizontal: moderateScale(12),
  },
  pendingCardDetails: {
    alignSelf: 'center',
  },
  acceptButton: {
    // backgroundColor: colors.seaGreen,
    borderRadius: moderateScale(33),
    alignItems: 'center',
    width: moderateScale(32),
    height: moderateScaleVertical(32),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    ...commonStyles.font14,
    color: colors.darkblue,
    textTransform: 'capitalize',
  },
  footerLoader: {
    ...commonStyles.footerComp2,
  },
});

export default styles;
